import { ListingType, LISTING_TYPE_LABELS } from "@/data/artworks";

type FilterBarProps = {
  active: ListingType | "all";
  onChange: (filter: ListingType | "all") => void;
};

const filters: { value: ListingType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "physical_nft_unlockable", label: "Physical + NFT" },
  { value: "physical_unlockable", label: "Physical" },
  { value: "digital_nft", label: "Digital NFT" },
  { value: "physical_certificate", label: "Certificate" },
];

const FilterBar = ({ active, onChange }: FilterBarProps) => (
  <div className="flex flex-wrap gap-2 justify-center mb-12">
    {filters.map((f) => (
      <button
        key={f.value}
        onClick={() => onChange(f.value)}
        className={`px-4 py-1.5 rounded-full text-sm transition-all duration-500 border ${
          active === f.value
            ? "border-accent bg-accent/10 text-foreground"
            : "border-transparent text-text-secondary hover:border-accent/20 hover:text-foreground"
        }`}
      >
        {f.label}
      </button>
    ))}
  </div>
);

export default FilterBar;
