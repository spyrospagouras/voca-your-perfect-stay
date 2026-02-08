import { Textarea } from "@/components/ui/textarea";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  description: string;
  onChange: (desc: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const MIN_WORDS = 25;

const countWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

const StepDescription = ({ description, onChange, onNext, onBack }: Props) => {
  const wordCount = countWords(description);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 2</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Δημιουργήστε την περιγραφή σας
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Μοιραστείτε τι κάνει τον χώρο σας ξεχωριστό. Τουλάχιστον {MIN_WORDS} λέξεις.
        </p>

        <Textarea
          value={description}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Περιγράψτε την ατμόσφαιρα, τη γειτονιά, τι θα βρουν οι επισκέπτες…"
          className="text-base resize-none min-h-[180px] border-border focus-visible:ring-foreground"
        />
        <p
          className={`text-xs text-right mt-2 ${
            wordCount >= MIN_WORDS ? "text-muted-foreground" : "text-destructive"
          }`}
        >
          {wordCount}/{MIN_WORDS} λέξεις
        </p>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={wordCount < MIN_WORDS}
        progress={95}
      />
    </div>
  );
};

export default StepDescription;
