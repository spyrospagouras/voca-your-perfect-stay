import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, Heart, ChevronLeft, ChevronRight, Bed } from "lucide-react";
import type { Listing } from "@/data/mockListings";

interface ListingCardProps {
  listing: Listing;
  isActive: boolean;
  onHover: (id: string | null) => void;
}

const ListingCard = ({ listing, isActive, onHover }: ListingCardProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [listing.image];

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : null;
  const totalPrice = nights ? listing.price * nights : null;

  const isGuestFavorite = listing.rating >= 4.9;

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      onMouseEnter={() => { onHover(listing.id); setIsHovered(true); }}
      onMouseLeave={() => { onHover(null); setIsHovered(false); }}
      className={`rounded-xl cursor-pointer transition-colors overflow-hidden ${
        isActive ? "bg-accent" : "hover:bg-accent/50"
      }`}
    >
      {/* Image carousel */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={images[currentImage]}
          alt={listing.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {isGuestFavorite && (
          <div className="absolute top-2.5 left-2.5 bg-card text-foreground text-[11px] font-semibold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <span>⭐</span> Επιλογή επισκεπτών
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-2.5 right-2.5"
        >
          <Heart
            className={`w-5 h-5 drop-shadow-md transition-colors ${
              isLiked ? "fill-primary text-primary" : "text-background"
            }`}
            strokeWidth={2}
          />
        </button>

        {isHovered && images.length > 1 && (
          <>
            {currentImage > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
              </button>
            )}
            {currentImage < images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
              >
                <ChevronRight className="w-3.5 h-3.5 text-foreground" />
              </button>
            )}
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 5).map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentImage ? "bg-card" : "bg-card/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1 flex-1">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-foreground text-foreground" />
            <span className="text-xs font-medium text-foreground">{listing.rating}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{listing.type}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
          <Bed className="w-3 h-3" />
          <span>{listing.beds} {listing.beds === 1 ? "κρεβάτι" : "κρεβάτια"}</span>
          <span>·</span>
          <span>{listing.bedrooms} υπν.</span>
        </div>
        <div className="mt-1.5">
          <span className="text-sm font-semibold text-foreground">€{listing.price}</span>
          <span className="text-xs text-muted-foreground"> / νύχτα</span>
          {totalPrice && (
            <span className="text-xs text-muted-foreground ml-1.5 underline">
              €{totalPrice} συνολικά
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
