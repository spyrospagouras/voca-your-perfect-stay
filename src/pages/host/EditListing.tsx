import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  arrayMove,
} from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import SortablePhoto from "@/components/onboarding/SortablePhoto";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";

const MIN_PHOTOS = 5;

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Fetch listing photos on mount
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("images")
        .eq("id", id)
        .single();
      if (data?.images) setPhotos(data.images as string[]);
      setLoading(false);
    })();
  }, [id]);

  const autoSave = useCallback(
    async (updatedPhotos: string[]) => {
      if (!id) return;
      await supabase
        .from("listings")
        .update({
          images: updatedPhotos,
          cover_image_url: updatedPhotos[0] || "/placeholder.svg",
        } as any)
        .eq("id", id);
    },
    [id]
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !id) return;

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${id}/${Date.now()}-${safeName}`;
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
      setPhotos(updated);
      autoSave(updated);
      setUploading(false);
    },
    [photos, id, autoSave]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = photos.indexOf(active.id as string);
      const newIndex = photos.indexOf(over.id as string);
      const reordered = arrayMove(photos, oldIndex, newIndex);
      setPhotos(reordered);
      autoSave(reordered);
    },
    [photos, autoSave]
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
      setPhotos(updated);
      autoSave(updated);
    },
    [photos, autoSave]
  );

  const handleClose = () => navigate("/host/listings");
  const handleNext = () => navigate("/host/listings");

  const hasPhotos = photos.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Φόρτωση…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={handleClose}
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
              {photos.length} / {MIN_PHOTOS} φωτογραφίες
              {photos.length < MIN_PHOTOS && (
                <span className="text-destructive ml-1">
                  — χρειάζεστε ακόμη {MIN_PHOTOS - photos.length}
                </span>
              )}
            </p>

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
        onBack={handleClose}
        onNext={handleNext}
        nextDisabled={uploading || photos.length < MIN_PHOTOS}
        loading={uploading}
        progress={85}
      />
    </div>
  );
};

export default EditListing;
