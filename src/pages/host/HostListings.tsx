import { Search, LayoutGrid, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const statusMap: Record<string, { label: string; color: string }> = {
  active: { label: "Καταχωρημένη", color: "bg-green-500" },
  draft: { label: "Πρόχειρο", color: "bg-yellow-500" },
  inactive: { label: "Ανενεργή", color: "bg-muted-foreground" },
};

const HostListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["host-listings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, location_name, cover_image_url, status, city")
        .eq("host_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Οι καταχωρήσεις σας</h1>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Search className="w-5 h-5 text-foreground" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <LayoutGrid className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => navigate("/host/onboarding")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listings */}
      {!isLoading && listings.length > 0 && (
        <div className="space-y-4">
          {listings.map((listing) => {
            const status = statusMap[listing.status] || statusMap.draft;
            return (
              <div
                key={listing.id}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[16/10]">
                  <img
                    src={listing.cover_image_url || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-background/95 text-foreground hover:bg-background/95 px-3 py-1 rounded-full">
                      <span className={`w-2 h-2 rounded-full ${status.color} mr-2`} />
                      {status.label}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {listing.city || listing.location_name || ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-muted-foreground">
            Δεν έχετε καταχωρήσεις ακόμη
          </p>
        </div>
      )}
    </div>
  );
};

export default HostListings;
