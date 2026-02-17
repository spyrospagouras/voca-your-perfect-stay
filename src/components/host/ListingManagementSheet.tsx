import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ListingManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: {
    id: string;
    title: string;
    city?: string | null;
    location_name?: string | null;
    cover_image_url?: string | null;
    status: string;
  } | null;
  onDeleted: () => void;
}

const STORAGE_KEY = "voca_onboarding_draft";

const ListingManagementSheet = ({
  open,
  onOpenChange,
  listing,
  onDeleted,
}: ListingManagementSheetProps) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!listing) return null;

  const handleEdit = async () => {
    // Fetch full listing data to pre-fill onboarding
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", listing.id)
      .single();

    if (error || !data) {
      toast({ title: "Σφάλμα", description: "Δεν ήταν δυνατή η φόρτωση.", variant: "destructive" });
      return;
    }

    // Build draft for localStorage so onboarding picks it up
    const draft = {
      step: "category",
      listingId: data.id,
      category: data.property_type || "",
      privacyType: data.privacy_type || "",
      address: data.location_name || "",
      lat: data.latitude ?? 37.9838,
      lng: data.longitude ?? 23.7275,
      street: data.street || "",
      zip: data.zip || "",
      city: data.city || "",
      showExact: data.show_exact_location ?? true,
      basics: {
        guests: data.max_guests || 2,
        bedrooms: data.bedrooms || 1,
        beds: data.beds || 1,
        bathrooms: data.bathrooms || 1,
      },
      amenities: data.amenities || [],
      photos: data.images || [],
      listingTitle: data.title || "",
      highlights: data.highlights || [],
      description: data.description || "",
      pricePerNight: Number(data.price_per_night) || 50,
      bookingType: data.booking_type || "",
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    onOpenChange(false);
    navigate("/host/onboarding");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listing.id);
      if (error) throw error;
      toast({ title: "Η καταχώρηση αφαιρέθηκε" });
      setConfirmOpen(false);
      onOpenChange(false);
      onDeleted();
    } catch (err: any) {
      toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const location = listing.city || listing.location_name || "";

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-w-lg mx-auto">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Διαχείριση καταχώρησης</DrawerTitle>
          </DrawerHeader>

          <div className="px-6 pb-8 pt-2">
            {/* Listing preview */}
            <div className="flex gap-4 items-start mb-6">
              <img
                src={listing.cover_image_url || "/placeholder.svg"}
                alt={listing.title}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0 pt-1">
                <h3 className="text-base font-semibold text-foreground truncate">
                  {listing.title}
                </h3>
                {location && (
                  <p className="text-sm text-muted-foreground">{location}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleEdit}
                className="w-full rounded-xl h-12 text-base font-semibold"
              >
                Επεξεργασία καταχώρησης
              </Button>

              <button
                onClick={() => setConfirmOpen(true)}
                className="w-full text-center text-sm font-medium text-destructive hover:underline py-2"
              >
                Αφαίρεση καταχώρησης
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Αφαίρεση καταχώρησης</AlertDialogTitle>
            <AlertDialogDescription>
              Είστε σίγουροι ότι θέλετε να αφαιρέσετε αυτήν την καταχώρηση; Η ενέργεια δεν μπορεί να αναιρεθεί.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Αφαίρεση..." : "Αφαίρεση"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ListingManagementSheet;
