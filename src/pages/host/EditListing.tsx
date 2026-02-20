import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Image as ImageIcon, ImagePlus, MessageCircleQuestion, Plus } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

  const removePhoto = useCallback(
    (url: string) => {
      const updated = photos.filter((p) => p !== url);
      setPhotos(updated);
      autoSave(updated);
    },
    [photos, autoSave]
  );

  const handleBack = () => {
    autoSave(photos);
    navigate("/host/listings");
  };
  const handleNext = () => navigate("/host/listings");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Φόρτωση…</p>
      </div>
    );
  }

  // Build exactly 5 visual slots
  const slots: Array<{ type: "photo"; url: string; index: number } | { type: "empty" } | { type: "add" }> = [];
  for (let i = 0; i < Math.min(photos.length, 4); i++) {
    slots.push({ type: "photo", url: photos[i], index: i });
  }
  // Fill remaining with empties up to 4 secondary slots (slot index 1-4)
  const filledSecondary = Math.max(0, Math.min(photos.length - 1, 3)); // secondary photos shown
  const emptyCount = Math.max(0, 3 - filledSecondary); // empty placeholders needed
  for (let i = 0; i < emptyCount; i++) {
    slots.push({ type: "empty" });
  }
  slots.push({ type: "add" });

  const coverPhoto = photos.length > 0 ? photos[0] : null;
  const secondarySlots = slots.slice(coverPhoto ? 1 : 0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Πίσω"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <button className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors">
          <MessageCircleQuestion className="w-4 h-4" />
          Ερωτήσεις;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 max-w-lg mx-auto w-full">
        {/* Title row */}
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-2xl font-bold text-foreground">
            Επιλέξτε τουλάχιστον 5 φωτογραφίες
          </h1>
          <button
            onClick={() => inputRef.current?.click()}
            className="flex-shrink-0 ml-3 mt-1"
            aria-label="Προσθήκη φωτογραφιών"
          >
            <Plus className="w-6 h-6 text-foreground" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Σύρετε για να αλλάξετε τη σειρά
        </p>

        {/* Photo grid with DnD */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={photos} strategy={rectSortingStrategy}>
            <div className="space-y-3">
              {/* Slot 1: Cover photo — full width */}
              {coverPhoto ? (
                <SortablePhoto
                  url={coverPhoto}
                  index={0}
                  onDelete={removePhoto}
                />
              ) : (
                <div
                  onClick={() => inputRef.current?.click()}
                  className="aspect-[4/3] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-foreground/40 transition-colors"
                >
                  <Camera className="w-10 h-10 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">
                    Φωτογραφία εξωφύλλου
                  </span>
                </div>
              )}

              {/* Slots 2-5: 2×2 grid */}
              <div className="grid grid-cols-2 gap-3">
                {photos.slice(1, 5).map((url, i) => (
                  <SortablePhoto
                    key={url}
                    url={url}
                    index={i + 1}
                    onDelete={removePhoto}
                  />
                ))}

                {/* Empty placeholder slots */}
                {Array.from({ length: Math.max(0, 3 - Math.max(0, photos.length - 1)) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    onClick={() => inputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-foreground/40 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                ))}

                {/* Add more slot (always the 5th position) */}
                <button
                  onClick={() => inputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-foreground/40 transition-colors"
                >
                  <Plus className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Προσθήκη περισσότερων
                  </span>
                </button>
              </div>

              {/* Extra photos beyond 5 */}
              {photos.length > 5 && (
                <div className="grid grid-cols-2 gap-3">
                  {photos.slice(5).map((url, i) => (
                    <SortablePhoto
                      key={url}
                      url={url}
                      index={i + 5}
                      onDelete={removePhoto}
                    />
                  ))}
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>

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
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={uploading}
        loading={uploading}
        progress={85}
      />
    </div>
  );
};

export default EditListing;
