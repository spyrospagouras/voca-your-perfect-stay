
-- Add RLS policies for wishlist_items
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own wishlist items
CREATE POLICY "Users view own wishlist items"
ON public.wishlist_items
FOR SELECT
USING (
  wishlist_id IN (
    SELECT id FROM public.wishlists WHERE user_id = (SELECT auth.uid())
  )
);

-- Users can insert into their own wishlists
CREATE POLICY "Users insert own wishlist items"
ON public.wishlist_items
FOR INSERT
WITH CHECK (
  wishlist_id IN (
    SELECT id FROM public.wishlists WHERE user_id = (SELECT auth.uid())
  )
);

-- Users can delete from their own wishlists
CREATE POLICY "Users delete own wishlist items"
ON public.wishlist_items
FOR DELETE
USING (
  wishlist_id IN (
    SELECT id FROM public.wishlists WHERE user_id = (SELECT auth.uid())
  )
);

-- Add INSERT policy for wishlists table (currently only ALL policy exists which is restrictive)
CREATE POLICY "Users can insert wishlists"
ON public.wishlists
FOR INSERT
WITH CHECK ((SELECT auth.uid()) = user_id);
