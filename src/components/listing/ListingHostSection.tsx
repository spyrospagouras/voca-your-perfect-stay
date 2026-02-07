import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface ListingHostSectionProps {
  hostName: string;
  avatarUrl: string | null;
  isSuperhost?: boolean;
}

const ListingHostSection = ({
  hostName,
  avatarUrl,
  isSuperhost = true,
}: ListingHostSectionProps) => {
  const initials = hostName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12 border border-border">
          <AvatarImage src={avatarUrl ?? undefined} alt={hostName} />
          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Οικοδεσπότης: {hostName}
          </p>
          {isSuperhost && (
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Superhost</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingHostSection;
