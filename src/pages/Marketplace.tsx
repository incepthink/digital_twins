import { useState, useMemo, useEffect } from "react";
import { Artwork, ListingType } from "@/data/artworks";
import { getPlatformArtworks } from "@/lib/api/artworks";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import MasonryGrid from "@/components/MasonryGrid";

const Marketplace = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ListingType | "all">("all");

  useEffect(() => {
    getPlatformArtworks()
      .then(setArtworks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const listed = useMemo(
    () =>
      artworks
        .filter((a) => a.is_listed)
        .filter((a) => filter === "all" || a.listing_type === filter),
    [artworks, filter],
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="font-heading text-5xl md:text-6xl font-light mb-4 tracking-wide">
            Curated Artworks
          </h1>
          <div className="gold-divider max-w-24 mx-auto" />
        </div>
        <FilterBar active={filter} onChange={setFilter} />
        {loading ? (
          <div className="flex justify-center py-32">
            <p className="text-text-secondary animate-pulse">Loading artworks...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-32">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <MasonryGrid artworks={listed} />
        )}
      </main>
    </div>
  );
};

export default Marketplace;
