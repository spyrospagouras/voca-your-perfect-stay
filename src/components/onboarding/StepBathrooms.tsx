import { Minus, Plus } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface BathroomData {
  privateEnsuite: number;
  privateHallway: number;
  shared: number;
}

interface Props {
  data: BathroomData;
  onChange: (data: BathroomData) => void;
  onNext: () => void;
  onBack: () => void;
}

const rows: { key: keyof BathroomData; label: string; sub: string }[] = [
  {
    key: "privateEnsuite",
    label: "Ιδιωτικό και εντός δωματίου",
    sub: "Συνδέεται με το δωμάτιο του επισκέπτη και είναι μόνο δικό του.",
  },
  {
    key: "privateHallway",
    label: "Ιδιωτικό",
    sub: "Είναι ιδιωτικό, αλλά προσβάσιμο μέσα από κοινόχρηστο χώρο, όπως διάδρομο.",
  },
  {
    key: "shared",
    label: "Κοινόχρηστο",
    sub: "Είναι κοινόχρηστο με άλλα άτομα.",
  },
];

const StepBathrooms = ({ data, onChange, onNext, onBack }: Props) => {
  const update = (key: keyof BathroomData, delta: number) => {
    const val = Math.max(0, data[key] + delta);
    onChange({ ...data, [key]: val });
  };

  const total = data.privateEnsuite + data.privateHallway + data.shared;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 px-6 pt-10 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 5</p>
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Τι είδους μπάνια υπάρχουν για τους επισκέπτες;
        </h1>

        <div className="divide-y divide-border">
          {rows.map((row) => {
            const val = data[row.key];
            return (
              <div key={row.key} className="flex items-center justify-between py-5">
                <div className="flex-1 pr-4">
                  <span className="text-base font-medium text-foreground">{row.label}</span>
                  <p className="text-sm text-muted-foreground mt-0.5">{row.sub}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => update(row.key, -1)}
                    disabled={val <= 0}
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

      <OnboardingFooter onBack={onBack} onNext={onNext} nextDisabled={total === 0} progress={72} />
    </div>
  );
};

export default StepBathrooms;
