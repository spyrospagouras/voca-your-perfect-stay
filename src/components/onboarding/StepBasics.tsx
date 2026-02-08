import { Minus, Plus } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Basics {
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
}

interface Props {
  basics: Basics;
  onChange: (basics: Basics) => void;
  onNext: () => void;
  onBack: () => void;
}

const rows: { key: keyof Basics; label: string; min: number }[] = [
  { key: "guests", label: "Επισκέπτες", min: 1 },
  { key: "bedrooms", label: "Υπνοδωμάτια", min: 0 },
  { key: "beds", label: "Κρεβάτια", min: 1 },
  { key: "bathrooms", label: "Μπάνια", min: 1 },
];

const StepBasics = ({ basics, onChange, onNext, onBack }: Props) => {
  const update = (key: keyof Basics, delta: number) => {
    const row = rows.find((r) => r.key === key)!;
    const val = Math.max(row.min, basics[key] + delta);
    onChange({ ...basics, [key]: val });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 px-6 pt-10 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 5</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Μοιραστείτε μερικά βασικά στοιχεία
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Θα προσθέσετε περισσότερες λεπτομέρειες αργότερα, όπως κρεβάτια και μπάνια.
        </p>

        <div className="divide-y divide-border">
          {rows.map((row) => {
            const val = basics[row.key];
            const atMin = val <= row.min;
            return (
              <div key={row.key} className="flex items-center justify-between py-5">
                <span className="text-base text-foreground">{row.label}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => update(row.key, -1)}
                    disabled={atMin}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground transition-colors hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-base font-medium text-foreground">
                    {val}
                  </span>
                  <button
                    onClick={() => update(row.key, 1)}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground transition-colors hover:bg-accent"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <OnboardingFooter onBack={onBack} onNext={onNext} progress={70} />
    </div>
  );
};

export default StepBasics;
