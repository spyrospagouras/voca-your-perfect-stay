import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

const TopHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-divider safe-top">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left side - Logo and Back button */}
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-foreground">VOCA</span>
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors -mt-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Πίσω</span>
            </button>
          )}
        </div>

        {/* Right side - Profile avatar */}
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full border-2 border-divider flex items-center justify-center hover:border-muted-foreground transition-colors"
        >
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
