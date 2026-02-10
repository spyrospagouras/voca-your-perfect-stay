import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddToWishlistDialog from "@/components/wishlists/AddToWishlistDialog";

interface ExploreCardProps {
  image: string;
  title: string;
  dates: string;
  hostType: string;
  price: number;
  rating: number | null;
  listingId?: string;
}

const ExploreCard = ({
  image,
  title,
  dates,
  hostType,
  price,
  rating,
  listingId,
}: ExploreCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showWishlistDialog, setShowWishlistDialog] = useState(false);
  const navigate = useNavigate();

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (listingId) {
      setShowWishlistDialog(true);
    } else {
      setIsLiked(!isLiked);
    }
  };

  const handleCardClick = () => {
    if (listingId) {
      navigate(`/listing/${listingId}`);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="min-w-[280px] max-w-[280px] flex-shrink-0 cursor-pointer group"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-2">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Heart Button */}
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
        <div className="space-y-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">
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
                <span className="text-xs font-medium text-muted-foreground">Νέο</span>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{dates}</p>
          <p className="text-xs text-muted-foreground">{hostType}</p>
          <p className="text-sm text-foreground pt-0.5">
            <span className="font-semibold">€ {price}</span>
            <span className="text-muted-foreground"> ανά διανυκτέρευση</span>
          </p>
        </div>
      </div>

      {listingId && (
        <AddToWishlistDialog
          open={showWishlistDialog}
          onOpenChange={setShowWishlistDialog}
          listingId={listingId}
        />
      )}
    </>
  );
};

export default ExploreCard;
