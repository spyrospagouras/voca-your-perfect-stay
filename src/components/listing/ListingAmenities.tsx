import { useState } from "react";
import { Check } from "lucide-react";

interface ListingAmenitiesProps {
  amenities: string[];
}

const ListingAmenities = ({ amenities }: ListingAmenitiesProps) => {
  const [showAll, setShowAll] = useState(false);

  if (!amenities.length) return null;

  const visible = showAll ? amenities : amenities.slice(0, 6);

  return (
    <section>
      <h2 className="text-base font-bold text-foreground mb-4">Παροχές</h2>
      <ul className="space-y-3">
        {visible.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-foreground">
            <Check className="w-4 h-4 text-muted-foreground shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      {amenities.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm font-semibold text-foreground underline underline-offset-4"
        >
          {showAll
            ? "Απόκρυψη"
            : `Εμφάνιση όλων των παροχών (${amenities.length})`}
        </button>
      )}
    </section>
  );
};

export default ListingAmenities;
