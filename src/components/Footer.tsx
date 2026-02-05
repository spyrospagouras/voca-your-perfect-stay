import { Globe, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Υποστήριξη</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Κέντρο Βοήθειας</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">AirCover</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Επιλογές ακύρωσης</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Αναφορά ζητήματος</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Κοινότητα</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">VOCA.org: καταστροφική ανακούφιση</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Καταπολέμηση διακρίσεων</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Φιλοξενία</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Φιλοξένησε το σπίτι σου</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">AirCover για οικοδεσπότες</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Πόροι φιλοξενίας</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Φόρουμ κοινότητας</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 VOCA, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:text-foreground transition-colors">Απόρρητο</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground transition-colors">Όροι</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground transition-colors">Χάρτης ιστότοπου</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:underline">
              <Globe className="w-4 h-4" />
              Ελληνικά (GR)
            </button>
            <span className="font-medium text-foreground">€ EUR</span>
            <div className="flex items-center gap-3">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
