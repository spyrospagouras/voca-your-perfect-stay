import { useRef, useState, useCallback } from "react";
import { Camera, ImagePlus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import OnboardingFooter from "./OnboardingFooter";
import SortablePhoto from "./SortablePhoto";

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const folder = listingId || "temp";
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${folder}/${Date.now()}-${safeName}`;
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

      const updated = [...photos, ...newUrls];
      onChange(updated);
      autoSave(updated);
      setUploading(false);
    },
    [photos, onChange, listingId]
  );

  const autoSave = useCallback(
    async (updatedPhotos: string[]) => {
      if (!listingId) return;
      await supabase
        .from("listings")
        .update({
          images: updatedPhotos,
          cover_image_url: updatedPhotos[0] || "/placeholder.svg",
        } as any)
        .eq("id", listingId);
    },
    [listingId]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = photos.indexOf(active.id as string);
      const newIndex = photos.indexOf(over.id as string);
      const reordered = arrayMove(photos, oldIndex, newIndex);
      onChange(reordered);
      autoSave(reordered);
    },
    [photos, onChange, autoSave]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  const removePhoto = useCallback(
    (url: string) => {
      const updated = photos.filter((p) => p !== url);
      onChange(updated);
      autoSave(updated);
    },
    [photos, onChange, autoSave]
  );

  const hasPhotos = photos.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 7</p>

        {!hasPhotos ? (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Προσθέστε μερικές φωτογραφίες
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Μπορείτε να προσθέσετε φωτογραφίες τώρα ή να τις προσθέσετε αργότερα
              από το Dashboard σας.
            </p>

            {/* Empty upload zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-16 cursor-pointer transition-colors ${
                dragOver
                  ? "border-foreground bg-accent/30"
                  : "border-border hover:border-foreground/40"
              }`}
            >
              <Camera className="w-12 h-12 text-muted-foreground" />
              <span className="text-sm text-foreground font-semibold">
                {uploading ? "Μεταφόρτωση…" : "Προσθέστε φωτογραφίες"}
              </span>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Επιλέξτε τουλάχιστον 5 φωτογραφίες
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Σύρετε για να αλλάξετε τη σειρά
            </p>

            {/* Photo count */}
            <p className="text-xs text-muted-foreground mb-3">
              {photos.length} / {MIN_PHOTOS} φωτογραφίες
              {photos.length < MIN_PHOTOS && (
                <span className="text-destructive ml-1">
                  — χρειάζεστε ακόμη {MIN_PHOTOS - photos.length}
                </span>
              )}
            </p>

            {/* Sortable grid */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={photos} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((url, i) => (
                    <SortablePhoto
                      key={url}
                      url={url}
                      index={i}
                      onDelete={removePhoto}
                    />
                  ))}

                  {/* Add more card */}
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-foreground/40 transition-colors"
                  >
                    <ImagePlus className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">
                      Προσθήκη περισσότερων
                    </span>
                  </button>
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}

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

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={uploading || photos.length < MIN_PHOTOS}
        loading={uploading}
        progress={85}
      />
    </div>
  );
};

export default StepPhotos;
