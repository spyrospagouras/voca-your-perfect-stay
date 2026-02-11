import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ListingGallery from "@/components/listing/ListingGallery";
import ListingAmenities from "@/components/listing/ListingAmenities";
import ListingLocationMap from "@/components/listing/ListingLocationMap";
import ListingHostSection from "@/components/listing/ListingHostSection";
import ListingContact from "@/components/listing/ListingContact";
import AvailabilityModal from "@/components/listing/AvailabilityModal";
import { ArrowLeft, Heart, Share2, Users, BedDouble, Bath, DoorOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, profiles:host_id(full_name, avatar_url)")
        .eq("id", id!)
        .maybeSingle() as any;
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleContact = () => {
    if (!user) {
      toast({ title: "Συνδεθείτε για να στείλετε μήνυμα", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!listing) return;
    navigate(`/chat?host=${listing.host_id}&listing=${listing.id}`);
  };

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

  const specs = [
    { icon: Users, label: "Επισκέπτες", value: listing.max_guests },
    { icon: DoorOpen, label: "Υπνοδωμάτια", value: listing.bedrooms },
    { icon: BedDouble, label: "Κρεβάτια", value: listing.beds },
    { icon: Bath, label: "Μπάνια", value: listing.bathrooms },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
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
        {/* Title & breadcrumb */}
        <div>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            {listing.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {[listing.property_type, listing.city, "Ελλάδα"]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>

        {/* Contact details right below title */}
        <ListingContact
          businessName={listing.business_name}
          contactPerson={listing.contact_person}
          contactAddress={listing.contact_address}
          contactZip={listing.contact_zip}
          contactCity={listing.contact_city}
          contactLandline={listing.contact_landline}
          contactMobile={listing.contact_mobile}
          contactEmail={listing.contact_email}
          contactWebsite={listing.contact_website}
          contactFacebook={listing.contact_facebook}
          contactInstagram={listing.contact_instagram}
        />

        {/* Description */}
        {listing.description && (
          <p className="text-sm text-foreground leading-relaxed">
            {listing.description}
          </p>
        )}

        <Separator className="bg-divider" />

        {/* Χώρος Section */}
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">Χώρος</h2>
          <div className="grid grid-cols-2 gap-3">
            {specs.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 p-3 rounded-xl border border-border"
              >
                <s.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="bg-divider" />

        {/* Παροχές Section */}
        <ListingAmenities amenities={listing.amenities ?? []} />

        <Separator className="bg-divider" />

        {/* Τοποθεσία Section */}
        <ListingLocationMap
          lat={listing.latitude}
          lng={listing.longitude}
          locationName={listing.location_name}
        />

        <Separator className="bg-divider" />

        <Separator className="bg-divider" />

        {/* Host Section */}
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">Ο οικοδεσπότης σας</h2>
          <ListingHostSection hostName={hostName} avatarUrl={hostAvatar} />
        </section>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border px-5 py-3 safe-bottom">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <span className="text-base font-bold text-foreground">
              €{listing.price_per_night ?? 0}
            </span>
            <span className="text-sm text-muted-foreground"> / νύχτα</span>
          </div>
          <button
            onClick={() => setAvailabilityOpen(true)}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md active:scale-[0.97] transition-transform"
          >
            Έλεγχος διαθεσιμότητας
          </button>
        </div>
      </div>

      {/* Availability Modal */}
      <AvailabilityModal
        open={availabilityOpen}
        onOpenChange={setAvailabilityOpen}
        listingId={listing.id}
        pricePerNight={listing.price_per_night ?? 0}
      />
    </div>
  );
};

export default ListingDetail;
