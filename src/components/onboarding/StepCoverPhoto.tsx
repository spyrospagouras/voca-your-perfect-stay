import { useState, useCallback } from "react";
import { GripVertical } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepCoverPhoto = ({ photos, onChange, onNext, onBack }: Props) => {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
  }, []);

  const handleDrop = useCallback(
    (targetIdx: number) => {
      if (dragIdx === null || dragIdx === targetIdx) return;
      const reordered = [...photos];
      const [moved] = reordered.splice(dragIdx, 1);
      reordered.splice(targetIdx, 0, moved);
      onChange(reordered);
      setDragIdx(null);
    },
    [dragIdx, photos, onChange]
  );

  const setCover = (idx: number) => {
    if (idx === 0) return;
    const reordered = [...photos];
    const [moved] = reordered.splice(idx, 1);
    reordered.unshift(moved);
    onChange(reordered);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 2</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Έτοιμη! Πώς σας φαίνεται η φωτογραφία;
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Σύρετε για αναδιάταξη ή πατήστε μια φωτογραφία για να γίνει εξώφυλλο.
        </p>

        {/* Cover photo */}
        {photos.length > 0 && (
          <div className="relative rounded-xl overflow-hidden mb-4 aspect-[4/3]">
            <img
              src={photos[0]}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-foreground/80 text-background text-xs font-semibold px-3 py-1 rounded-full">
              Φωτογραφία εξωφύλλου
            </span>
          </div>
        )}

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.slice(1).map((url, i) => {
              const realIdx = i + 1;
              return (
                <div
                  key={url}
                  draggable
                  onDragStart={() => handleDragStart(realIdx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(realIdx)}
                  onClick={() => setCover(realIdx)}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group border border-border hover:border-foreground/40 transition-colors"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                    <GripVertical className="w-5 h-5 text-background opacity-0 group-hover:opacity-80 transition-opacity drop-shadow" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={photos.length === 0}
        progress={88}
      />
    </div>
  );
};

export default StepCoverPhoto;
