
CREATE OR REPLACE FUNCTION public.nearby_listings(
  p_lat double precision,
  p_lng double precision,
  p_radius_km double precision DEFAULT 2.0,
  p_exclude_id uuid DEFAULT NULL
)
RETURNS SETOF listings
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT *
  FROM listings
  WHERE status = 'active'
    AND latitude IS NOT NULL
    AND longitude IS NOT NULL
    AND (p_exclude_id IS NULL OR id != p_exclude_id)
    AND (
      6371 * acos(
        cos(radians(p_lat)) * cos(radians(latitude))
        * cos(radians(longitude) - radians(p_lng))
        + sin(radians(p_lat)) * sin(radians(latitude))
      )
    ) <= p_radius_km;
$$;
