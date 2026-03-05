import { Artwork } from "@/data/artworks";
import { Lock, Download } from "lucide-react";

type Props = {
  artwork: Artwork;
  isOwner: boolean;
};

const UnlockableSection = ({ artwork, isOwner }: Props) => {
  return (
    <div className="space-y-3">
      <h3 className="font-heading text-xl">Unlockable Content</h3>

      {isOwner ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-accent/40 shadow-[0_0_20px_0_hsl(var(--gold)/0.15)] animate-fade-in">
          <div className="absolute top-3 right-3 z-10 bg-accent/90 text-accent-foreground text-[10px] uppercase tracking-widest px-2 py-1 rounded-full">
            Only visible to you
          </div>
          <img
            src={artwork.unlockable_content_url}
            alt={`${artwork.title} — hi-res unlockable`}
            className="w-full"
          />
          <div className="p-3 flex justify-end">
            <a
              href={artwork.unlockable_content_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-foreground transition-colors duration-500"
            >
              <Download className="w-3.5 h-3.5" />
              Download Hi-Res
            </a>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-accent/20 animate-pulse-gold">
          <div className="aspect-[4/3] bg-gallery-surface backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center p-6">
            <Lock className="w-8 h-8 text-accent/60" />
            <p className="font-heading text-lg">Unlockable Content Included</p>
            <p className="text-xs text-text-secondary max-w-xs">
              Purchase this artwork to reveal the exclusive hi-res version
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnlockableSection;
