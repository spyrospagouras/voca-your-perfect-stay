import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import type { Listing } from "@/data/mockListings";

interface ListingCardProps {
  listing: Listing;
  isActive: boolean;
  onHover: (id: string | null) => void;
}

const ListingCard = ({ listing, isActive, onHover }: ListingCardProps) => {
  const navigate = useNavigate();
  return (
  <div
    onClick={() => navigate(`/listing/${listing.id}`)}
    onMouseEnter={() => onHover(listing.id)}
    onMouseLeave={() => onHover(null)}
    className={`flex gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
      isActive ? "bg-accent" : "hover:bg-accent/50"
    }`}
  >
    <div className="w-[120px] h-[90px] rounded-xl bg-muted overflow-hidden shrink-0">
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-foreground line-clamp-1">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-foreground text-foreground" />
            <span className="text-xs text-foreground">{listing.rating}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{listing.type}</p>
      </div>
      <p className="text-sm font-semibold text-foreground">
        €{listing.price}{" "}
        <span className="font-normal text-muted-foreground">/ νύχτα</span>
      </p>
    </div>
  </div>
  );
};

export default ListingCard;
