import { useLocation, useNavigate } from "react-router-dom";
import { Inbox, Calendar, LayoutGrid, MessageSquare, Menu, ArrowLeftRight } from "lucide-react";

const hostNavItems = [
  { path: "/host", label: "Σήμερα", icon: Inbox },
  { path: "/host/calendar", label: "Ημερολόγιο", icon: Calendar },
  { path: "/host/listings", label: "Καταχωρήσεις", icon: LayoutGrid },
  { path: "/host/messages", label: "Μηνύματα", icon: MessageSquare },
  { path: "/host/menu", label: "Μενού", icon: Menu },
];

const HostBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSwitchToGuestMode = () => {
    navigate("/");
  };

  return (
    <>
      {/* Floating Guest Mode Toggle */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={handleSwitchToGuestMode}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-3 rounded-full shadow-lg hover:bg-foreground/90 transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span className="text-sm font-medium">Λειτουργία ταξιδιού</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-divider safe-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {hostNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center flex-1 py-2 transition-colors"
              >
                <Icon
                  className={`w-6 h-6 mb-1 transition-colors ${
                    isActive ? "text-nav-active" : "text-nav-inactive"
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? "text-nav-active" : "text-nav-inactive"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default HostBottomNavigation;
