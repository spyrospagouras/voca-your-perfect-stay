import { ArrowLeft } from "lucide-react";

interface OnboardingHeaderProps {
  onBack: () => void;
  title?: string;
}

const OnboardingHeader = ({ onBack, title }: OnboardingHeaderProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
      <button
        onClick={onBack}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        aria-label="Πίσω"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>
      {title && (
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
      )}
    </div>
  );
};

export default OnboardingHeader;
