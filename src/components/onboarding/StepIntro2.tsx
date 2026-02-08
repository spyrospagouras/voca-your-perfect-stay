import { Camera, Type, CheckCircle } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const steps = [
  {
    icon: Camera,
    title: "Προσθέστε φωτογραφίες",
    description: "Τραβήξτε τουλάχιστον 5 φωτογραφίες. Μπορείτε να προσθέσετε και αργότερα.",
  },
  {
    icon: Type,
    title: "Δημιουργήστε τον τίτλο σας",
    description: "Ένας σύντομος τίτλος που περιγράφει τον χώρο σας.",
  },
  {
    icon: CheckCircle,
    title: "Προσθέστε μια περιγραφή",
    description: "Μοιραστείτε τι κάνει τον χώρο σας ξεχωριστό.",
  },
];

const StepIntro2 = ({ onNext, onBack }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 2</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Κάντε τον χώρο σας να ξεχωρίσει
        </h1>
        <p className="text-muted-foreground mb-10 text-base">
          Σε αυτό το βήμα, θα προσθέσετε φωτογραφίες και μια περιγραφή.
        </p>

        <div className="space-y-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex gap-5 items-start">
                <div className="flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-2xl font-bold text-foreground">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <Icon className="w-8 h-8 text-[hsl(var(--primary))] shrink-0 mt-0.5" />
              </div>
            );
          })}
        </div>
      </div>

      <OnboardingFooter onBack={onBack} onNext={onNext} nextLabel="Συνέχεια" progress={75} />
    </div>
  );
};

export default StepIntro2;
