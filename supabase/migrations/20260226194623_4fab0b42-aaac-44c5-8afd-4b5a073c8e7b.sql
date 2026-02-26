ALTER TABLE public.listings 
ADD COLUMN terms_accepted boolean DEFAULT false,
ADD COLUMN terms_accepted_at timestamp with time zone DEFAULT null;