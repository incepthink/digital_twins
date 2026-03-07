import { ArtworkDetailResponse } from "@/lib/api/artworks";

type Props = {
  artwork: ArtworkDetailResponse;
  isOwner: boolean;
};

const CertificateSection = ({ artwork, isOwner }: Props) => {
  if (artwork.listing_type !== "physical_certificate" || !artwork.cert_title) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-xl">Certificate of Authenticity</h3>
      <div className="relative border border-accent/30 bg-gallery-surface rounded-lg p-6 overflow-hidden">
        {/* Watermark seal */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <div className="w-48 h-48 rounded-full border-[6px] border-foreground flex items-center justify-center">
            <span className="font-heading text-3xl tracking-[0.3em]">ARTEVA</span>
          </div>
        </div>

        <div className="relative space-y-3">
          <h4 className="font-heading text-lg font-semibold">{artwork.cert_title}</h4>
          <div className="gold-divider" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary">Artist</p>
              <p className="font-mono text-xs mt-0.5">{artwork.cert_artist?.slice(0, 10)}…</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary">Year</p>
              <p className="mt-0.5">{artwork.cert_year}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary">Dimensions</p>
              <p className="mt-0.5">{artwork.cert_dimensions}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary">Medium</p>
              <p className="mt-0.5">{artwork.cert_medium}</p>
            </div>
          </div>
          <div className="gold-divider" />
          <p className="text-sm text-text-secondary">{artwork.cert_description}</p>
          <p className="text-[10px] text-text-secondary/70 italic mt-4">
            This certificate is issued as an NFT on Ethereum Sepolia and is permanently linked to the physical artwork
          </p>
          {isOwner && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-[10px] uppercase tracking-widest text-accent">Certificate NFT owned by your wallet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateSection;
