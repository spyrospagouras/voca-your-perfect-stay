import SearchBar from "@/components/home/SearchBar";
import CategoryTabs from "@/components/home/CategoryTabs";
import PropertySection from "@/components/home/PropertySection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: listings, isLoading } = useQuery({
    queryKey: ["home-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, cover_image_url, images, city, location_name, price_per_night, rating, property_type, privacy_type")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const properties = (listings ?? []).map((l) => ({
    id: l.id,
    image: l.cover_image_url || (l.images && l.images.length > 0 ? l.images[0] : "/placeholder.svg"),
    title: l.title,
    location: l.city || l.location_name || "",
    hostType: l.property_type || "",
    price: l.price_per_night ?? 0,
    rating: l.rating ?? null,
    listingId: l.id,
  }));

  return (
    <div className="bg-background min-h-full">
      <SearchBar />
      <CategoryTabs />

      {isLoading ? (
        <div className="px-4 py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-[280px] h-[210px] rounded-2xl flex-shrink-0" />
              <Skeleton className="w-[280px] h-[210px] rounded-2xl flex-shrink-0" />
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <p className="text-muted-foreground text-sm">
            Δεν βρέθηκαν καταλύματα αυτή τη στιγμή.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          <PropertySection
            title="Διαθέσιμα καταλύματα"
            properties={properties}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
