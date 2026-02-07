import { Star, Users, BedDouble, Bath, DoorOpen } from "lucide-react";

interface ListingSpecsProps {
  rating: number | null;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
}

const ListingSpecs = ({
  rating,
  guests = 2,
  bedrooms = 1,
  beds = 1,
  bathrooms = 1,
}: ListingSpecsProps) => {
  const specs = [
    { icon: Users, label: `${guests} επισκέπτες` },
    { icon: DoorOpen, label: `${bedrooms} υπνοδωμάτιο` },
    { icon: BedDouble, label: `${beds} κρεβάτι` },
    { icon: Bath, label: `${bathrooms} μπάνιο` },
  ];

  return (
    <div className="space-y-3">
      {/* Rating */}
      {rating !== null && rating !== undefined && (
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-foreground text-foreground" />
          <span className="text-sm font-semibold text-foreground">
            {Number(rating).toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">· 7 κριτικές</span>
        </div>
      )}

      {/* Specs row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        {specs.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <s.icon className="w-4 h-4" />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ListingSpecs;
