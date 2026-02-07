import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check, X } from "lucide-react";
import OnboardingHeader from "./OnboardingHeader";
import type { OnboardingData } from "@/pages/host/PartnerOnboarding";

interface Props {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onSignUp: () => Promise<void>;
  onBack: () => void;
}

const StepPassword = ({ data, onUpdate, onSignUp, onBack }: Props) => {
  const [password, setPassword] = useState(data.password);
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const rules = [
    { label: "Τουλάχιστον 10 χαρακτήρες", valid: password.length >= 10 },
    { label: "Ένα κεφαλαίο γράμμα", valid: /[A-Z]/.test(password) },
    { label: "Ένα πεζό γράμμα", valid: /[a-z]/.test(password) },
    { label: "Ένας αριθμός", valid: /[0-9]/.test(password) },
  ];

  const allValid = rules.every((r) => r.valid);
  const passwordsMatch = password === confirm && confirm.length > 0;
  const canSubmit = allValid && passwordsMatch && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    onUpdate({ password });
    await onSignUp();
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <OnboardingHeader onBack={onBack} title="Κωδικός πρόσβασης" />

      <div className="flex-1 px-6 pt-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Δημιουργήστε τον κωδικό σας
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Κωδικός πρόσβασης
            </label>
            <div className="relative">
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl pr-12"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Επιβεβαίωση κωδικού
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-12 rounded-xl pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Validation rules */}
          <div className="space-y-2 pt-1">
            {rules.map((rule) => (
              <div key={rule.label} className="flex items-center gap-2 text-sm">
                {rule.valid ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={rule.valid ? "text-foreground" : "text-muted-foreground"}>
                  {rule.label}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm">
              {passwordsMatch ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={passwordsMatch ? "text-foreground" : "text-muted-foreground"}>
                Οι κωδικοί ταιριάζουν
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40"
            style={{
              backgroundColor: `hsl(217, 91%, 60%)`,
              color: "white",
            }}
          >
            {loading ? "Δημιουργία..." : "Δημιουργία λογαριασμού"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StepPassword;
