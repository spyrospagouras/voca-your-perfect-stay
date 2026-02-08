import { Home, Bed, MapPin } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const steps = [
  {
    icon: Home,
    title: "Πείτε μας για τον χώρο σας",
    description: "Μοιραστείτε βασικές πληροφορίες, όπως πού βρίσκεται και πόσους επισκέπτες μπορεί να φιλοξενήσει.",
  },
  {
    icon: Bed,
    title: "Κάντε τον να ξεχωρίζει",
    description: "Προσθέστε 5 ή περισσότερες φωτογραφίες, έναν τίτλο και μια περιγραφή.",
  },
  {
    icon: MapPin,
    title: "Ολοκληρώστε τη δημοσίευση",
    description: "Ορίστε μια αρχική τιμή, επαληθεύστε μερικά στοιχεία και δημοσιεύστε.",
  },
];

const StepIntro = ({ onNext, onBack }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Είναι εύκολο να ξεκινήσετε στη VOCA
        </h1>
        <p className="text-muted-foreground mb-10 text-base">
          Ακολουθήστε 3 απλά βήματα
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

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextLabel="Ξεκινήστε"
      />
    </div>
  );
};

export default StepIntro;
