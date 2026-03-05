import { Progress } from "@/components/ui/progress";

interface UploadProgressBarProps {
  current: number;
  total: number;
}

const UploadProgressBar = ({ current, total }: UploadProgressBarProps) => {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="space-y-1.5">
      <Progress value={percent} className="h-2" />
      <p className="text-xs text-muted-foreground text-center">
        Μεταφόρτωση {current} / {total} φωτογραφιών…
      </p>
    </div>
  );
};

export default UploadProgressBar;
