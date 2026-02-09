import { Minus, Plus } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  price: number;
  onChange: (price: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const MIN_PRICE = 5;
const STEP = 5;

const StepPricing = ({ price, onChange, onNext, onBack }: Props) => {
  const decrement = () => onChange(Math.max(MIN_PRICE, price - STEP));
  const increment = () => onChange(price + STEP);

  const handleManualInput = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ""), 10);
    if (!isNaN(num) && num >= 0) onChange(num);
    if (val === "") onChange(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 3</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-10 leading-tight">
          Τώρα, ορίστε μια βασική τιμή για το κατάλυμα σας.
        </h1>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={decrement}
            disabled={price <= MIN_PRICE}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            aria-label="Μείωση τιμής"
          >
            <Minus className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-baseline gap-1">
            <span className="text-lg text-foreground font-medium">€</span>
            <input
              type="text"
              inputMode="numeric"
              value={price === 0 ? "" : price}
              onChange={(e) => handleManualInput(e.target.value)}
              className="text-6xl md:text-7xl font-bold text-foreground bg-transparent text-center outline-none w-40 md:w-52"
              aria-label="Τιμή ανά βράδυ"
            />
          </div>

          <button
            onClick={increment}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Αύξηση τιμής"
          >
            <Plus className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">ανά βράδυ</p>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={price < MIN_PRICE}
        progress={98}
      />
    </div>
  );
};

export default StepPricing;
