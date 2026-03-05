import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  currentPrice: number;
  currency: "ETH" | "USD";
  onSubmit: (price: number, isListed: boolean) => void;
  onClose: () => void;
};

const ListForSaleModal = ({ currentPrice, currency, onSubmit, onClose }: Props) => {
  const [price, setPrice] = useState(currentPrice.toString());
  const [isListed, setIsListed] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gallery-surface rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl">List for Sale</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">
              Price ({currency})
            </label>
            <input
              type="number"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isListed}
              onChange={(e) => setIsListed(e.target.checked)}
              className="accent-gold"
            />
            <span className="text-sm">List on marketplace</span>
          </label>

          <button
            onClick={() => onSubmit(parseFloat(price) || currentPrice, isListed)}
            className="w-full py-2.5 border border-accent text-foreground rounded text-sm hover:bg-accent/10 transition-all duration-500"
          >
            Update Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListForSaleModal;
