import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Συμπληρώστε όλα τα πεδία");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast.error("Λάθος email ή κωδικός");
    } else {
      toast.success("Καλώς ήρθατε!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <h1 className="text-3xl font-bold text-primary tracking-tight">VOCA</h1>
      </div>

      <div className="flex-1 px-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Σύνδεση</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Καλώς ήρθατε! Συνδεθείτε στον λογαριασμό σας.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
            {loading ? "Σύνδεση..." : "Σύνδεση"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Δεν έχετε λογαριασμό;{" "}
          <Link to="/signup" className="text-primary font-semibold">
            Εγγραφή
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
