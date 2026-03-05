import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { LISTING_TYPE_LABELS, LISTING_TYPE_COLORS } from "@/data/artworks";
import { truncateWallet, formatPrice } from "@/lib/format";
import Navbar from "@/components/Navbar";
import UnlockableSection from "@/components/UnlockableSection";
import CertificateSection from "@/components/CertificateSection";
import ProvenanceTimeline from "@/components/ProvenanceTimeline";
import CardPaymentModal from "@/components/CardPaymentModal";
import ListForSaleModal from "@/components/ListForSaleModal";

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    artworks,
    wallet,
    isConnected,
    connectWallet,
    buyArtwork,
    listArtwork,
  } = useApp();
  const artwork = artworks.find((a) => a.id === id);

  const [buying, setBuying] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);

  const isOwner = isConnected && wallet === artwork?.current_owner_wallet;

  const handleBuy = useCallback(async () => {
    if (!artwork) return;
    if (artwork.listing_type === "physical_unlockable") {
      setShowCardModal(true);
      return;
    }
    setBuying(true);
    await buyArtwork(artwork.id);
    setBuying(false);
  }, [artwork, buyArtwork]);

  const handleCardPay = useCallback(async () => {
    if (!artwork) return;
    setCardLoading(true);
    await buyArtwork(artwork.id);
    setCardLoading(false);
    setShowCardModal(false);
  }, [artwork, buyArtwork]);

  if (!artwork) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
          <p className="font-heading text-2xl text-text-secondary mb-4">
            Artwork not found
          </p>
          <Link to="/" className="text-sm text-accent hover:underline">
            Return to gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="text-xs text-text-secondary hover:text-foreground transition-colors duration-500 mb-8 inline-block"
        >
          ← Back to gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-4">
          {/* Image */}
          <div className="lg:col-span-3 animate-fade-in">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src={artwork.cover_image_url}
                alt={artwork.title}
                className="w-full"
              />
            </div>
          </div>

          {/* Details */}
          <div
            className="lg:col-span-2 space-y-6 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <span
              className={`inline-block text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${LISTING_TYPE_COLORS[artwork.listing_type]}`}
            >
              {LISTING_TYPE_LABELS[artwork.listing_type]}
            </span>

            <h1 className="font-heading text-4xl md:text-5xl font-light leading-tight">
              {artwork.title}
            </h1>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-0.5">
                Artist
              </p>
              <p className="font-mono text-sm text-accent">
                {truncateWallet(artwork.artist_wallet)}
              </p>
            </div>

            <div className="gold-divider" />

            <p className="text-sm text-text-secondary leading-relaxed">
              {artwork.description}
            </p>

            <p className="font-heading text-3xl">
              {formatPrice(artwork.price, artwork.currency)}
            </p>

            {/* Action button */}
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="w-full py-3 border border-accent/40 rounded text-sm hover:border-accent hover:bg-accent/5 transition-all duration-500"
              >
                Connect Wallet to Buy
              </button>
            ) : isOwner ? (
              <button
                onClick={() => setShowListModal(true)}
                className="w-full py-3 border border-accent/40 rounded text-sm hover:border-accent hover:bg-accent/5 transition-all duration-500"
              >
                List for Sale
              </button>
            ) : (
              <button
                onClick={handleBuy}
                disabled={buying}
                className="w-full py-3 border-2 border-accent rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-500 disabled:opacity-50"
              >
                {buying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
                    Confirming transaction…
                  </span>
                ) : (
                  "Buy Now"
                )}
              </button>
            )}

            <div className="gold-divider" />

            <UnlockableSection artwork={artwork} isOwner={isOwner} />

            <CertificateSection artwork={artwork} isOwner={isOwner} />

            <div className="gold-divider" />

            <ProvenanceTimeline artwork={artwork} />
          </div>
        </div>
      </main>

      {showCardModal && (
        <CardPaymentModal
          loading={cardLoading}
          onSubmit={handleCardPay}
          onClose={() => setShowCardModal(false)}
        />
      )}

      {showListModal && (
        <ListForSaleModal
          currentPrice={artwork.price}
          currency={artwork.currency}
          onSubmit={(price, isListed) => {
            listArtwork(artwork.id, price, isListed);
            setShowListModal(false);
          }}
          onClose={() => setShowListModal(false)}
        />
      )}
    </div>
  );
};

export default ArtworkDetail;
