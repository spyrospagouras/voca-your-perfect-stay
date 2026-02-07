import { Bell, Settings, BookOpen, Plus, LogOut, ChevronRight, Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: Settings, label: "Ρυθμίσεις λογαριασμού" },
  { icon: BookOpen, label: "Πηγές για τη φιλοξενία" },
  { icon: Plus, label: "Δημιουργήστε μια νέα καταχώρηση" },
];

const HostMenu = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Μενού</h1>
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

      {/* Promotion Banner */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary to-muted rounded-2xl p-6 mb-6 border border-border">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground mb-2">Ξεκινάτε στη VOCA;</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Μάθετε πώς να διαχειρίζεστε τις καταχωρήσεις σας και να υποδέχεστε επισκέπτες
            </p>
            <Button className="rounded-full px-6" onClick={() => navigate("/host/onboarding")}>
              Ξεκινήστε
            </Button>
          </div>
          <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center">
            <Home className="w-10 h-10 text-primary" />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Δημιουργήστε μια νέα καταχώρηση") {
                  navigate("/host/create-listing");
                }
              }}
              className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-muted transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left text-foreground font-medium text-sm">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <button className="w-full flex items-center gap-4 px-4 py-4 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
        <LogOut className="w-5 h-5" />
        <span className="font-medium text-sm">Αποσύνδεση</span>
      </button>
    </div>
  );
};

export default HostMenu;
