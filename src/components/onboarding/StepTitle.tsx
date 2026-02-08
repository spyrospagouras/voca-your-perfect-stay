import { Textarea } from "@/components/ui/textarea";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  title: string;
  onChange: (title: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const MAX_CHARS = 50;

const StepTitle = ({ title, onChange, onNext, onBack }: Props) => {
  const handleChange = (val: string) => {
    if (val.length <= MAX_CHARS) onChange(val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 2</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Τώρα, δώστε στον χώρο σας έναν τίτλο
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Ένας σύντομος τίτλος κάνει τη μεγαλύτερη εντύπωση. Μην ανησυχείτε, μπορείτε πάντα να τον αλλάξετε.
        </p>

        <Textarea
          value={title}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="π.χ. Φωτεινό διαμέρισμα στο κέντρο"
          className="text-lg font-medium resize-none min-h-[120px] border-border focus-visible:ring-foreground"
          maxLength={MAX_CHARS}
        />
        <p className="text-xs text-muted-foreground text-right mt-2">
          {title.length}/{MAX_CHARS}
        </p>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={title.trim().length === 0}
        progress={90}
      />
    </div>
  );
};

export default StepTitle;
