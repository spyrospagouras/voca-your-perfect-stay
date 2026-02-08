import { useRef, useState, useCallback } from "react";
import { ImagePlus, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
  listingId: string | null;
  onNext: () => void;
  onBack: () => void;
}

const MIN_PHOTOS = 5;

const StepPhotos = ({ photos, onChange, listingId, onNext, onBack }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const path = `${user.id}/${listingId || "temp"}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("listing-photos")
          .upload(path, file, { upsert: false });

        if (!error) {
          const { data } = supabase.storage
            .from("listing-photos")
            .getPublicUrl(path);
          newUrls.push(data.publicUrl);
        }
      }

      onChange([...photos, ...newUrls]);
      setUploading(false);
    },
    [photos, onChange, listingId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  const removePhoto = (url: string) => {
    onChange(photos.filter((p) => p !== url));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 7</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Προσθέστε μερικές φωτογραφίες
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Χρειάζεστε τουλάχιστον {MIN_PHOTOS} φωτογραφίες για να ξεκινήσετε. Μπορείτε να
          προσθέσετε περισσότερες αργότερα.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors mb-6 ${
            dragOver
              ? "border-foreground bg-accent/30"
              : "border-border hover:border-foreground/40"
          }`}
        >
          <Upload className="w-10 h-10 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">
            {uploading
              ? "Μεταφόρτωση…"
              : "Σύρετε φωτογραφίες εδώ ή πατήστε για επιλογή"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {/* Counter */}
        <p className="text-xs text-muted-foreground mb-3">
          {photos.length} / {MIN_PHOTOS} ελάχιστες φωτογραφίες
        </p>

        {/* Grid preview */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((url) => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden group">
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(url);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-foreground/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5 text-background" />
                </button>
              </div>
            ))}
            {/* Add more button */}
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-foreground/40 transition-colors"
            >
              <ImagePlus className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={photos.length < MIN_PHOTOS || uploading}
        loading={uploading}
        progress={85}
      />
    </div>
  );
};

export default StepPhotos;
