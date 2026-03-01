import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import type { Listing } from "@/data/mockListings";

interface PropertyCardSheetProps {
  listing: Listing;
}

const PropertyCardSheet = ({ listing }: PropertyCardSheetProps) => {
  const navigate = useNavigate();
  return (
  <div className="mb-4" onClick={() => navigate(`/listing/${listing.id}`)} role="button">
    {/* Image */}
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-2">
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Heart */}
      <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center">
        <Heart className="w-6 h-6 text-background drop-shadow-md" strokeWidth={2} />
      </button>
      {/* Superhost badge */}
      {listing.rating >= 4.9 && (
        <div className="absolute top-3 left-3 bg-card text-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          Superhost
        </div>
      )}
    </div>

    {/* Info */}
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{listing.type}</p>
        <p className="text-sm font-semibold text-foreground mt-1">
          €{listing.price}{" "}
          <span className="font-normal text-muted-foreground">/ νύχτα</span>
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0 pt-0.5">
        <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
        <span className="text-sm text-foreground">{listing.rating}</span>
      </div>
    </div>
  </div>
  );
};

export default PropertyCardSheet;
