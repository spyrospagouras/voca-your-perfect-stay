import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, ChevronDown, ArrowLeft, Mail, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const COUNTRY_CODES = [
  { code: "+30", country: "GR", flag: "🇬🇷" },
  { code: "+357", country: "CY", flag: "🇨🇾" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+90", country: "TR", flag: "🇹🇷" },
  { code: "+355", country: "AL", flag: "🇦🇱" },
  { code: "+359", country: "BG", flag: "🇧🇬" },
];

type Step = "options" | "email" | "phone" | "otp";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("options");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fullPhone = `${countryCode.code}${phoneNumber.replace(/\s/g, "")}`;

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) toast.error(error.message);
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      toast.error("Συμπληρώστε email και κωδικό");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Καλώς ήρθατε!");
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.user.id)
          .maybeSingle();
        if (!profile?.full_name) {
          navigate("/host/onboarding");
        } else {
          navigate("/");
        }
      }
    }
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length < 8) {
      toast.error("Εισάγετε έγκυρο αριθμό τηλεφώνου");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Ο κωδικός στάλθηκε στο κινητό σας");
      setStep("otp");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) {
      toast.error("Λάθος κωδικός. Δοκιμάστε ξανά.");
    } else {
      toast.success("Καλώς ήρθατε!");
      // Check if new user (no full_name in profile)
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.user.id)
          .maybeSingle();
        if (!profile?.full_name) {
          navigate("/host/onboarding");
        } else {
          navigate("/");
        }
      }
    }
  };

  // OPTIONS screen
  if (step === "options") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="px-6 pt-14 pb-6">
          <h1 className="text-3xl font-bold text-primary tracking-tight">VOCA</h1>
        </div>

        <div className="flex-1 px-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">Σύνδεση ή εγγραφή</h2>
          <p className="text-muted-foreground text-sm mb-10">
            Καλώς ήρθατε! Επιλέξτε πώς θέλετε να συνεχίσετε.
          </p>

          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => handleOAuthLogin("google")}
              className="w-full flex items-center gap-3 h-14 px-5 rounded-2xl border border-border bg-card hover:bg-muted/60 transition-colors text-sm font-medium text-foreground"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
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
              className="w-full flex items-center gap-3 h-14 px-5 rounded-2xl border border-border bg-card hover:bg-muted/60 transition-colors text-sm font-medium text-foreground"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0 fill-foreground">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="flex-1 text-left">Συνέχεια μέσω Apple</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">ή</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Phone */}
            <button
              onClick={() => setStep("phone")}
              className="w-full flex items-center gap-3 h-14 px-5 rounded-2xl border border-border bg-card hover:bg-muted/60 transition-colors text-sm font-medium text-foreground"
            >
              <Phone className="w-5 h-5 shrink-0 text-foreground" />
              <span className="flex-1 text-left">Συνέχεια μέσω κινητού</span>
            </button>

            {/* Email */}
            <button
              onClick={() => setStep("email")}
              className="w-full flex items-center gap-3 h-14 px-5 rounded-2xl border border-border bg-card hover:bg-muted/60 transition-colors text-sm font-medium text-foreground"
            >
              <Mail className="w-5 h-5 shrink-0 text-foreground" />
              <span className="flex-1 text-left">Συνέχεια μέσω email</span>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Δεν έχετε λογαριασμό;{" "}
            <Link to="/signup" className="text-primary font-semibold">Εγγραφή</Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed px-4">
            Συνεχίζοντας, αποδέχεστε τους{" "}
            <a href="/terms" className="underline text-foreground">Όρους Χρήσης</a>{" "}
            και την{" "}
            <a href="/terms" className="underline text-foreground">Πολιτική Απορρήτου</a>.
          </p>
        </div>
      </div>
    );
  }

  // EMAIL LOGIN screen
  if (step === "email") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="px-4 pt-4">
          <button
            onClick={() => setStep("options")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="flex-1 px-6 pt-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">Σύνδεση μέσω email</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Εισάγετε το email και τον κωδικό σας.
          </p>

          <div className="space-y-4 mb-6">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-xl text-base"
              autoFocus
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Κωδικός"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-xl text-base pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleEmailLogin}
            disabled={loading || !email.trim() || !password}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base transition-colors disabled:opacity-40"
          >
            {loading ? "Σύνδεση..." : "Σύνδεση"}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Δεν έχετε λογαριασμό;{" "}
            <Link to="/signup" className="text-primary font-semibold">Εγγραφή</Link>
          </p>
        </div>
      </div>
    );
  }

  // PHONE INPUT screen
  if (step === "phone") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="px-4 pt-4">
          <button
            onClick={() => setStep("options")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="flex-1 px-6 pt-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">Εισάγετε τον αριθμό σας</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Θα σας στείλουμε έναν κωδικό επαλήθευσης μέσω SMS.
          </p>

          {/* Country code + phone */}
          <div className="flex gap-2 mb-6">
            <div className="relative">
              <button
                onClick={() => setShowCountryPicker(!showCountryPicker)}
                className="h-14 px-3 rounded-xl border border-border bg-card flex items-center gap-1.5 min-w-[100px] text-sm font-medium text-foreground"
              >
                <span className="text-lg">{countryCode.flag}</span>
                <span>{countryCode.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {showCountryPicker && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-card border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {COUNTRY_CODES.map((cc) => (
                    <button
                      key={cc.code + cc.country}
                      onClick={() => {
                        setCountryCode(cc);
                        setShowCountryPicker(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors ${
                        cc.code === countryCode.code ? "bg-muted font-semibold" : ""
                      }`}
                    >
                      <span className="text-lg">{cc.flag}</span>
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
              className="h-14 flex-1 rounded-xl text-base"
              autoFocus
            />
          </div>

          <button
            onClick={handleSendOtp}
            disabled={loading || phoneNumber.length < 8}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base transition-colors disabled:opacity-40"
          >
            {loading ? "Αποστολή..." : "Αποστολή κωδικού"}
          </button>
        </div>
      </div>
    );
  }

  // OTP VERIFICATION screen
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button
          onClick={() => { setStep("phone"); setOtp(""); }}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">Επαλήθευση</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Εισάγετε τον 6ψήφιο κωδικό που στάλθηκε στο{" "}
          <span className="font-medium text-foreground">{fullPhone}</span>
        </p>

        <div className="flex justify-center mb-8">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-14 text-xl rounded-xl border-border" />
              <InputOTPSlot index={1} className="w-12 h-14 text-xl rounded-xl border-border" />
              <InputOTPSlot index={2} className="w-12 h-14 text-xl rounded-xl border-border" />
              <InputOTPSlot index={3} className="w-12 h-14 text-xl rounded-xl border-border" />
              <InputOTPSlot index={4} className="w-12 h-14 text-xl rounded-xl border-border" />
              <InputOTPSlot index={5} className="w-12 h-14 text-xl rounded-xl border-border" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={loading || otp.length !== 6}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base transition-colors disabled:opacity-40"
        >
          {loading ? "Επαλήθευση..." : "Επιβεβαίωση"}
        </button>

        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="w-full mt-4 text-sm text-primary font-semibold py-2"
        >
          Δεν λάβατε κωδικό; Αποστολή ξανά
        </button>
      </div>
    </div>
  );
};

export default Login;
