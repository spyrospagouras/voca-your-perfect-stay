import { Bell, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HostToday = () => {
  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Σήμερα</h1>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Bell className="w-6 h-6 text-foreground" />
          </button>
          <Avatar className="w-10 h-10 border-2 border-border">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Profile" />
            <AvatarFallback>Π</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Δεν έχετε καμία κράτηση
        </h2>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Οι επερχόμενες κρατήσεις και οι αφίξεις θα εμφανίζονται εδώ
        </p>
      </div>
    </div>
  );
};

export default HostToday;
