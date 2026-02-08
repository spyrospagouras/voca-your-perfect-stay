
-- Create storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users upload listing photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-photos'
  AND auth.role() = 'authenticated'
);

-- Public read access
CREATE POLICY "Listing photos are public"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-photos');

-- Users can delete their own uploads
CREATE POLICY "Users delete own listing photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listing-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
