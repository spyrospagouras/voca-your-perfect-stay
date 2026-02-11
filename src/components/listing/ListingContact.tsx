import { Phone, Smartphone, Mail, Globe, MapPin, Building2, Facebook, Instagram, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ListingContactProps {
  businessName?: string | null;
  contactPerson?: string | null;
  contactAddress?: string | null;
  contactZip?: string | null;
  contactCity?: string | null;
  contactLandline?: string | null;
  contactMobile?: string | null;
  contactEmail?: string | null;
  contactWebsite?: string | null;
  contactFacebook?: string | null;
  contactInstagram?: string | null;
}

const ListingContact = ({
  businessName,
  contactPerson,
  contactAddress,
  contactZip,
  contactCity,
  contactLandline,
  contactMobile,
  contactEmail,
  contactWebsite,
  contactFacebook,
  contactInstagram,
}: ListingContactProps) => {
  const fullAddress = [contactAddress, contactZip, contactCity].filter(Boolean).join(", ");

  const hasAnyContact =
    businessName || contactPerson || fullAddress || contactLandline || contactMobile || contactEmail || contactWebsite || contactFacebook || contactInstagram;

  if (!hasAnyContact) return null;

  const rows = [
    businessName && { icon: Building2, label: "Επωνυμία", value: businessName },
    contactPerson && { icon: User, label: "Υπεύθυνος", value: contactPerson },
    fullAddress && { icon: MapPin, label: "Διεύθυνση", value: fullAddress },
    contactLandline && { icon: Phone, label: "Τηλέφωνο", value: contactLandline, href: `tel:${contactLandline.replace(/\s/g, "")}` },
    contactMobile && { icon: Smartphone, label: "Κινητό", value: contactMobile, href: `tel:${contactMobile.replace(/\s/g, "")}` },
    contactEmail && { icon: Mail, label: "Email", value: contactEmail, href: `mailto:${contactEmail}` },
    contactWebsite && { icon: Globe, label: "Ιστοσελίδα", value: contactWebsite, href: contactWebsite.startsWith("http") ? contactWebsite : `https://${contactWebsite}` },
  ].filter(Boolean) as { icon: any; label: string; value: string; href?: string }[];

  return (
    <section className="space-y-5">
      <h2 className="text-base font-bold text-foreground">Επικοινωνία</h2>

      <div className="space-y-1">
        {rows.map((r) => {
          const content = (
            <div key={r.label} className="flex items-center gap-3 px-1 py-3 border-b border-border last:border-b-0">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <r.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide w-20 shrink-0">{r.label}</span>
              <span className="text-sm text-foreground ml-auto text-right truncate">{r.value}</span>
            </div>
          );

          if (r.href) {
            return (
              <a
                key={r.label}
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block hover:bg-accent/50 rounded-lg transition-colors"
              >
                {content}
              </a>
            );
          }
          return content;
        })}
      </div>

      {/* Social buttons */}
      {(contactFacebook || contactInstagram) && (
        <div className="flex flex-col gap-2 pt-1">
          {contactFacebook && (
            <Button asChild variant="outline" className="w-full gap-2 border-[hsl(214,89%,52%)] text-[hsl(214,89%,52%)] hover:bg-[hsl(214,89%,52%,0.1)]">
              <a href={contactFacebook.startsWith("http") ? contactFacebook : `https://${contactFacebook}`} target="_blank" rel="noopener noreferrer">
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
            </Button>
          )}
          {contactInstagram && (
            <Button asChild variant="outline" className="w-full gap-2 border-[hsl(330,70%,50%)] text-[hsl(330,70%,50%)] hover:bg-[hsl(330,70%,50%,0.1)]">
              <a href={contactInstagram.startsWith("http") ? contactInstagram : `https://${contactInstagram}`} target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            </Button>
          )}
        </div>
      )}
    </section>
  );
};

export default ListingContact;
