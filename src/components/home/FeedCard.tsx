import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddToWishlistDialog from "@/components/wishlists/AddToWishlistDialog";

interface FeedCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  propertyType: string;
  price: number;
  rating: number | null;
}

const FeedCard = ({
  id,
  image,
  title,
  location,
  propertyType,
  price,
  rating,
}: FeedCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showWishlistDialog, setShowWishlistDialog] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWishlistDialog(true);
  };

  return (
    <>
      <div
        onClick={() => navigate(`/listing/${id}`)}
        className="cursor-pointer group"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <img
            src={image}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Heart */}
          <button
            onClick={handleHeartClick}
            className="absolute top-3 right-3 p-1.5 transition-transform hover:scale-110"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isLiked
                  ? "fill-primary text-primary"
                  : "fill-black/30 text-white stroke-white"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="mt-2 space-y-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-[15px] leading-tight line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {rating !== null && rating > 0 ? (
                <>
                  <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
                  <span className="text-xs font-medium">
                    {rating.toFixed(1).replace(".", ",")}
                  </span>
                </>
              ) : (
                <span className="text-xs font-medium text-muted-foreground">
                  Νέο
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{location}</p>
          <p className="text-sm text-muted-foreground">{propertyType}</p>
          <p className="text-sm text-foreground pt-0.5">
            <span className="font-semibold">€ {price}</span>
            <span className="text-muted-foreground"> ανά διανυκτέρευση</span>
          </p>
        </div>
      </div>

      <AddToWishlistDialog
        open={showWishlistDialog}
        onOpenChange={setShowWishlistDialog}
        listingId={id}
      />
    </>
  );
};

export default FeedCard;
