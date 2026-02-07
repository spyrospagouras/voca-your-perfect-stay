import { Heart } from "lucide-react";

interface WishlistCardProps {
  title: string;
  subtitle: string;
  images?: string[];
}

const WishlistCard = ({ title, subtitle, images }: WishlistCardProps) => {
  const hasImage = images && images.length > 0;

  return (
    <div className="cursor-pointer group">
      {/* Image Container */}
      <div className="aspect-square rounded-[20px] overflow-hidden mb-2 bg-muted">
        {hasImage ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-0.5">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

export default WishlistCard;
