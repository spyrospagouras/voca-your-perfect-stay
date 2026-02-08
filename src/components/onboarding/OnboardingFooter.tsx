import { Progress } from "@/components/ui/progress";

interface Props {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  progress?: number;
}

const OnboardingFooter = ({
  onBack,
  onNext,
  nextLabel = "Επόμενο",
  nextDisabled = false,
  loading = false,
  progress,
}: Props) => {
  return (
    <div className="sticky bottom-0 bg-background border-t border-border">
      {progress !== undefined && (
        <Progress value={progress} className="h-1 rounded-none" />
      )}
      <div className="flex items-center justify-between px-6 py-4 max-w-lg mx-auto w-full">
        <button
          onClick={onBack}
          className="text-sm font-semibold text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
        >
          Πίσω
        </button>
        <button
          onClick={onNext}
          disabled={nextDisabled || loading}
          className="h-12 px-8 rounded-lg bg-foreground text-background font-semibold text-sm transition-all disabled:opacity-40 hover:bg-foreground/90 active:scale-[0.98]"
        >
          {loading ? "Φόρτωση..." : nextLabel}
        </button>
      </div>
    </div>
  );
};

export default OnboardingFooter;
