import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Arteva",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // replace with your project ID from cloud.walletconnect.com
  chains: [sepolia],
  ssr: false,
});
