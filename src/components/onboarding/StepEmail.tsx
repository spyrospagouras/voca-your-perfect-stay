import { useState } from "react";
import { Input } from "@/components/ui/input";
import OnboardingHeader from "./OnboardingHeader";
import type { OnboardingData } from "@/pages/host/PartnerOnboarding";

interface Props {
  email: string;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepEmail = ({ email, onUpdate, onNext, onBack }: Props) => {
  const [value, setValue] = useState(email);
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onUpdate({ email: value });
    onNext();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <OnboardingHeader onBack={onBack} />

      <div className="flex-1 px-6 pt-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Δημιουργήστε λογαριασμό συνεργάτη
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Εισάγετε το email σας για να ξεκινήσετε
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Διεύθυνση email
            </label>
            <Input
              type="email"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="name@example.com"
              className="h-12 rounded-xl"
              autoFocus
            />
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

        <p className="text-center text-sm text-muted-foreground mt-6">
          Έχετε ήδη λογαριασμό;{" "}
          <a href="/login" className="font-semibold" style={{ color: `hsl(217, 91%, 60%)` }}>
            Συνδεθείτε
          </a>
        </p>
      </div>
    </div>
  );
};

export default StepEmail;
