export type ListingType =
  | "physical_nft_unlockable"
  | "physical_unlockable"
  | "digital_nft"
  | "physical_certificate";

export type SaleHistoryEntry = {
  id: string;
  seller_wallet: string;
  buyer_wallet: string;
  price: number;
  currency: "ETH" | "USD";
  tx_hash: string | null;
  date: string;
};

export type Artwork = {
  id: string;
  title: string;
  description: string;
  artist_wallet: string;
  price: number;
  currency: "ETH" | "USD";
  cover_image_url: string;
  listing_type: ListingType;
  unlockable_content_url: string;
  nft_contract_address: string | null;
  nft_token_id: string | null;
  is_listed: boolean;
  current_owner_wallet: string;
  created_at: string;
  certificate?: {
    title: string;
    description: string;
    artist: string;
    dimensions: string;
    medium: string;
    year: number;
  };
  sale_history: SaleHistoryEntry[];
};

export const SIMULATED_WALLET = "0xF9e8D7c6B5a4F9e8D7c6B5a4F9e8D7c6B5a4F9e8";

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  physical_nft_unlockable: "Physical + NFT + Unlockable",
  physical_unlockable: "Physical + Unlockable",
  digital_nft: "Digital NFT",
  physical_certificate: "Physical + Certificate",
};

export const LISTING_TYPE_COLORS: Record<ListingType, string> = {
  physical_nft_unlockable: "bg-gold/15 text-foreground border border-gold/30",
  physical_unlockable: "bg-muted/10 text-foreground border border-muted/30",
  digital_nft: "bg-primary/10 text-foreground border border-primary/30",
  physical_certificate: "bg-gold/10 text-foreground border border-gold/20",
};

