import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ListingGallery from "@/components/listing/ListingGallery";
import ListingInfo from "@/components/listing/ListingInfo";
import ListingContact from "@/components/listing/ListingContact";
import BookingBar from "@/components/listing/BookingBar";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, profiles:host_id(full_name, avatar_url)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="w-full h-72 rounded-none" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Η καταχώρηση δεν βρέθηκε.</p>
      </div>
    );
  }

  const hostName =
    (listing.profiles as any)?.full_name || "Οικοδεσπότης";
  const images = listing.images?.length
    ? listing.images
    : ["/placeholder.svg"];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top floating nav */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-3 pb-2 safe-top">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-sm">
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
          <button className="w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Gallery */}
      <ListingGallery images={images} />

      {/* Content */}
      <div className="px-4 pt-5 space-y-6">
        {/* Title block */}
        <div>
          <h1 className="text-xl font-semibold text-foreground leading-tight">
            {listing.title}
          </h1>
          {listing.location_name && (
            <p className="text-sm text-muted-foreground mt-1">
              {listing.location_name}
            </p>
          )}
          {listing.rating !== null && (
            <p className="text-sm text-foreground mt-1">
              ★ {listing.rating}
            </p>
          )}
        </div>

        <div className="h-px bg-divider" />

        {/* Info section */}
        <ListingInfo
          title={listing.title}
          hostName={hostName}
          location={listing.location_name}
          description={listing.description}
        />

        <div className="h-px bg-divider" />

        {/* Contact section */}
        <ListingContact />
      </div>

      {/* Sticky booking bar */}
      <BookingBar price={listing.price_per_night ?? 0} listingId={listing.id} />
    </div>
  );
};

export default ListingDetail;
