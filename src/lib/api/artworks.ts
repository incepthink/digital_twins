import { Artwork, ListingType } from "@/data/artworks";
import { Currency } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type UploadArtworkPayload = {
  title: string;
  description?: string | null;
  artist_wallet: string;
  price: number;
  currency: Currency;
  cover_image_url: string;
  listing_type: ListingType;
  unlockable_content_url?: string | null;
  is_listed?: boolean;
  current_owner?: number | null;
  collection_id?: number | null;
  cert_title?: string | null;
  cert_description?: string | null;
  cert_artist?: string | null;
  cert_dimensions?: string | null;
  cert_medium?: string | null;
  cert_year?: number | null;
};

export type UploadArtworkResponse = {
  success: boolean;
  data: {
    artwork: {
      id: string;
      [key: string]: unknown;
    };
  };
};

export type ArtworkDetailResponse = {
  id: string;
  title: string;
  description?: string | null;
  artist_wallet: string;
  price: string;
  currency: Currency;
  cover_image_url: string;
  listing_type: ListingType;
  unlockable_content_url?: string | null;
  nft_contract_address?: string | null;
  nft_token_id?: string | null;
  is_listed: boolean;
  current_owner: {
    eth_wallet_address: string;
  };
  collection_id: number | null;
  createdAt: string;
  updatedAt: string;
  sale_history: {
    id: string;
    seller_wallet: string;
    buyer_wallet: string;
    price: number;
    currency: Currency;
    date: string;
  }[];
  cert_title?: string | null;
  cert_description?: string | null;
  cert_artist?: string | null;
  cert_dimensions?: string | null;
  cert_medium?: string | null;
  cert_year?: number | null;
};

export async function getArtworkById(
  id: string,
  token: string,
): Promise<ArtworkDetailResponse> {
  const response = await fetch(`${API_BASE}/user/artwork/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body?.message || `Request failed with status ${response.status}`,
    );
  }
  const body = await response.json();
  return body.data;
}

type PlatformArtwork = {
  id: string;
  title: string;
  description: string | null;
  artist_wallet: string;
  price: string;
  currency: string;
  cover_image_url: string;
  listing_type: ListingType;
  unlockable_content_url: string | null;
  nft_contract_address: string | null;
  nft_token_id: string | null;
  is_listed: boolean;
  collection_id: number | null;
  createdAt: string;
  current_owner: { eth_wallet_address: string };
};

export async function getPlatformArtworks(): Promise<Artwork[]> {
  const response = await fetch(`${API_BASE}/platform/artwork`);
  if (!response.ok) {
    throw new Error(`Failed to fetch artworks: ${response.status}`);
  }
  const body = await response.json();
  return (body.data as PlatformArtwork[]).map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description ?? "",
    artist_wallet: a.artist_wallet,
    price: parseFloat(a.price),
    currency: a.currency as "ETH" | "USD",
    cover_image_url: a.cover_image_url,
    listing_type: a.listing_type,
    unlockable_content_url: a.unlockable_content_url ?? "",
    nft_contract_address: a.nft_contract_address,
    nft_token_id: a.nft_token_id,
    is_listed: a.is_listed,
    current_owner_wallet: a.current_owner.eth_wallet_address,
    created_at: a.createdAt,
    sale_history: [],
  }));
}

export async function buyArtwork(
  artwork_id: string,
  buyer_wallet: string,
  token: string,
): Promise<void> {
  const response = await fetch(`${API_BASE}/user/artwork/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ artwork_id, buyer_wallet }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body?.message || `Request failed with status ${response.status}`,
    );
  }
}

export async function uploadArtwork(
  payload: UploadArtworkPayload,
  token: string,
): Promise<UploadArtworkResponse> {
  const response = await fetch(`${API_BASE}/user/artwork/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body?.message || `Request failed with status ${response.status}`,
    );
  }

  return response.json();
}