export const initialArtworks: Artwork[] = [
  {
    id: "1",
    title: "The Golden Hour",
    description:
      "An oil painting capturing the last light of a summer evening over the Tuscan hills. Each brushstroke was laid with a palette knife, creating rich texture and depth.",
    artist_wallet: "0xA1b2C3d4E5f6A1b2C3d4E5f6A1b2C3d4E5f6A1b2",
    price: 0.8,
    currency: "ETH",
    cover_image_url:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    listing_type: "physical_nft_unlockable",
    unlockable_content_url:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400",
    nft_contract_address: "0x1234567890abcdef1234567890abcdef12345678",
    nft_token_id: null,
    is_listed: true,
    current_owner_wallet: "0xA1b2C3d4E5f6A1b2C3d4E5f6A1b2C3d4E5f6A1b2",
    created_at: "2024-08-15",
    sale_history: [],
  },
  {
    id: "2",
    title: "Neon Reverie",
    description:
      "A generative digital artwork exploring the intersection of urban architecture and dream logic. Each element was hand-coded and rendered over 72 hours.",
    artist_wallet: "0xB2c3D4e5F6a7B2c3D4e5F6a7B2c3D4e5F6a7B2c3",
    price: 1.2,
    currency: "ETH",
    cover_image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    listing_type: "digital_nft",
    unlockable_content_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2400",
    nft_contract_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    nft_token_id: "1",
    is_listed: true,
    current_owner_wallet: SIMULATED_WALLET,
    created_at: "2024-10-01",
    sale_history: [
      {
        id: "s1",
        seller_wallet: "0xB2c3D4e5F6a7B2c3D4e5F6a7B2c3D4e5F6a7B2c3",
        buyer_wallet: SIMULATED_WALLET,
        price: 1.2,
        currency: "ETH",
        tx_hash:
          "0xabc123def456789abc123def456789abc123def456789abc123def456789abcd",
        date: "2024-11-14",
      },
    ],
  },
  {
    id: "3",
    title: "Quiet Morning",
    description:
      "A large format watercolor on cold press paper. The original piece measures 80x120cm and ships with conservation framing advice.",
    artist_wallet: "0xC3d4E5f6A7b8C3d4E5f6A7b8C3d4E5f6A7b8C3d4",
    price: 320,
    currency: "USD",
    cover_image_url:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800",
    listing_type: "physical_unlockable",
    unlockable_content_url:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=2400",
    nft_contract_address: null,
    nft_token_id: null,
    is_listed: true,
    current_owner_wallet: "0xC3d4E5f6A7b8C3d4E5f6A7b8C3d4E5f6A7b8C3d4",
    created_at: "2024-09-20",
    sale_history: [],
  },
  {
    id: "4",
    title: "Fracture Lines",
    description:
      "A study in controlled chaos. Geometric forms broken and reassembled through a custom algorithm built specifically for this series.",
    artist_wallet: "0xD4e5F6a7B8c9D4e5F6a7B8c9D4e5F6a7B8c9D4e5",
    price: 2.4,
    currency: "ETH",
    cover_image_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    listing_type: "digital_nft",
    unlockable_content_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=2400",
    nft_contract_address: "0xdef1234567890abcdef1234567890abcdef123456",
    nft_token_id: "2",
    is_listed: true,
    current_owner_wallet: SIMULATED_WALLET,
    created_at: "2024-07-10",
    sale_history: [
      {
        id: "s2",
        seller_wallet: "0xD4e5F6a7B8c9D4e5F6a7B8c9D4e5F6a7B8c9D4e5",
        buyer_wallet: "0x1111222233334444555566667777888899990000",
        price: 1.8,
        currency: "ETH",
        tx_hash:
          "0x111222333444555666777888999000aaabbbcccdddeeefff000111222333444",
        date: "2024-09-03",
      },
      {
        id: "s3",
        seller_wallet: "0x1111222233334444555566667777888899990000",
        buyer_wallet: SIMULATED_WALLET,
        price: 2.4,
        currency: "ETH",
        tx_hash:
          "0x444555666777888999000aaabbbcccdddeeefff000111222333444555666777",
        date: "2024-12-21",
      },
    ],
  },
  {
    id: "5",
    title: "Terra",
    description:
      "Mixed media on canvas combining acrylic, sand, and resin. The physical piece ships internationally with full insurance. The NFT serves as a permanent certificate of provenance.",
    artist_wallet: "0xA1b2C3d4E5f6A1b2C3d4E5f6A1b2C3d4E5f6A1b2",
    price: 1.5,
    currency: "ETH",
    cover_image_url:
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800",
    listing_type: "physical_nft_unlockable",
    unlockable_content_url:
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=2400",
    nft_contract_address: "0x567890abcdef1234567890abcdef123456789012",
    nft_token_id: null,
    is_listed: true,
    current_owner_wallet: "0xA1b2C3d4E5f6A1b2C3d4E5f6A1b2C3d4E5f6A1b2",
    created_at: "2024-11-05",
    sale_history: [],
  },
  {
    id: "6",
    title: "Vessel No. 7",
    description:
      "A hand-thrown stoneware vessel with ash glaze, fired in an anagama kiln over five days. One of a limited series of seven unique pieces.",
    artist_wallet: "0xE5f6A7b8C9d0E5f6A7b8C9d0E5f6A7b8C9d0E5f6",
    price: 580,
    currency: "USD",
    cover_image_url:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
    listing_type: "physical_certificate",
    unlockable_content_url:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=2400",
    nft_contract_address: "0x890abcdef1234567890abcdef12345678901234",
    nft_token_id: "3",
    is_listed: true,
    current_owner_wallet: "0xE5f6A7b8C9d0E5f6A7b8C9d0E5f6A7b8C9d0E5f6",
    created_at: "2024-12-01",
    certificate: {
      title: "Vessel No. 7",
      description:
        "Hand-thrown stoneware vessel, anagama kiln fired, ash glaze. One of seven unique pieces in the Vessel series.",
      artist: "0xE5f6A7b8C9d0E5f6A7b8C9d0E5f6A7b8C9d0E5f6",
      dimensions: "28cm H × 18cm W",
      medium: "Stoneware, ash glaze",
      year: 2024,
    },
    sale_history: [
      {
        id: "s4",
        seller_wallet: "0xE5f6A7b8C9d0E5f6A7b8C9d0E5f6A7b8C9d0E5f6",
        buyer_wallet: "0xB2c3D4e5F6a7B2c3D4e5F6a7B2c3D4e5F6a7B2c3",
        price: 580,
        currency: "USD",
        tx_hash: null,
        date: "2025-01-08",
      },
    ],
  },
];
