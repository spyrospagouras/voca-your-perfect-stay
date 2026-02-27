import { useState } from "react";
import { Phone, MessageCircle, Mail, Globe, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import OnboardingFooter from "./OnboardingFooter";

interface ContactData {
  contactMobile: string;
  contactLandline: string;
  contactEmail: string;
  contactWebsite: string;
  contactFacebook: string;
  contactInstagram: string;
}

interface Props {
  data: ContactData;
  onChange: (data: ContactData) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
}

const fields = [
  { key: "contactMobile" as const, label: "Τηλεφωνικός αριθμός", sub: "Κλήσεις", icon: Phone },
  { key: "contactLandline" as const, label: "Viber", sub: "Μηνύματα Viber", icon: MessageCircle },
  { key: "contactFacebook" as const, label: "WhatsApp", sub: "Μηνύματα WhatsApp", icon: MessageCircle },
  { key: "contactInstagram" as const, label: "Messenger", sub: "Μηνύματα Messenger", icon: MessageCircle },
  { key: "contactEmail" as const, label: "Email", sub: "Ηλεκτρονικό ταχυδρομείο", icon: Mail },
  { key: "contactWebsite" as const, label: "Ιστοσελίδα", sub: "Website URL", icon: Globe },
];

const StepContactInfo = ({ data, onChange, onNext, onBack, loading }: Props) => {
  const [showPhone, setShowPhone] = useState(true);

  const hasAtLeastOne = Object.values(data).some((v) => v.trim().length > 0);
  const isValid = !showPhone || hasAtLeastOne;

  const updateField = (key: keyof ContactData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 px-6 pt-10 pb-6 max-w-2xl mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 4</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 leading-tight">
          Στοιχεία επικοινωνίας
        </h1>

        {/* Toggle */}
        <div className="flex items-start gap-4 mb-6 p-4 rounded-xl border border-border bg-muted/20">
          <Switch
            checked={showPhone}
            onCheckedChange={setShowPhone}
            className="mt-0.5 data-[state=checked]:bg-primary"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Ενεργοποίηση εμφάνισης τηλεφωνικού αριθμού
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Ενεργοποιώντας αυτή την επιλογή, ο τηλεφωνικός σας αριθμός θα εμφανίζεται
              δημόσια στην καταχώρησή σας, ώστε οι ενδιαφερόμενοι επισκέπτες να μπορούν
              να επικοινωνήσουν απευθείας μαζί σας.
            </p>
          </div>
        </div>

        {/* Validation alert */}
        {showPhone && !hasAtLeastOne && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 mb-6">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive leading-relaxed">
              Απαιτείται τουλάχιστον 1 πεδίο επικοινωνίας για να συνεχίσετε. Συμπληρώστε
              τηλέφωνο, email ή κάποιο άλλο στοιχείο επαφής.
            </p>
          </div>
        )}

        {/* Input grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{f.label}</span>
                </div>
                <Input
                  placeholder={f.sub}
                  value={data[f.key]}
                  onChange={(e) => updateField(f.key, e.target.value)}
                  className="rounded-xl"
                />
              </div>
            );
          })}
        </div>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextLabel="Δημοσιεύστε"
        nextDisabled={!isValid}
        loading={loading}
        progress={96}
      />
    </div>
  );
};

export default StepContactInfo;
