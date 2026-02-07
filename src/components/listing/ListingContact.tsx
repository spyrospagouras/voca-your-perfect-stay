import { Phone, Smartphone, Mail, Globe, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

const contacts = [
  { icon: Phone, label: "Τηλέφωνο", value: "22820 42331", href: "tel:2282042331" },
  { icon: Phone, label: "Τηλέφωνο 2", value: "22820 42398", href: "tel:2282042398" },
  { icon: Smartphone, label: "Κινητό", value: "697 462 5077", href: "tel:6974625077" },
  { icon: Mail, label: "Email", value: "info@villageorge.gr", href: "mailto:info@villageorge.gr" },
  { icon: Globe, label: "Ιστοσελίδα", value: "villageorge.gr", href: "https://villageorge.gr" },
];

const ListingContact = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">Επικοινωνία</h2>

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
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{c.label}</p>
              <p className="text-sm text-foreground truncate">{c.value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Facebook */}
      <Button
        asChild
        variant="outline"
        className="w-full gap-2 border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/10"
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
