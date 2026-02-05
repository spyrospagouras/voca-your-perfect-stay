import { Search, LayoutGrid, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const listings = [
  {
    id: 1,
    title: "Stivari view",
    location: "Stivari",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    status: "active",
    statusLabel: "Καταχωρημένη",
  },
  {
    id: 2,
    title: "Athens Downtown Loft",
    location: "Athens",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    status: "active",
    statusLabel: "Καταχωρημένη",
  },
];

const HostListings = () => {
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
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative aspect-[16/10]">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-background/95 text-foreground hover:bg-background/95 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  {listing.statusLabel}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {listing.title}
              </h3>
              <p className="text-sm text-muted-foreground">{listing.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (hidden when listings exist) */}
      {listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Δεν έχετε καταχωρήσεις
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Δημιουργήστε την πρώτη σας καταχώρηση για να ξεκινήσετε
          </p>
        </div>
      )}
    </div>
  );
};

export default HostListings;
