
-- Create the listing-images public bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'listing-images');

-- Allow anyone to view listing images (public bucket)
CREATE POLICY "Anyone can view listing images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'listing-images');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated users can delete listing images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'listing-images');
