import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, ChevronDown, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: () => void;
}

const COUNTRY_CODES = [
  { code: "+30", country: "GR", flag: "🇬🇷" },
  { code: "+357", country: "CY", flag: "🇨🇾" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+1", country: "US", flag: "🇺🇸" },
];

type Mode = "options" | "phone" | "otp" | "email" | "email-sent";

const AuthModal = ({ open, onOpenChange, onAuthSuccess }: Props) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("options");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fullPhone = `${countryCode.code}${phoneNumber.replace(/\s/g, "")}`;

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/host/onboarding` },
    });
    if (error) {
      toast({ title: "Σφάλμα", description: error.message, variant: "destructive" });
    }
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length < 8) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      toast({ title: "Σφάλμα", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Κωδικός στάλθηκε", description: `Στο ${fullPhone}` });
      setMode("otp");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
    setLoading(false);
    if (error) {
      toast({ title: "Σφάλμα", description: "Λάθος κωδικός", variant: "destructive" });
    } else {
      onAuthSuccess();
    }
  };

  const handleEmailMagicLink = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/host/onboarding` },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Σφάλμα", description: error.message, variant: "destructive" });
    } else {
      setMode("email-sent");
    }
  };

  const resetState = () => {
    setMode("options");
    setPhoneNumber("");
    setOtp("");
    setEmail("");
    setShowCountryPicker(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetState(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border text-center">
          <DialogTitle className="text-base font-semibold">
            {mode === "otp" ? "Επαλήθευση" : "Σύνδεση ή εγγραφή"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-5">
          {mode === "options" && (
            <>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">Καλώς ήρθατε στη VOCA</h2>
                <p className="text-sm text-muted-foreground">Επιλέξτε πώς θέλετε να συνεχίσετε</p>
              </div>

              <div className="space-y-3">
                {/* Google */}
                <button
                  onClick={() => handleOAuthLogin("google")}
                  className="w-full flex items-center gap-3 h-12 px-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="flex-1 text-left">Συνέχεια μέσω Google</span>
                </button>

                {/* Apple */}
                <button
                  onClick={() => handleOAuthLogin("apple")}
                  className="w-full flex items-center gap-3 h-12 px-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="flex-1 text-left">Συνέχεια μέσω Apple</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">ή</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Phone */}
                <button
                  onClick={() => setMode("phone")}
                  className="w-full flex items-center gap-3 h-12 px-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                >
                  <Phone className="w-5 h-5" />
                  <span className="flex-1 text-left">Συνέχεια μέσω κινητού</span>
                </button>
              </div>
            </>
          )}

          {mode === "phone" && (
            <div className="space-y-4">
              <button onClick={() => setMode("options")} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Πίσω
              </button>
              <h2 className="text-xl font-semibold text-foreground">Εισάγετε τον αριθμό σας</h2>
              <p className="text-sm text-muted-foreground">Θα σας στείλουμε κωδικό επαλήθευσης μέσω SMS.</p>

              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowCountryPicker(!showCountryPicker)}
                    className="h-12 px-3 rounded-lg border border-border bg-card flex items-center gap-1 min-w-[90px] text-sm font-medium text-foreground"
                  >
                    <span>{countryCode.flag}</span>
                    <span>{countryCode.code}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                  {showCountryPicker && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {COUNTRY_CODES.map((cc) => (
                        <button
                          key={cc.code + cc.country}
                          onClick={() => { setCountryCode(cc); setShowCountryPicker(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                        >
                          <span>{cc.flag}</span>
                          <span className="text-foreground">{cc.country}</span>
                          <span className="text-muted-foreground ml-auto">{cc.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Input
                  type="tel"
                  placeholder="69x xxx xxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12 flex-1 rounded-lg"
                  autoFocus
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || phoneNumber.length < 8}
                className="w-full h-12 rounded-lg bg-[hsl(var(--primary))] text-white font-semibold text-sm transition-colors disabled:opacity-40"
              >
                {loading ? "Αποστολή..." : "Αποστολή κωδικού"}
              </button>
            </div>
          )}

          {mode === "otp" && (
            <div className="space-y-4">
              <button onClick={() => { setMode("phone"); setOtp(""); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Πίσω
              </button>
              <h2 className="text-xl font-semibold text-foreground">Επαλήθευση</h2>
              <p className="text-sm text-muted-foreground">
                Εισάγετε τον 6ψήφιο κωδικό που στάλθηκε στο{" "}
                <span className="font-medium text-foreground">{fullPhone}</span>
              </p>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-11 h-12 text-lg rounded-lg border-border" />
                    <InputOTPSlot index={1} className="w-11 h-12 text-lg rounded-lg border-border" />
                    <InputOTPSlot index={2} className="w-11 h-12 text-lg rounded-lg border-border" />
                    <InputOTPSlot index={3} className="w-11 h-12 text-lg rounded-lg border-border" />
                    <InputOTPSlot index={4} className="w-11 h-12 text-lg rounded-lg border-border" />
                    <InputOTPSlot index={5} className="w-11 h-12 text-lg rounded-lg border-border" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full h-12 rounded-lg bg-[hsl(var(--primary))] text-white font-semibold text-sm transition-colors disabled:opacity-40"
              >
                {loading ? "Επαλήθευση..." : "Επιβεβαίωση"}
              </button>

              <button onClick={handleSendOtp} disabled={loading} className="w-full text-sm text-primary font-semibold py-1">
                Δεν λάβατε κωδικό; Αποστολή ξανά
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
