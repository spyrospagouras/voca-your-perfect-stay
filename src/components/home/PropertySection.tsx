import { ChevronRight } from "lucide-react";
import ExploreCard from "./ExploreCard";

interface Property {
  id: number;
  image: string;
  title: string;
  dates: string;
  hostType: string;
  price: number;
  rating: number;
}

interface PropertySectionProps {
  title: string;
  subtitle?: string;
  properties: Property[];
}

const PropertySection = ({ title, subtitle, properties }: PropertySectionProps) => {
  return (
    <section className="py-4">
      {/* Section Header */}
      <div className="px-4 mb-3">
        <button className="flex items-center justify-between w-full group">
          <div className="text-left">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>

      {/* Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-4 pb-2">
          {properties.map((property) => (
            <ExploreCard
              key={property.id}
              image={property.image}
              title={property.title}
              dates={property.dates}
              hostType={property.hostType}
              price={property.price}
              rating={property.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertySection;
