import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, ImagePlus, X, MessageCircleQuestion } from "lucide-react";
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
} from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { useListingImageUpload } from "@/hooks/useListingImageUpload";
import OnboardingFooter from "./OnboardingFooter";
import SortablePhoto from "./SortablePhoto";
import UploadProgressBar from "@/components/shared/UploadProgressBar";

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
  listingId: string | null;
  onNext: () => void;
  onBack: () => void;
}

const MIN_PHOTOS = 5;

interface UploadedImage {
  id: string;
  url: string;
  order_index: number;
}

const StepPhotos = ({ photos, onChange, listingId, onNext, onBack }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Load existing images from listing_images table
  useEffect(() => {
    if (!listingId) { setLoaded(true); return; }
    (async () => {
      const { data } = await supabase
        .from("listing_images")
        .select("id, url, order_index")
        .eq("listing_id", listingId)
        .order("order_index");
      if (data) setImages(data);
      setLoaded(true);
    })();
  }, [listingId]);

  // Sync photo URLs back to parent
  const handleImagesChange = useCallback(
    (updated: UploadedImage[]) => {
      setImages(updated);
      onChange(updated.map((i) => i.url));
    },
    [onChange]
  );

  const { uploading, uploadProgress, uploadFiles, deleteImage, reorderImages } =
    useListingImageUpload({
      listingId,
      existingImages: images,
      onImagesChange: handleImagesChange,
    });

  const photoUrls = images.map((i) => i.url);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = photoUrls.indexOf(active.id as string);
      const newIndex = photoUrls.indexOf(over.id as string);
      reorderImages(oldIndex, newIndex);
    },
    [photoUrls, reorderImages]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  const hasPhotos = images.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Κλείσιμο"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <button className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors">
          <MessageCircleQuestion className="w-4 h-4" />
          Ερωτήσεις;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 max-w-lg mx-auto w-full">
        {uploadProgress && (
          <div className="mb-4">
            <UploadProgressBar current={uploadProgress.current} total={uploadProgress.total} />
          </div>
        )}

        {!hasPhotos ? (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Προσθέστε μερικές φωτογραφίες
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Μπορείτε να προσθέσετε φωτογραφίες τώρα ή να τις προσθέσετε αργότερα
              από το Dashboard σας.
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
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

            <p className="text-xs text-muted-foreground mb-3">
              {images.length} / {MIN_PHOTOS} φωτογραφίες
              {images.length < MIN_PHOTOS && (
                <span className="text-destructive ml-1">
                  — χρειάζεστε ακόμη {MIN_PHOTOS - images.length}
                </span>
              )}
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={photoUrls} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, i) => (
                    <SortablePhoto
                      key={img.url}
                      url={img.url}
                      index={i}
                      onDelete={deleteImage}
                    />
                  ))}

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
        nextDisabled={uploading}
        loading={uploading}
        progress={85}
      />
    </div>
  );
};

export default StepPhotos;
