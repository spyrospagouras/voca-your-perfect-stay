import OnboardingFooter from "./OnboardingFooter";

interface Props {
  selected: string[];
  onSelect: (highlights: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS = [
  "Γαλήνιο",
  "Μοναδικό",
  "Κεντρικό",
  "Φωτεινό",
  "Οικογενειακό",
  "Ρομαντικό",
  "Μοντέρνο",
  "Παραδοσιακό",
  "Πολυτελές",
  "Ζεστό",
  "Ευρύχωρο",
  "Πρακτικό",
];

const MAX_SELECTION = 2;

const StepHighlights = ({ selected, onSelect, onNext, onBack }: Props) => {
  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onSelect(selected.filter((s) => s !== item));
    } else if (selected.length < MAX_SELECTION) {
      onSelect([...selected, item]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 2</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Μετά, θα περιγράψετε τον χώρο σας
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Επιλέξτε έως {MAX_SELECTION} χαρακτηριστικά που ταιριάζουν στον χώρο σας.
        </p>

        <div className="flex flex-wrap gap-2.5">
          {OPTIONS.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                  isSelected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground/40"
                } ${
                  !isSelected && selected.length >= MAX_SELECTION
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
                disabled={!isSelected && selected.length >= MAX_SELECTION}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={selected.length === 0}
        progress={92}
      />
    </div>
  );
};

export default StepHighlights;
