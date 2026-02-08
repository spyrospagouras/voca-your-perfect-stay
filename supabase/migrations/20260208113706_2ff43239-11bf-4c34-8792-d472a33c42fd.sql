
-- Add amenities array column to listings
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}'::text[];
