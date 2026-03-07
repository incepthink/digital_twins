import { useState, useRef, useCallback } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { ListingType } from "@/data/artworks";
import { uploadArtwork } from "@/lib/api/artworks";
import { uploadImage } from "@/lib/api/upload";
import Navbar from "@/components/Navbar";
import { Upload, Check } from "lucide-react";

const listingOptions: { value: ListingType; label: string; desc: string }[] = [
  {
    value: "physical_nft_unlockable",
    label: "Physical + NFT + Unlockable",
    desc: "Ship the physical artwork, mint an NFT, and include hi-res unlockable content",
  },
  {
    value: "physical_unlockable",
    label: "Physical + Unlockable",
    desc: "Ship the physical artwork with hi-res unlockable content. No NFT",
  },
  {
    value: "digital_nft",
    label: "Digital NFT",
    desc: "Mint a digital NFT with hi-res unlockable content",
  },
  {
    value: "physical_certificate",
    label: "Physical + Certificate",
    desc: "Ship the physical artwork with a Certificate of Authenticity NFT",
  },
];

const CreateListing = () => {
  const { isConnected, wallet, token } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listingType, setListingType] = useState<ListingType>(
    "physical_nft_unlockable",
  );
  const [price, setPrice] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [unlockablePreview, setUnlockablePreview] = useState<string | null>(
    null,
  );
  const [unlockableFile, setUnlockableFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState("");
  const [medium, setMedium] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const coverRef = useRef<HTMLInputElement>(null);
  const unlockableRef = useRef<HTMLInputElement>(null);

  const isNFTType =
    listingType === "physical_nft_unlockable" ||
    listingType === "digital_nft" ||
    listingType === "physical_certificate";
  const currency = isNFTType ? ("ETH" as const) : ("USD" as const);

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (v: string) => void,
    setFile: (f: File) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const FALLBACK_COVER =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";
  const FALLBACK_UNLOCKABLE =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      console.log(!token);
      e.preventDefault();
      if (!wallet) return;
      setSubmitting(true);

      try {
        const [coverUrl, unlockableUrl] = await Promise.all([
          coverFile ? uploadImage(coverFile) : Promise.resolve(FALLBACK_COVER),
          unlockableFile
            ? uploadImage(unlockableFile)
            : Promise.resolve(FALLBACK_UNLOCKABLE),
        ]);

        const response = await uploadArtwork(
          {
            title,
            description,
            artist_wallet: wallet,
            price: parseFloat(price) || 0,
            currency,
            cover_image_url: coverUrl,
            listing_type: listingType,
            unlockable_content_url: unlockableUrl,
            is_listed: true,
            current_owner: null,
            collection_id: null,
            cert_title: listingType === "physical_certificate" ? title : null,
            cert_description:
              listingType === "physical_certificate" ? description : null,
            cert_artist: listingType === "physical_certificate" ? wallet : null,
            cert_dimensions:
              listingType === "physical_certificate" ? dimensions : null,
            cert_medium: listingType === "physical_certificate" ? medium : null,
            cert_year:
              listingType === "physical_certificate"
                ? parseInt(year) || new Date().getFullYear()
                : null,
          },
          token,
        );

        setSuccessId(response.data.artwork.id);
      } catch (err: any) {
        toast.error(err?.message || "Failed to create listing");
      } finally {
        setSubmitting(false);
      }
    },
    [
      title,
      description,
      price,
      currency,
      coverPreview,
      unlockablePreview,
      listingType,
      dimensions,
      medium,
      year,

      isNFTType,
      wallet,
      token,
      coverFile,
      unlockableFile,
    ],
  );

  if (!isConnected) return <Navigate to="/" replace />;

  if (successId) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-heading text-3xl mb-2">Artwork Listed</h2>
          <p className="text-sm text-text-secondary mb-6">
            Your artwork is now visible on the marketplace
          </p>
          <Link
            to={`/artwork/${successId}`}
            className="text-sm text-accent hover:underline"
          >
            View your artwork →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-heading text-4xl font-light mb-2 animate-fade-in">
          List an Artwork
        </h1>
        <div className="gold-divider max-w-16 mb-12" />

        <form
          onSubmit={handleSubmit}
          className="space-y-8 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          {/* Cover image upload */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-2">
              Artwork Image
            </label>
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageSelect(e, setCoverPreview, setCoverFile)
              }
            />
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              className="w-full aspect-[3/2] border border-dashed border-accent/30 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent/60 transition-colors duration-500 overflow-hidden"
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-text-secondary" />
                  <span className="text-sm text-text-secondary">
                    Drop image or click to upload
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Unlockable upload */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">
              Unlockable Content
            </label>
            <p className="text-xs text-text-secondary/70 mb-2">
              Hi-res unlockable version — only revealed to the buyer after
              purchase
            </p>
            <input
              ref={unlockableRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageSelect(e, setUnlockablePreview, setUnlockableFile)
              }
            />
            <button
              type="button"
              onClick={() => unlockableRef.current?.click()}
              className="w-full py-8 border border-dashed border-accent/20 rounded-lg flex items-center justify-center gap-2 hover:border-accent/40 transition-colors duration-500"
            >
              {unlockablePreview ? (
                <span className="text-sm text-accent">
                  ✓ Unlockable image selected
                </span>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm text-text-secondary">
                    Upload hi-res version
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-transparent border-b border-input focus:border-accent outline-none text-lg font-heading transition-colors duration-500"
              placeholder="Untitled"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-transparent border border-input rounded focus:border-accent outline-none text-sm resize-none transition-colors duration-500"
              placeholder="Describe your artwork…"
            />
          </div>

          {/* Listing type */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-3">
              Listing Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listingOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setListingType(opt.value)}
                  className={`text-left p-4 rounded-lg border transition-all duration-500 ${
                    listingType === opt.value
                      ? "border-accent bg-accent/5"
                      : "border-input hover:border-accent/30"
                  }`}
                >
                  <p className="text-sm font-medium mb-1">{opt.label}</p>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Certificate fields */}
          {listingType === "physical_certificate" && (
            <div className="space-y-4 p-4 border border-accent/20 rounded-lg">
              <p className="text-[10px] uppercase tracking-widest text-text-secondary">
                Certificate Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">
                    Dimensions
                  </label>
                  <input
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border-b border-input focus:border-accent outline-none text-sm transition-colors"
                    placeholder="30cm × 40cm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">
                    Medium
                  </label>
                  <input
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border-b border-input focus:border-accent outline-none text-sm transition-colors"
                    placeholder="Oil on canvas"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">
                  Year
                </label>
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  type="number"
                  className="w-full px-3 py-2 bg-transparent border-b border-input focus:border-accent outline-none text-sm transition-colors max-w-32"
                />
              </div>
            </div>
          )}

          {/* Price */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">
              Price ({currency})
            </label>
            <input
              type="number"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-3 py-2 bg-transparent border-b border-input focus:border-accent outline-none text-lg font-heading transition-colors duration-500"
              placeholder={currency === "ETH" ? "0.00" : "0"}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 border-2 border-accent rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-500 disabled:opacity-50"
          >
            {submitting ? (
              <span className="skeleton-warm inline-block w-full h-5 rounded" />
            ) : (
              "List Artwork"
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
