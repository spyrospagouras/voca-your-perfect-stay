import { Home, Headphones, Plane } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatItemProps {
  avatar?: string;
  name: string;
  date: string;
  message: string;
  contextInfo: string;
  type: "hosting" | "support" | "trip";
  unread?: boolean;
}

const typeIcons = {
  hosting: Home,
  support: Headphones,
  trip: Plane,
};

const ChatItem = ({
  avatar,
  name,
  date,
  message,
  contextInfo,
  type,
  unread = false,
}: ChatItemProps) => {
  const TypeIcon = typeIcons[type];

  return (
    <div className="flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors">
      {/* Avatar with Badge */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-14 h-14">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-muted text-muted-foreground text-lg">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* Type Badge */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card border-2 border-background rounded-full flex items-center justify-center shadow-sm">
          <TypeIcon className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top Line: Name and Date */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-sm ${unread ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>
            {name}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">{date}</span>
        </div>

        {/* Message Preview */}
        <p className={`text-sm line-clamp-2 mb-1 ${unread ? "text-foreground" : "text-muted-foreground"}`}>
          {message}
        </p>

        {/* Context Info */}
        <p className="text-xs text-muted-foreground">{contextInfo}</p>
      </div>

      {/* Unread Indicator */}
      {unread && (
        <div className="flex-shrink-0 self-center">
          <div className="w-2.5 h-2.5 bg-primary rounded-full" />
        </div>
      )}
    </div>
  );
};

export default ChatItem;
