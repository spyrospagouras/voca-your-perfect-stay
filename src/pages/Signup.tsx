import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      toast.error("Συμπληρώστε όλα τα πεδία");
      return;
    }
    if (password.length < 6) {
      toast.error("Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Ο λογαριασμός δημιουργήθηκε! Ελέγξτε το email σας για επιβεβαίωση.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <h1 className="text-3xl font-bold text-primary tracking-tight">VOCA</h1>
      </div>

      <div className="flex-1 px-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Εγγραφή</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Δημιουργήστε τον λογαριασμό σας για να ξεκινήσετε.
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ονοματεπώνυμο</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="π.χ. Παναγιώτης Κ."
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Κωδικός</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Τουλάχιστον 6 χαρακτήρες"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
            {loading ? "Εγγραφή..." : "Δημιουργία λογαριασμού"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Έχετε ήδη λογαριασμό;{" "}
          <Link to="/login" className="text-primary font-semibold">
            Σύνδεση
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
