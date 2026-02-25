import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Image as ImageIcon, Plus, MessageCircleQuestion } from "lucide-react";
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
import PhotoUploadSheet from "@/components/host/PhotoUploadSheet";

interface ListingImage {
  id: string;
  url: string;
  order_index: number;
}

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [images, setImages] = useState<ListingImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const photoUrls = images.map((img) => img.url);

  // Fetch images from listing_images table
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("listing_images")
        .select("id, url, order_index")
        .eq("listing_id", id)
        .order("order_index");
      if (data) setImages(data);
      setLoading(false);
    })();
  }, [id]);

  const syncCover = useCallback(
    async (urls: string[]) => {
      if (!id) return;
      await supabase
        .from("listings")
        .update({ cover_image_url: urls[0] || "/placeholder.svg" } as any)
        .eq("id", id);
    },
    [id]
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !id) return;

      setUploading(true);
      const newImages: ListingImage[] = [];
      let nextIndex = images.length;

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${id}/${Date.now()}-${safeName}`;
        const { error } = await supabase.storage
          .from("listing-photos")
          .upload(path, file, { upsert: false });

        if (!error) {
          const { data: urlData } = supabase.storage
            .from("listing-photos")
            .getPublicUrl(path);

          const { data: row } = await supabase
            .from("listing_images")
            .insert({
              listing_id: id,
              url: urlData.publicUrl,
              order_index: nextIndex,
            })
            .select("id, url, order_index")
            .single();

          if (row) {
            newImages.push(row);
            nextIndex++;
          }
        }
      }

      const updated = [...images, ...newImages];
      setImages(updated);
      syncCover(updated.map((i) => i.url));
      setUploading(false);
    },
    [images, id, syncCover]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !id) return;

      const oldIndex = photoUrls.indexOf(active.id as string);
      const newIndex = photoUrls.indexOf(over.id as string);
      const reordered = arrayMove(images, oldIndex, newIndex).map((img, i) => ({
        ...img,
        order_index: i,
      }));
      setImages(reordered);

      // Batch update order_index
      for (const img of reordered) {
        await supabase
          .from("listing_images")
          .update({ order_index: img.order_index })
          .eq("id", img.id);
      }
      syncCover(reordered.map((i) => i.url));
    },
    [images, photoUrls, id, syncCover]
  );

  const removePhoto = useCallback(
    async (url: string) => {
      const img = images.find((i) => i.url === url);
      if (!img) return;

      await supabase.from("listing_images").delete().eq("id", img.id);
      const updated = images.filter((i) => i.id !== img.id);
      setImages(updated);
      syncCover(updated.map((i) => i.url));
    },
    [images, syncCover]
  );

  const openSheet = () => setSheetOpen(true);
  const handleBack = () => navigate("/host/listings");
  const handleNext = () => navigate(`/host/edit/${id}/title`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Φόρτωση…</p>
      </div>
    );
  }

  const coverPhoto = photoUrls[0] ?? null;
  const secondaryPhotos = photoUrls.slice(1, 4);
  const emptySecondaryCount = Math.max(0, 3 - secondaryPhotos.length);

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
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-2xl font-bold text-foreground">
            Επιλέξτε τουλάχιστον 5 φωτογραφίες
          </h1>
          <button onClick={openSheet} className="flex-shrink-0 ml-3 mt-1" aria-label="Προσθήκη φωτογραφιών">
            <Plus className="w-6 h-6 text-foreground" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Σύρετε για να αλλάξετε τη σειρά
        </p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photoUrls} strategy={rectSortingStrategy}>
            <div className="space-y-3">
              {/* Slot 1: Cover */}
              {coverPhoto ? (
                <SortablePhoto url={coverPhoto} index={0} onDelete={removePhoto} />
              ) : (
                <div
                  onClick={openSheet}
                  className="aspect-[4/3] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-foreground/40 transition-colors"
                >
                  <Camera className="w-10 h-10 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">Φωτογραφία εξωφύλλου</span>
                </div>
              )}

              {/* Slots 2-5 grid */}
              <div className="grid grid-cols-2 gap-3">
                {secondaryPhotos.map((url, i) => (
                  <SortablePhoto key={url} url={url} index={i + 1} onDelete={removePhoto} />
                ))}

                {Array.from({ length: emptySecondaryCount }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    onClick={openSheet}
                    className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-foreground/40 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                ))}

                {/* Add more slot */}
                <button
                  onClick={openSheet}
                  className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-foreground/40 transition-colors"
                >
                  <Plus className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Προσθήκη περισσότερων</span>
                </button>
              </div>

              {/* Extra photos beyond 4 */}
              {photoUrls.length > 4 && (
                <div className="grid grid-cols-2 gap-3">
                  {photoUrls.slice(4).map((url, i) => (
                    <SortablePhoto key={url} url={url} index={i + 4} onDelete={removePhoto} />
                  ))}
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <OnboardingFooter
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={uploading}
        loading={uploading}
        progress={85}
      />

      <PhotoUploadSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onFilesSelected={uploadFiles}
      />
    </div>
  );
};

export default EditListing;
