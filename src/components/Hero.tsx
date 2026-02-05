import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-villa.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Mediterranean Villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-up">
          Ανακάλυψε το επόμενο
          <br />
          <span className="text-coral-light">ταξίδι σου</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Μοναδικά καταλύματα σε όλο τον κόσμο. Από παραθαλάσσιες βίλες μέχρι ορεινά σαλέ.
        </p>

        {/* Search Box */}
        <div className="bg-card rounded-2xl md:rounded-full shadow-card-hover p-4 md:p-2 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-0">
            {/* Location */}
            <div className="flex-1 w-full md:w-auto px-4 py-2 text-left border-b md:border-b-0 md:border-r border-border">
              <label className="text-xs font-semibold text-foreground block">Προορισμός</label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Αναζήτηση προορισμών"
                  className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
                />
              </div>
            </div>

            {/* Check-in */}
            <div className="flex-1 w-full md:w-auto px-4 py-2 text-left border-b md:border-b-0 md:border-r border-border">
              <label className="text-xs font-semibold text-foreground block">Άφιξη</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Προσθήκη ημερομηνίας"
                  className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="flex-1 w-full md:w-auto px-4 py-2 text-left border-b md:border-b-0 md:border-r border-border">
              <label className="text-xs font-semibold text-foreground block">Αναχώρηση</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Προσθήκη ημερομηνίας"
                  className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="flex-1 w-full md:w-auto px-4 py-2 text-left">
              <label className="text-xs font-semibold text-foreground block">Επισκέπτες</label>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Προσθήκη επισκεπτών"
                  className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button className="w-full md:w-auto rounded-xl md:rounded-full px-6 py-6 shadow-button">
              <Search className="w-5 h-5 mr-2" />
              Αναζήτηση
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
