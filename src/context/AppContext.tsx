import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Artwork, initialArtworks, SaleHistoryEntry } from "@/data/artworks";
import { buyArtwork as buyArtworkApi, updateListing } from "@/lib/api/artworks";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

type User = {
  id: string;
  email: string;
  user_name: string;
  description: string;
  profile_image: string | null;
  banner_image: string | null;
  badges: any[];
};

type AppContextType = {
  artworks: Artwork[];
  wallet: string | null;
  isConnected: boolean;
  user: User | null;
  token: string | null;
  isAuthenticating: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  authenticate: () => Promise<void>;
  logout: () => void;
  buyArtwork: (id: string) => Promise<void>;
  listArtwork: (id: string, price: number, isListed: boolean) => Promise<void>;
  addArtwork: (
    artwork: Omit<
      Artwork,
      | "id"
      | "created_at"
      | "sale_history"
      | "current_owner_wallet"
      | "is_listed"
    >,
  ) => string;
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const isLoggingOut = useRef(false);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { signMessageAsync } = useSignMessage();

  const wallet = address ?? null;

  const connectWallet = useCallback(
    () => openConnectModal?.(),
    [openConnectModal],
  );

  const logout = useCallback(() => {
    isLoggingOut.current = true;
    setUserState(null);
    setToken(null);
    Cookies.remove("jwt");
    disconnect();
  }, [disconnect]);

  const disconnectWallet = useCallback(() => logout(), [logout]);

  const authenticate = useCallback(async () => {
    if (!address || isAuthenticating || user) return;

    setIsAuthenticating(true);
    const toastId = toast.loading("Authenticating...");

    try {
      // Step 1: Request authentication token
      let tokenResponse: Response;
      try {
        tokenResponse = await fetch(
          `${API_BASE}/auth/wallet/request-token/${address}`,
        );
      } catch {
        toast.error("Failed to reach auth server", { id: toastId });
        return;
      }

      // 400 = wallet already authenticated — server returns user directly
      if (tokenResponse.status === 400) {
        const body = await tokenResponse.json();
        console.log(body);

        if (body?.userInstance) {
          const u = body.userInstance;
          setUserState({
            id: u.id,
            email: u.email,
            user_name: u.username || "guest_user",
            description: u.description || "this is a guest_user description",
            profile_image: u.profile_image ?? null,
            banner_image: u.banner_image ?? null,
            badges: u.badges || [],
          });
          setToken(Cookies.get("jwt") ?? "");
          toast.success("Welcome back! Already authenticated.", {
            id: toastId,
          });
          return;
        }
      }

      if (!tokenResponse.ok) {
        const body = await tokenResponse.json().catch(() => ({}));
        toast.error(body?.message || "Failed to get auth token", {
          id: toastId,
        });
        return;
      }

      const { message, token: authToken } = await tokenResponse.json();
      if (!message || !authToken) {
        toast.error("Invalid response from auth server", { id: toastId });
        return;
      }

      // Step 2: Sign the message with the connected wallet
      let signature: string;
      try {
        signature = await signMessageAsync({ account: address, message });
      } catch (signError: any) {
        if (
          signError?.code === 4001 ||
          signError?.message?.includes("User rejected") ||
          signError?.message?.includes("denied")
        ) {
          toast.error("Signature cancelled. You can try connecting again.", {
            id: toastId,
          });
        } else {
          toast.error("Failed to sign message. Please try again.", {
            id: toastId,
          });
        }
        disconnect();
        return;
      }

      // Step 3: Login with the signature
      const loginResponse = await fetch(`${API_BASE}/auth/wallet/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, address, token: authToken }),
      });

      if (!loginResponse.ok) {
        const body = await loginResponse.json().catch(() => ({}));
        toast.error(body?.message || "Login failed", { id: toastId });
        disconnect();
        return;
      }

      const { token: jwt, user_instance } = await loginResponse.json();
      if (!jwt || !user_instance) {
        toast.error("Invalid login response", { id: toastId });
        disconnect();
        return;
      }

      // Step 4: Store user data
      setUserState({
        id: user_instance.id,
        email: user_instance.email,
        user_name: user_instance.username || "guest_user",
        description:
          user_instance.description || "this is a guest_user description",
        profile_image: user_instance.profile_image ?? null,
        banner_image: user_instance.banner_image ?? null,
        badges: user_instance.badges || [],
      });
      setToken(jwt);
      Cookies.set("jwt", jwt, { sameSite: "Lax" });
      toast.success("Connected successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(
        `Authentication failed: ${error?.message || "Unknown error"}`,
        {
          id: toastId,
        },
      );
      disconnect();
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, isAuthenticating, user, signMessageAsync, disconnect]);

  // Auto-authenticate after wallet connects
  useEffect(() => {
    if (!isConnected) {
      isLoggingOut.current = false;
      return;
    }
    if (address && !user && !isAuthenticating && !isLoggingOut.current) {
      authenticate();
    }
  }, [isConnected, address, user, isAuthenticating, authenticate]);

  const buyArtwork = useCallback(
    async (id: string) => {
      if (!wallet) throw new Error("Wallet not connected");
      await buyArtworkApi(id, wallet, token);

      setArtworks((prev) =>
        prev.map((a) => {
          if (a.id !== id || !wallet) return a;
          const entry: SaleHistoryEntry = {
            id: `s${Date.now()}`,
            seller_wallet: a.current_owner_wallet,
            buyer_wallet: wallet,
            price: a.price,
            currency: a.currency,
            tx_hash:
              a.listing_type === "physical_unlockable"
                ? null
                : `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
            date: new Date().toISOString().split("T")[0],
          };
          return {
            ...a,
            current_owner_wallet: wallet,
            is_listed: true,
            sale_history: [...a.sale_history, entry],
          };
        }),
      );
    },
    [wallet, token],
  );

  const listArtwork = useCallback(
    async (id: string, price: number, isListed: boolean) => {
      await updateListing(id, { is_listed: isListed, price }, token);
      setArtworks((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, price, is_listed: isListed } : a,
        ),
      );
    },
    [token],
  );

  const addArtwork = useCallback(
    (
      artwork: Omit<
        Artwork,
        | "id"
        | "created_at"
        | "sale_history"
        | "current_owner_wallet"
        | "is_listed"
      >,
    ) => {
      const id = `art_${Date.now()}`;
      const newArtwork: Artwork = {
        ...artwork,
        id,
        created_at: new Date().toISOString().split("T")[0],
        sale_history: [],
        current_owner_wallet: wallet!,
        is_listed: true,
      };
      setArtworks((prev) => [newArtwork, ...prev]);
      return id;
    },
    [wallet],
  );

  return (
    <AppContext.Provider
      value={{
        artworks,
        wallet,
        isConnected,
        user,
        token,
        isAuthenticating,
        connectWallet,
        disconnectWallet,
        authenticate,
        logout,
        buyArtwork,
        listArtwork,
        addArtwork,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
