import { useState } from "react";
import { X, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: () => void;
}

type Mode = "options" | "email-login" | "email-signup";

const AuthModal = ({ open, onOpenChange, onAuthSuccess }: Props) => {
  const [mode, setMode] = useState<Mode>("options");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: "google" | "apple" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/host/onboarding` },
    });
    if (error) {
      toast({ title: "Σφάλμα", description: error.message, variant: "destructive" });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === "email-signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onAuthSuccess();
    } catch (error: any) {
      toast({ title: "Σφάλμα", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const socialButtons = [
    {
      label: "Συνέχεια με Google",
      provider: "google" as const,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      ),
    },
    {
      label: "Συνέχεια με Apple",
      provider: "apple" as const,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
      ),
    },
    {
      label: "Συνέχεια με Facebook",
      provider: "facebook" as const,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
        </svg>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border text-center">
          <DialogTitle className="text-base font-semibold">
            Σύνδεση ή εγγραφή
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-5">
          {mode === "options" ? (
            <>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Καλώς ήρθατε στη VOCA
                </h2>
                <p className="text-sm text-muted-foreground">
                  Συνδεθείτε ή δημιουργήστε λογαριασμό για να συνεχίσετε
                </p>
              </div>

              <div className="space-y-3">
                {socialButtons.map((btn) => (
                  <button
                    key={btn.provider}
                    onClick={() => handleSocialLogin(btn.provider)}
                    className="w-full flex items-center gap-3 h-12 px-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                  >
                    {btn.icon}
                    <span className="flex-1 text-left">{btn.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">ή</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setMode("email-login")}
                  className="w-full flex items-center gap-3 h-12 px-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                >
                  <Mail className="w-5 h-5" />
                  <span className="flex-1 text-left">Συνέχεια με email</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 h-12 px-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                >
                  <Phone className="w-5 h-5" />
                  <span className="flex-1 text-left">Συνέχεια με τηλέφωνο</span>
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <button
                type="button"
                onClick={() => setMode("options")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Πίσω
              </button>
              <h2 className="text-xl font-semibold text-foreground">
                {mode === "email-signup" ? "Δημιουργία λογαριασμού" : "Σύνδεση με email"}
              </h2>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-12 rounded-lg"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Κωδικός</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-12 rounded-lg bg-[hsl(var(--primary))] text-white font-semibold text-sm transition-colors disabled:opacity-40"
              >
                {loading ? "Φόρτωση..." : mode === "email-signup" ? "Εγγραφή" : "Σύνδεση"}
              </button>
              <p className="text-center text-sm text-muted-foreground">
                {mode === "email-login" ? (
                  <>
                    Δεν έχετε λογαριασμό;{" "}
                    <button type="button" onClick={() => setMode("email-signup")} className="font-semibold text-foreground">
                      Εγγραφείτε
                    </button>
                  </>
                ) : (
                  <>
                    Έχετε ήδη λογαριασμό;{" "}
                    <button type="button" onClick={() => setMode("email-login")} className="font-semibold text-foreground">
                      Συνδεθείτε
                    </button>
                  </>
                )}
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
