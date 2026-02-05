import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";

interface WishlistCardProps {
  title: string;
  subtitle: string;
  images?: string[];
}

const WishlistCard = ({ title, subtitle, images }: WishlistCardProps) => {
  // Use provided images or default ones
  const displayImages = images && images.length > 0 
    ? images 
    : [listing1, listing2, listing3, listing4];

  return (
    <div className="cursor-pointer group">
      {/* Image Grid Container */}
      <div className="aspect-square rounded-[20px] overflow-hidden mb-2 bg-muted">
        <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-full">
          {displayImages.slice(0, 4).map((image, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden"
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
          {/* Fill empty slots with placeholder */}
          {displayImages.length < 4 && 
            Array.from({ length: 4 - displayImages.length }).map((_, index) => (
              <div 
                key={`empty-${index}`} 
                className="bg-muted"
              />
            ))
          }
        </div>
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
