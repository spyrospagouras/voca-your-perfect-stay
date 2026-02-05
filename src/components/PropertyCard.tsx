import { useState } from "react";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyCardProps {
  images: string[];
  location: string;
  distance: string;
  dates: string;
  price: number;
  rating: number;
  isSuperhost?: boolean;
}

const PropertyCard = ({
  images,
  location,
  distance,
  dates,
  price,
  rating,
  isSuperhost = false,
}: PropertyCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="group cursor-pointer animate-fade-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel */}
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
        <img
          src={images[currentImage]}
          alt={location}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Superhost Badge */}
        {isSuperhost && (
          <div className="absolute top-3 left-3 bg-card px-2.5 py-1 rounded-full text-xs font-semibold shadow-card">
            Superhost
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 transition-transform hover:scale-110"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              isLiked
                ? "fill-primary text-primary"
                : "fill-charcoal/30 text-primary-foreground"
            }`}
          />
        </button>

        {/* Navigation Arrows */}
        {isHovered && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-card hover:scale-105 transition-transform"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-card hover:scale-105 transition-transform"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentImage ? "bg-primary-foreground" : "bg-primary-foreground/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{location}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-foreground text-foreground" />
            <span className="text-sm font-medium">{rating.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{distance}</p>
        <p className="text-sm text-muted-foreground">{dates}</p>
        <p className="text-foreground mt-1">
          <span className="font-semibold">€{price}</span>
          <span className="text-muted-foreground"> / διανυκτέρευση</span>
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;
