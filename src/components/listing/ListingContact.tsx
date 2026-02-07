import { Phone, Smartphone, Mail, Globe, MapPin, Building2, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const businessInfo = {
  name: "VILLA GEORGE - ΧΑΛΑ ΜΑΡΙΑ ΚΑΙ ΣΙΑ Ο.Ε.",
  address: "ΜΠΑΤΣΙ, Τ.Κ. 84500, ΑΝΔΡΟΣ (ΜΠΑΤΣΙ)",
};

const contacts = [
  { icon: Phone, label: "Τηλέφωνο", value: "22820 42331", href: "tel:2282042331" },
  { icon: Phone, label: "Τηλέφωνο 2", value: "22820 42398", href: "tel:2282042398" },
  { icon: Smartphone, label: "Κινητό", value: "697 462 5077", href: "tel:6974625077" },
  { icon: Mail, label: "Email", value: "villapitsageorge@gmail.com", href: "mailto:villapitsageorge@gmail.com" },
  { icon: Globe, label: "Ιστοσελίδα", value: "batsistudios.gr", href: "http://www.batsistudios.gr" },
];

const ListingContact = () => {
  return (
    <section className="space-y-5">
      <h2 className="text-base font-bold text-foreground">Επικοινωνία & Τοποθεσία</h2>

      {/* Business identity */}
      <div className="flex items-start gap-3">
        <Building2 className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Επωνυμία</p>
          <p className="text-sm font-semibold text-foreground">{businessInfo.name}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Διεύθυνση</p>
          <p className="text-sm text-foreground">{businessInfo.address}</p>
        </div>
      </div>

      <Separator className="bg-divider" />

      {/* Contact grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors"
          >
            <c.icon className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                {c.label}
              </p>
              <p className="text-sm text-foreground truncate">{c.value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Facebook */}
      <Button
        asChild
        variant="outline"
        className="w-full gap-2 border-[hsl(214,89%,52%)] text-[hsl(214,89%,52%)] hover:bg-[hsl(214,89%,52%,0.1)]"
      >
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <Facebook className="w-4 h-4" />
          Facebook
        </a>
      </Button>
    </section>
  );
};

export default ListingContact;
