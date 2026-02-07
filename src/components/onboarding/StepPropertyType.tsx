import { useState } from "react";
import { Building2, Home, Hotel, TreePalm, ArrowLeft } from "lucide-react";
import OnboardingHeader from "./OnboardingHeader";

interface Props {
  onFinish: (propertyType: string, subType: string) => Promise<void>;
  onBack: () => void;
}

const categories = [
  {
    id: "apartment",
    label: "Διαμέρισμα",
    icon: Building2,
    subTypes: ["Διαμέρισμα", "Studio", "Loft", "Ρετιρέ"],
  },
  {
    id: "house",
    label: "Σπίτια",
    icon: Home,
    subTypes: ["Βίλα", "Σαλέ", "Μονοκατοικία", "Πάρκο διακοπών", "Αγροικία"],
  },
  {
    id: "hotel",
    label: "Ξενοδοχείο, B&B",
    icon: Hotel,
    subTypes: ["Ξενοδοχείο", "B&B", "Ξενώνας", "Hostel", "Resort"],
  },
  {
    id: "alternative",
    label: "Εναλλακτικά καταλύματα",
    icon: TreePalm,
    subTypes: ["Glamping", "Σκηνή", "Τροχόσπιτο", "Πλωτό κατάλυμα", "Δεντρόσπιτο"],
  },
];

const StepPropertyType = ({ onFinish, onBack }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeCategory = categories.find((c) => c.id === selectedCategory);

  const handleFinish = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    const cat = categories.find((c) => c.id === selectedCategory);
    await onFinish(cat?.label || "", selectedSub || "");
    setLoading(false);
  };

  // Sub-type selection view
  if (activeCategory) {
    return (
      <div className="flex flex-col min-h-screen">
        <OnboardingHeader
          onBack={() => {
            setSelectedCategory(null);
            setSelectedSub(null);
          }}
          title={activeCategory.label}
        />

        <div className="flex-1 px-6 pt-8">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Τι είδος είναι το κατάλυμά σας;
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Επιλέξτε τον τύπο που ταιριάζει καλύτερα
          </p>

          <div className="space-y-3">
            {activeCategory.subTypes.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`w-full text-left px-4 py-4 rounded-xl border transition-all text-sm font-medium ${
                  selectedSub === sub
                    ? "border-[hsl(217,91%,60%)] bg-[hsl(217,91%,60%)]/5 text-foreground"
                    : "border-border hover:border-muted-foreground/30 text-foreground"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={handleFinish}
            disabled={!selectedSub || loading}
            className="w-full h-12 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40"
            style={{
              backgroundColor: `hsl(217, 91%, 60%)`,
              color: "white",
            }}
          >
            {loading ? "Αποθήκευση..." : "Συνεχίστε"}
          </button>
        </div>
      </div>
    );
  }

  // Category selection view
  return (
    <div className="flex flex-col min-h-screen">
      <OnboardingHeader onBack={onBack} title="Τύπος καταλύματος" />

      <div className="flex-1 px-6 pt-8">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Ποια κατηγορία περιγράφει καλύτερα το κατάλυμά σας;
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Επιλέξτε μία κατηγορία για να συνεχίσετε
        </p>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border hover:border-muted-foreground/30 hover:shadow-sm transition-all text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepPropertyType;
