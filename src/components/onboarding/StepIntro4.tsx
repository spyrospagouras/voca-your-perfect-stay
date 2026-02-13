import { Scale, MousePointerClick, Rocket } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const steps = [
  {
    num: 1,
    text: "Δείτε τα θετικά και τα αρνητικά της κάθε κατηγορίας",
    icon: Scale,
  },
  {
    num: 2,
    text: "Επιλέξτε Κατηγορία",
    icon: MousePointerClick,
  },
  {
    num: 3,
    text: "Δημοσιεύστε",
    icon: Rocket,
  },
];

const StepIntro4 = ({ onNext, onBack }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 px-6 py-10 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">
          Βήμα 4
        </p>
        <h1 className="text-2xl font-bold text-foreground mb-3 uppercase leading-tight">
          Online κρατήσεις ή μόνο προβολή καταλύματος
        </h1>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
          Τέλος, θα ορίσετε αν επιθυμείτε να γίνεται κράτηση μέσω της VOCA ή αν
          θέλετε μόνο να προβάλετε το κατάλυμα σας.
        </p>

        <div className="space-y-6">
          {steps.map(({ num, text, icon: Icon }) => (
            <div key={num} className="flex items-start gap-4">
              <span className="text-lg font-bold text-foreground min-w-[24px]">
                {num}
              </span>
              <p className="flex-1 text-sm text-foreground leading-relaxed pt-0.5">
                {text}
              </p>
              <Icon className="w-7 h-7 text-muted-foreground shrink-0" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextLabel="Συνέχεια"
        progress={88}
      />
    </div>
  );
};

export default StepIntro4;
