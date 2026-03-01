import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Listing } from "@/data/mockListings";

interface SearchParams {
  guests?: number;
  checkIn?: string;
  checkOut?: string;
}

function mapRow(row: any): Listing {
  const coverImage = row.cover_image_url || (row.images && row.images[0]) || "/placeholder.svg";
  const allImages: string[] = row.images && row.images.length > 0
    ? row.images
    : [coverImage];
  return {
    id: row.id,
    title: row.title || "",
    description: row.description || "",
    price: Number(row.price_per_night) || 0,
    lat: Number(row.latitude) || 0,
    lng: Number(row.longitude) || 0,
    image: coverImage,
    images: allImages,
    rating: Number(row.rating) || 0,
    reviews: 0,
    type: row.property_type || "Κατάλυμα",
    guests: row.max_guests || 2,
    bedrooms: row.bedrooms || 1,
    beds: row.beds || 1,
    bathrooms: row.bathrooms || 1,
    city: row.city || "",
  };
}

export function useSupabaseListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = useCallback(async (params?: SearchParams) => {
    setLoading(true);
    try {
      let query = supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (params?.guests && params.guests > 0) {
        query = query.gte("max_guests", params.guests);
      }

      const { data, error } = await query.limit(200);
      if (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } else {
        setListings((data || []).map(mapRow));
      }
    } catch (e) {
      console.error("Error fetching listings:", e);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { listings, loading, fetchListings };
}
