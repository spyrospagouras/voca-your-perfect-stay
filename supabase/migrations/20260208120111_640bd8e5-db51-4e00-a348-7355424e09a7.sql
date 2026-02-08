
-- Add highlights and cover_image_url to listings
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS highlights text[] DEFAULT '{}'::text[];

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS cover_image_url text;
