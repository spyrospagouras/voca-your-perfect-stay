
-- Πίνακας για τις φωτογραφίες των καταλυμάτων
CREATE TABLE public.listing_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url text NOT NULL,
  order_index int NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

-- Όλοι βλέπουν τις φωτογραφίες
CREATE POLICY "Listing images are publicly viewable"
ON public.listing_images
FOR SELECT
USING (true);

-- Μόνο ο host διαχειρίζεται τις φωτογραφίες
CREATE POLICY "Host manages listing images"
ON public.listing_images
FOR ALL
USING (
  (SELECT auth.uid()) IN (
    SELECT host_id FROM public.listings WHERE id = listing_images.listing_id
  )
);

-- Index για γρήγορη ανάκτηση ανά listing
CREATE INDEX idx_listing_images_listing_id ON public.listing_images(listing_id, order_index);
