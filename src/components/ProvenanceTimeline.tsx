import { ArtworkDetailResponse } from "@/lib/api/artworks";
import { truncateWallet, formatPrice } from "@/lib/format";

const ProvenanceTimeline = ({
  artwork,
}: {
  artwork: ArtworkDetailResponse;
}) => {
  const { sale_history, artist_wallet, listing_type } = artwork;

  const showProvenance = [
    "digital_nft",
    "physical_nft_unlockable",
    "physical_certificate",
  ].includes(listing_type);
  if (!showProvenance) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-xl">Provenance</h3>
      {sale_history.length === 0 ? (
        <p className="text-sm text-text-secondary italic">
          No sales history yet
        </p>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-accent/30">
          {sale_history.map((entry, i) => (
            <div key={entry.id} className="relative">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-accent bg-gallery-surface" />
              <div className="space-y-1">
                <p className="text-xs text-text-secondary">
                  {i === sale_history.length - 1 && entry.seller_wallet === artist_wallet
                    ? "Artist"
                    : entry.date}
                </p>
                <p className="text-sm">
                  <span className="font-mono text-xs text-text-secondary">
                    {truncateWallet(entry.seller_wallet)}
                  </span>
                  <span className="mx-2 text-accent">→</span>
                  <span className="font-mono text-xs text-text-secondary">
                    {truncateWallet(entry.buyer_wallet)}
                  </span>
                </p>
                <p className="text-sm font-medium">
                  {formatPrice(entry.price, entry.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProvenanceTimeline;
