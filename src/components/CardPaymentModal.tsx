import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  onSubmit: (data: { cardNumber: string; expiry: string; cvv: string }) => void;
  onClose: () => void;
  loading: boolean;
};

const CardPaymentModal = ({ onSubmit, onClose, loading }: Props) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gallery-surface rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl">Payment Details</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ cardNumber, expiry, cvv });
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">Card Number</label>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">Expiry</label>
              <input
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="12/25"
                className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-1">CVV</label>
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 border border-accent text-foreground rounded text-sm hover:bg-accent/10 transition-all duration-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="gold-shimmer inline-block w-full h-5 rounded" />
            ) : (
              "Complete Purchase"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardPaymentModal;
