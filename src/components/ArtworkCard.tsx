import { Link } from "react-router-dom";
import { Artwork, LISTING_TYPE_LABELS, LISTING_TYPE_COLORS } from "@/data/artworks";
import { formatPrice } from "@/lib/format";
import { truncateWallet } from "@/lib/format";

const ArtworkCard = ({ artwork }: { artwork: Artwork }) => (
  <Link
    to={`/artwork/${artwork.id}`}
    className="group block bg-gallery-surface rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-700"
  >
    <div className="relative overflow-hidden">
      <img
        src={artwork.cover_image_url}
        alt={artwork.title}
        className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-700 flex items-center justify-center">
        <span className="font-heading text-lg tracking-widest text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-700 uppercase">
          View Artwork
        </span>
      </div>
    </div>
    <div className="p-5 space-y-2">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${LISTING_TYPE_COLORS[artwork.listing_type]}`}>
          {LISTING_TYPE_LABELS[artwork.listing_type]}
        </span>
      </div>
      <h3 className="font-heading text-xl font-medium leading-tight">{artwork.title}</h3>
      <p className="text-xs text-text-secondary font-mono">{truncateWallet(artwork.artist_wallet)}</p>
      <p className="text-sm font-medium">{formatPrice(artwork.price, artwork.currency)}</p>
    </div>
  </Link>
);

export default ArtworkCard;
