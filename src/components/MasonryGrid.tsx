import { Artwork } from "@/data/artworks";
import ArtworkCard from "./ArtworkCard";

const MasonryGrid = ({ artworks }: { artworks: Artwork[] }) => {
  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
        <p className="font-heading text-2xl text-text-secondary mb-2">No artworks found</p>
        <p className="text-sm text-text-secondary/70">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {artworks.map((artwork, i) => (
        <div
          key={artwork.id}
          className="break-inside-avoid animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <ArtworkCard artwork={artwork} />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
