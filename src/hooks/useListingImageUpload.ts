import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const BUCKET = "listing-images";

interface UploadedImage {
  id: string;
  url: string;
  order_index: number;
}

interface UseListingImageUploadOptions {
  listingId: string | null;
  existingImages: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
}

export const useListingImageUpload = ({
  listingId,
  existingImages,
  onImagesChange,
}: UseListingImageUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !listingId) return;

      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (fileArray.length === 0) return;

      setUploading(true);
      setUploadProgress({ current: 0, total: fileArray.length });

      const newImages: UploadedImage[] = [];
      let nextIndex = existingImages.length;
      let failCount = 0;

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadProgress({ current: i + 1, total: fileArray.length });

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${listingId}/${Date.now()}-${safeName}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false });

        if (error) {
          failCount++;
          continue;
        }

        const { data: urlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(path);

        const { data: row, error: dbError } = await supabase
          .from("listing_images")
          .insert({
            listing_id: listingId,
            url: urlData.publicUrl,
            order_index: nextIndex,
          })
          .select("id, url, order_index")
          .single();

        if (dbError || !row) {
          failCount++;
          // Clean up the uploaded file if DB insert failed
          await supabase.storage.from(BUCKET).remove([path]);
          continue;
        }

        newImages.push(row);
        nextIndex++;
      }

      const updated = [...existingImages, ...newImages];
      onImagesChange(updated);

      // Update cover image
      if (updated.length > 0) {
        await supabase
          .from("listings")
          .update({ cover_image_url: updated[0].url } as any)
          .eq("id", listingId);
      }

      if (failCount > 0) {
        toast({
          title: "Πρόβλημα",
          description: `${failCount} φωτογραφία/ες δεν ανέβηκαν. Δοκιμάστε ξανά.`,
          variant: "destructive",
        });
      }

      setUploading(false);
      setUploadProgress(null);
    },
    [listingId, existingImages, onImagesChange]
  );

  const deleteImage = useCallback(
    async (url: string) => {
      const img = existingImages.find((i) => i.url === url);
      if (!img || !listingId) return;

      // Extract storage path from URL
      const bucketUrl = `/storage/v1/object/public/${BUCKET}/`;
      const pathIndex = url.indexOf(bucketUrl);
      if (pathIndex !== -1) {
        const storagePath = decodeURIComponent(
          url.substring(pathIndex + bucketUrl.length)
        );
        await supabase.storage.from(BUCKET).remove([storagePath]);
      }

      await supabase.from("listing_images").delete().eq("id", img.id);

      const updated = existingImages.filter((i) => i.id !== img.id);
      onImagesChange(updated);

      // Update cover image
      await supabase
        .from("listings")
        .update({
          cover_image_url: updated[0]?.url || "/placeholder.svg",
        } as any)
        .eq("id", listingId);
    },
    [existingImages, listingId, onImagesChange]
  );

  const reorderImages = useCallback(
    async (oldIndex: number, newIndex: number) => {
      if (!listingId) return;
      const { arrayMove } = await import("@dnd-kit/sortable");
      const reordered = arrayMove(existingImages, oldIndex, newIndex).map(
        (img, i) => ({ ...img, order_index: i })
      );
      onImagesChange(reordered);

      // Batch update order_index
      for (const img of reordered) {
        await supabase
          .from("listing_images")
          .update({ order_index: img.order_index })
          .eq("id", img.id);
      }

      // Update cover
      await supabase
        .from("listings")
        .update({ cover_image_url: reordered[0]?.url || "/placeholder.svg" } as any)
        .eq("id", listingId);
    },
    [existingImages, listingId, onImagesChange]
  );

  return {
    uploading,
    uploadProgress,
    uploadFiles,
    deleteImage,
    reorderImages,
  };
};
