import { useState, useEffect } from "react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { X, Delete } from "lucide-react";

interface PriceEditOverlayProps {
  isOpen: boolean;
  selectedDates: Date[];
  initialPrice: string;
  onSave: (price: string) => void;
  onClose: () => void;
}

const PriceEditOverlay = ({ isOpen, selectedDates, initialPrice, onSave, onClose }: PriceEditOverlayProps) => {
  const [price, setPrice] = useState(initialPrice);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPrice(initialPrice);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen, initialPrice]);

  if (!isOpen) return null;

  const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const dateLabel =
    sorted.length === 1
      ? format(first, "d MMM", { locale: el })
      : `${format(first, "d", { locale: el })}-${format(last, "d MMM", { locale: el })}`;

  const handleKey = (key: string) => {
    if (key === "delete") {
      setPrice((p) => p.slice(0, -1));
    } else {
      if (price.length < 6) setPrice((p) => (p === "0" ? key : p + key));
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col"
      style={{
        background: "rgba(15,15,15,0.98)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="w-10" />
        <span className="text-white text-base font-semibold">{dateLabel}</span>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Price display */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-baseline gap-2">
          <span className="text-white text-6xl font-bold tracking-tight">€</span>
          <span className="text-white text-6xl font-bold tracking-tight min-w-[60px]">
            {price || "0"}
          </span>
          <span className="w-0.5 h-14 bg-white/60 animate-pulse" />
        </div>
      </div>

      {/* Save button */}
      <div className="px-6 mb-4">
        <button
          onClick={() => onSave(price)}
          className="w-full py-4 rounded-xl bg-white text-neutral-900 text-base font-semibold active:scale-[0.98] transition-transform"
        >
          Αποθήκευση
        </button>
      </div>

      {/* Numeric keypad */}
      <div className="grid grid-cols-3 gap-px bg-neutral-800 border-t border-neutral-700">
        {keys.map((key, i) => (
          <button
            key={i}
            onClick={() => key && handleKey(key)}
            disabled={!key}
            className={`h-16 flex items-center justify-center text-2xl font-medium transition-colors ${
              key ? "text-white active:bg-neutral-600 bg-neutral-700/80" : "bg-neutral-800"
            }`}
          >
            {key === "delete" ? <Delete className="w-6 h-6" /> : key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceEditOverlay;
