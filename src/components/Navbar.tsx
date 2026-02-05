import { useState } from "react";
import { Search, Globe, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-card shadow-card py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">V</span>
          </div>
          <span className="text-2xl font-bold text-foreground">VOCA</span>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center bg-card rounded-full shadow-card border border-border px-2 py-1.5">
          <button className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-full transition-colors">
            Οπουδήποτε
          </button>
          <span className="h-6 w-px bg-border" />
          <button className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-full transition-colors">
            Οποιαδήποτε εβδομάδα
          </button>
          <span className="h-6 w-px bg-border" />
          <button className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-full transition-colors">
            Προσθήκη επισκεπτών
          </button>
          <Button size="icon" className="rounded-full ml-2 shadow-button">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="hidden md:flex text-sm font-medium rounded-full hover:bg-muted"
          >
            Γίνε οικοδεσπότης
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted"
          >
            <Globe className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-2 py-1.5 hover:shadow-card transition-shadow cursor-pointer">
            <Menu className="w-5 h-5 text-muted-foreground" />
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
