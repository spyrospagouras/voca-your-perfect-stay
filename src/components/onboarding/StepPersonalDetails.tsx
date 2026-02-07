import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OnboardingHeader from "./OnboardingHeader";
import type { OnboardingData } from "@/pages/host/PartnerOnboarding";

interface Props {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const countryCodes = [
  { code: "+30", label: "🇬🇷 +30" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+39", label: "🇮🇹 +39" },
  { code: "+34", label: "🇪🇸 +34" },
  { code: "+90", label: "🇹🇷 +90" },
  { code: "+357", label: "🇨🇾 +357" },
];

const StepPersonalDetails = ({ data, onUpdate, onNext, onBack }: Props) => {
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [phone, setPhone] = useState(data.phone);
  const [countryCode, setCountryCode] = useState(data.countryCode);

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0 && phone.trim().length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onUpdate({ firstName, lastName, phone, countryCode });
    onNext();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <OnboardingHeader onBack={onBack} title="Στοιχεία" />

      <div className="flex-1 px-6 pt-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Συμπληρώστε τα στοιχεία σας
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Όνομα</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="π.χ. Μαρία"
              className="h-12 rounded-xl"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Επίθετο</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="π.χ. Παπαδοπούλου"
              className="h-12 rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Αριθμός τηλεφώνου</label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-28 h-12 rounded-xl shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="697 123 4567"
                className="h-12 rounded-xl flex-1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full h-12 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40"
            style={{
              backgroundColor: `hsl(217, 91%, 60%)`,
              color: "white",
            }}
          >
            Συνεχίστε
          </button>
        </form>
      </div>
    </div>
  );
};

export default StepPersonalDetails;
