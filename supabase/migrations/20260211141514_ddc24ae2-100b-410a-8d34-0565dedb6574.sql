
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS business_name text,
  ADD COLUMN IF NOT EXISTS contact_person text,
  ADD COLUMN IF NOT EXISTS contact_address text,
  ADD COLUMN IF NOT EXISTS contact_zip text,
  ADD COLUMN IF NOT EXISTS contact_city text,
  ADD COLUMN IF NOT EXISTS contact_landline text,
  ADD COLUMN IF NOT EXISTS contact_mobile text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_website text,
  ADD COLUMN IF NOT EXISTS contact_facebook text,
  ADD COLUMN IF NOT EXISTS contact_instagram text;
