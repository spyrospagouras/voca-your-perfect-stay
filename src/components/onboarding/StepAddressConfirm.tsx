import { useState } from "react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  address: string;
  onUpdate: (data: { street: string; zip: string; city: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepAddressConfirm = ({ address, onUpdate, onNext, onBack }: Props) => {
  // Try to parse initial address parts
  const parts = address.split(",").map((s) => s.trim());
  const [street, setStreet] = useState(parts[0] || "");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState(parts[1] || parts[2] || "");

  const handleNext = () => {
    onUpdate({ street, zip, city });
    onNext();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 px-6 pt-10 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 2</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Επιβεβαιώστε τη διεύθυνσή σας
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Η διεύθυνσή σας κοινοποιείται μόνο στους επιβεβαιωμένους επισκέπτες.
        </p>

        <div className="space-y-5">
          {/* Street */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Οδός
            </label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="π.χ. Χαριλάου Τρικούπη 4"
              className="w-full h-12 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          {/* ZIP & City row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Τ.Κ.
              </label>
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="12345"
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Πόλη
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="π.χ. Αθήνα"
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
          </div>
        </div>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={handleNext}
        nextDisabled={!street.trim() || !city.trim()}
        progress={50}
      />
    </div>
  );
};

export default StepAddressConfirm;
