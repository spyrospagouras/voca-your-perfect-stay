import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ListingGallery from "@/components/listing/ListingGallery";
import ListingHostSection from "@/components/listing/ListingHostSection";
import ListingSpecs from "@/components/listing/ListingSpecs";
import ListingContact from "@/components/listing/ListingContact";
import BookingBar from "@/components/listing/BookingBar";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

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
        <Skeleton className="w-full h-80 rounded-none" />
        <div className="p-5 space-y-4">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-px w-full" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
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

  const host = listing.profiles as any;
  const hostName = host?.full_name || "Οικοδεσπότης";
  const hostAvatar = host?.avatar_url || null;
  const images = listing.images?.length ? listing.images : ["/placeholder.svg"];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Floating top nav */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-3 pb-2 safe-top">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center shadow-sm border border-border"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center shadow-sm border border-border">
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
          <button className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center shadow-sm border border-border">
            <Heart className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Gallery */}
      <ListingGallery images={images} />

      {/* Content */}
      <div className="px-5 pt-5 space-y-5">
        {/* Title & rating */}
        <div>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            {listing.title}
          </h1>
          {listing.location_name && (
            <p className="text-sm text-muted-foreground mt-1">
              {listing.location_name}
            </p>
          )}
        </div>

        {/* Specs */}
        <ListingSpecs rating={listing.rating} />

        <Separator className="bg-divider" />

        {/* Host */}
        <ListingHostSection
          hostName={hostName}
          avatarUrl={hostAvatar}
        />

        <Separator className="bg-divider" />

        {/* Description */}
        {listing.description && (
          <>
            <div>
              <p className="text-sm text-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>
            <Separator className="bg-divider" />
          </>
        )}

        {/* Contact & Location */}
        <ListingContact />
      </div>

      {/* Sticky booking bar */}
      <BookingBar price={listing.price_per_night ?? 0} listingId={listing.id} />
    </div>
  );
};

export default ListingDetail;
