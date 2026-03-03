import OnboardingFooter from "./OnboardingFooter";

interface Props {
  category: string;
  selected: string;
  onSelect: (subType: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SUB_TYPES: Record<string, { id: string; label: string }[]> = {
  house: [
    { id: "detached", label: "Μονοκατοικία" },
    { id: "semi-detached", label: "Μεζονέτα" },
    { id: "townhouse", label: "Σπίτι σε σειρά" },
  ],
  apartment: [
    { id: "apartment", label: "Διαμέρισμα" },
    { id: "studio", label: "Studio" },
    { id: "loft", label: "Loft" },
    { id: "penthouse", label: "Ρετιρέ" },
  ],
  guesthouse: [
    { id: "guesthouse", label: "Ξενώνας" },
    { id: "bnb", label: "B&B" },
    { id: "hostel", label: "Hostel" },
  ],
  hotel: [
    { id: "hotel", label: "Ξενοδοχείο" },
    { id: "boutique", label: "Boutique Hotel" },
    { id: "resort", label: "Resort" },
  ],
  cabin: [
    { id: "cabin", label: "Εξοχικό σπίτι" },
    { id: "chalet", label: "Σαλέ" },
    { id: "farmhouse", label: "Αγροικία" },
  ],
  villa: [
    { id: "villa", label: "Βίλα" },
    { id: "luxury-villa", label: "Πολυτελής βίλα" },
  ],
  barn: [
    { id: "barn", label: "Αποθήκη" },
    { id: "converted-barn", label: "Ανακαινισμένη αποθήκη" },
  ],
  camping: [
    { id: "tent", label: "Σκηνή" },
    { id: "glamping", label: "Glamping" },
    { id: "rv", label: "Τροχόσπιτο" },
  ],
  boat: [
    { id: "sailboat", label: "Ιστιοπλοϊκό" },
    { id: "motorboat", label: "Μηχανοκίνητο" },
    { id: "houseboat", label: "Πλωτό σπίτι" },
  ],
};

const StepPropertyType = ({ category, selected, onSelect, onNext, onBack }: Props) => {
  const options = SUB_TYPES[category] || [];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-6 pt-10 max-w-lg mx-auto w-full">
        <p className="text-sm font-semibold text-muted-foreground mb-2">Βήμα 1</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Τι είδος είναι το κατάλυμά σας;
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Επιλέξτε τον τύπο που ταιριάζει καλύτερα
        </p>

        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all text-sm font-medium ${
                  isSelected
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
                  {opt.label}
                </span>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-foreground" : "border-muted-foreground/40"
                  }`}
                >
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-foreground" />}
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
        progress={22}
      />
    </div>
  );
};

export default StepPropertyType;
