import { Phone, Smartphone, Mail, Globe, MapPin, Building2, Facebook, Instagram, User, Hash, MapPinned } from "lucide-react";

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
  const rows: { icon: any; label: string; value: string; href?: string }[] = [];

  if (businessName) rows.push({ icon: Building2, label: "Επωνυμία:", value: businessName });
  if (contactPerson) rows.push({ icon: User, label: "Υπεύθυνος Επικοινωνίας:", value: contactPerson });
  if (contactAddress) rows.push({ icon: MapPin, label: "Διεύθυνση:", value: contactAddress });
  if (contactZip) rows.push({ icon: Hash, label: "Τ.Κ.:", value: contactZip });
  if (contactCity) rows.push({ icon: MapPinned, label: "Πόλη:", value: contactCity });
  if (contactLandline) rows.push({ icon: Phone, label: "Τηλέφωνο:", value: contactLandline, href: `tel:${contactLandline.replace(/\s/g, "")}` });
  if (contactMobile) rows.push({ icon: Smartphone, label: "Κινητό Τηλέφωνο:", value: contactMobile, href: `tel:${contactMobile.replace(/\s/g, "")}` });
  if (contactEmail) rows.push({ icon: Mail, label: "E-mail:", value: contactEmail, href: `mailto:${contactEmail}` });
  if (contactWebsite) rows.push({ icon: Globe, label: "URL:", value: contactWebsite, href: contactWebsite.startsWith("http") ? contactWebsite : `https://${contactWebsite}` });

  if (rows.length === 0 && !contactFacebook && !contactInstagram) return null;

  return (
    <section className="space-y-4">
      {rows.length > 0 && (
        <div className="divide-y divide-border">
          {rows.map((r) => {
            const valueEl = (
              <span className={`text-sm text-foreground ${r.href ? "underline underline-offset-2" : ""}`}>
                {r.value}
              </span>
            );

            return (
              <div key={r.label} className="flex items-start gap-3 py-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <r.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0 mt-1">{r.label}</span>
                <div className="ml-auto text-right mt-1">
                  {r.href ? (
                    <a
                      href={r.href}
                      target={r.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                    >
                      {valueEl}
                    </a>
                  ) : (
                    valueEl
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(contactFacebook || contactInstagram) && (
        <div className="flex items-center justify-center gap-3 pt-1">
          {contactFacebook && (
            <a
              href={contactFacebook.startsWith("http") ? contactFacebook : `https://${contactFacebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </a>
          )}
          {contactInstagram && (
            <a
              href={contactInstagram.startsWith("http") ? contactInstagram : `https://${contactInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          )}
        </div>
      )}
    </section>
  );
};

export default ListingContact;
