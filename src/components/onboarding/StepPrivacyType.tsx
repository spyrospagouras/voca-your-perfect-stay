import { Home, DoorOpen, Users } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  selected: string;
  onSelect: (type: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const privacyTypes = [
  {
    id: "entire",
    label: "Ολόκληρος χώρος",
    description: "Οι επισκέπτες έχουν ολόκληρο τον χώρο στη διάθεσή τους.",
    icon: Home,
  },
  {
    id: "private_room",
    label: "Ιδιωτικό δωμάτιο",
    description: "Οι επισκέπτες έχουν το δικό τους δωμάτιο αλλά μοιράζονται κοινόχρηστους χώρους.",
    icon: DoorOpen,
  },
  {
    id: "shared_room",
    label: "Κοινόχρηστο δωμάτιο",
    description: "Οι επισκέπτες μοιράζονται ένα δωμάτιο ή κοινόχρηστο χώρο.",
    icon: Users,
  },
];

const StepPrivacyType = ({ selected, onSelect, onNext, onBack }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-6 pt-10 max-w-lg mx-auto w-full">
        <p className="text-sm font-semibold text-muted-foreground mb-2">Βήμα 1</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Τι είδους χώρο θα έχουν στη διάθεσή τους οι επισκέπτες;
        </h1>

        <div className="space-y-3 mt-8">
          {privacyTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selected === type.id;
            return (
              <button
                key={type.id}
                onClick={() => onSelect(type.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                <div className="flex-1">
                  <h3 className={`text-base font-semibold ${isSelected ? "text-foreground" : "text-foreground"}`}>
                    {type.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {type.description}
                  </p>
                </div>
                <Icon className={`w-8 h-8 shrink-0 ${isSelected ? "text-foreground" : "text-muted-foreground"}`} />
              </button>
            );
          })}
        </div>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selected}
        progress={40}
      />
    </div>
  );
};

export default StepPrivacyType;
