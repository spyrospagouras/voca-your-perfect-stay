import { MapPin, User, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ListingInfoProps {
  title: string;
  hostName: string;
  location: string | null;
  description: string | null;
}

const ListingInfo = ({ title, hostName, location, description }: ListingInfoProps) => {
  return (
    <section className="space-y-5">
      {/* Business name */}
      <div className="flex items-center gap-3">
        <Home className="w-5 h-5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Επωνυμία</p>
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
      </div>

      <Separator className="bg-divider" />

      {/* Host */}
      <div className="flex items-center gap-3">
        <User className="w-5 h-5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Υπεύθυνος Επικοινωνίας
          </p>
          <p className="text-sm font-medium text-foreground">{hostName}</p>
        </div>
      </div>

      <Separator className="bg-divider" />

      {/* Location */}
      {location && (
        <>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Τοποθεσία</p>
              <p className="text-sm text-foreground">{location}</p>
            </div>
          </div>
          <Separator className="bg-divider" />
        </>
      )}

      {/* Description */}
      {description && (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Περιγραφή</p>
          <p className="text-sm text-foreground leading-relaxed">{description}</p>
        </div>
      )}
    </section>
  );
};

export default ListingInfo;
