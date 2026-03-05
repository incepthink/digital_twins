import { ListingType } from "@/data/artworks";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type UploadArtworkPayload = {
  title: string;
  description?: string;
  artist_wallet: string;
  price: number;
  cover_image_url: string;
  listing_type: ListingType;
  unlockable_content_url?: string | null;
  nft_id?: number | null;
  is_listed?: boolean;
  current_owner_wallet: string;
};

export type UploadArtworkResponse = {
  id: number;
  [key: string]: unknown;
};

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
    throw new Error(body?.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}
