import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Heart, Star, ChevronLeft, ChevronRight, Bed } from "lucide-react";
import type { Listing } from "@/data/mockListings";

interface PropertyCardSheetProps {
  listing: Listing;
}

const PropertyCardSheet = ({ listing }: PropertyCardSheetProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [listing.image];

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : null;

  const totalPrice = nights ? listing.price * nights : null;

  const nextImage = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const isGuestFavorite = listing.rating >= 4.9;

  return (
    <div className="mb-5" onClick={() => navigate(`/listing/${listing.id}`)} role="button">
      {/* Image Carousel */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-2.5">
        <img
          src={images[currentImage]}
          alt={listing.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Guest Favorite Badge */}
        {isGuestFavorite && (
          <div className="absolute top-3 left-3 bg-card text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <span>⭐</span> Επιλογή επισκεπτών
          </div>
        )}

        {/* Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center"
        >
          <Heart
            className={`w-6 h-6 drop-shadow-md transition-colors ${
              isLiked ? "fill-primary text-primary" : "text-background"
            }`}
            strokeWidth={2}
          />
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            {currentImage > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-card transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
            )}
            {currentImage < images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-card transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            )}
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
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
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold text-foreground line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-[13px] text-muted-foreground mt-0.5">{listing.type}</p>
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {listing.beds} {listing.beds === 1 ? "κρεβάτι" : "κρεβάτια"}
            </span>
            <span>·</span>
            <span>{listing.bedrooms} {listing.bedrooms === 1 ? "υπνοδωμάτιο" : "υπνοδωμάτια"}</span>
          </div>
          <div className="mt-1.5">
            <span className="text-[15px] font-semibold text-foreground">
              €{listing.price}
            </span>
            <span className="text-[13px] text-muted-foreground"> / νύχτα</span>
            {totalPrice && (
              <span className="text-[13px] text-muted-foreground ml-1.5 underline">
                €{totalPrice} συνολικά
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
          <span className="text-sm text-foreground font-medium">{listing.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSheet;
