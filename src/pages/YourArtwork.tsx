import { useState, useEffect } from "react";
import { Artwork } from "@/data/artworks";
import { getUserArtworks } from "@/lib/api/artworks";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import MasonryGrid from "@/components/MasonryGrid";

const YourArtwork = () => {
  const { wallet, user } = useApp();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet || !user) return;
    getUserArtworks(wallet, user.id)
      .then(setArtworks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [wallet, user]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="font-heading text-5xl md:text-6xl font-light mb-4 tracking-wide">
            Your Artworks
          </h1>
          <div className="gold-divider max-w-24 mx-auto" />
        </div>
        {loading ? (
          <div className="flex justify-center py-32">
            <p className="text-text-secondary animate-pulse">Loading artworks...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-32">
            <p className="text-red-400">{error}</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
            <p className="font-heading text-2xl text-text-secondary mb-2">You have not created any artworks</p>
          </div>
        ) : (
          <MasonryGrid artworks={artworks} />
        )}
      </main>
    </div>
  );
};

export default YourArtwork;
