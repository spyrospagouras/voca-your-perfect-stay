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
      <div className="flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 4</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Online κρατήσεις ή μόνο προβολή καταλύματος
        </h1>
        <p className="text-muted-foreground mb-10 text-base">
          Τέλος, θα ορίσετε αν επιθυμείτε να γίνεται κράτηση μέσω της VOCA ή αν
          θέλετε μόνο να προβάλετε το κατάλυμα σας.
        </p>

        <div className="space-y-8">
          {steps.map(({ num, text, icon: Icon }) => (
            <div key={num} className="flex gap-5 items-start">
              <span className="text-2xl font-bold text-foreground">{num}</span>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground leading-relaxed">
                  {text}
                </p>
              </div>
              <Icon className="w-8 h-8 text-[hsl(var(--primary))] shrink-0 mt-0.5" strokeWidth={1.5} />
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
