import { useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, Map, MessageSquare, User, Home } from "lucide-react";

const navItems = [
  { path: "/", label: "Εξερευνήστε", icon: Search },
  { path: "/wishlists", label: "Αγαπημένα", icon: Heart },
  { path: "/host/onboarding", label: "Φιλοξενία", icon: Home },
  { path: "/messages", label: "Μηνύματα", icon: MessageSquare },
  { path: "/profile", label: "Προφίλ", icon: User },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-divider safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
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
  );
};

export default BottomNavigation;
