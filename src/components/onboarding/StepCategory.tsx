import { useState } from "react";
import { Home, Building2, Hotel, Castle, TreePalm, Warehouse, Tent, Ship, Mountain } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  selected: string;
  onSelect: (category: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const categories = [
  { id: "house", label: "Σπίτι", icon: Home },
  { id: "apartment", label: "Διαμέρισμα", icon: Building2 },
  { id: "guesthouse", label: "Ξενώνας", icon: Hotel },
  { id: "hotel", label: "Ξενοδοχείο", icon: Castle },
  { id: "cabin", label: "Εξοχικό", icon: Mountain },
  { id: "villa", label: "Βίλα", icon: TreePalm },
  { id: "barn", label: "Αποθήκη", icon: Warehouse },
  { id: "camping", label: "Κάμπινγκ", icon: Tent },
  { id: "boat", label: "Σκάφος", icon: Ship },
];

const StepCategory = ({ selected, onSelect, onNext, onBack }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-6 pt-10 max-w-lg mx-auto w-full">
        <p className="text-sm font-semibold text-muted-foreground mb-2">Βήμα 1</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Ποια από αυτές τις κατηγορίες περιγράφει καλύτερα τον χώρο σας;
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Επιλέξτε μία κατηγορία
        </p>

        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selected === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                <Icon className={`w-7 h-7 ${isSelected ? "text-foreground" : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selected}
        progress={20}
      />
    </div>
  );
};

export default StepCategory;
