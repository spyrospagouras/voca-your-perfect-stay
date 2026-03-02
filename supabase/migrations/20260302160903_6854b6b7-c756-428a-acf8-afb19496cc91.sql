ALTER TABLE public.listings
  ADD COLUMN private_ensuite_bathrooms integer NOT NULL DEFAULT 0,
  ADD COLUMN private_hallway_bathrooms integer NOT NULL DEFAULT 0,
  ADD COLUMN shared_bathrooms integer NOT NULL DEFAULT 0;