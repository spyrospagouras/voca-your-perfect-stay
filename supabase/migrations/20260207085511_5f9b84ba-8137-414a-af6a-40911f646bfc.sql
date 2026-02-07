CREATE POLICY "Μόνο πιστοποιημένοι χρήστες κάνουν κράτηση"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = guest_id);