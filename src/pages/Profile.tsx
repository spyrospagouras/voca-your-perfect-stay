import { Bell, Settings, HelpCircle, User, Shield, Users, UserPlus, Gift, BookOpen, LogOut, ChevronRight, Check, ArrowLeftRight, Briefcase, Contact } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const settingsItems = [
  { icon: Settings, label: "Ρυθμίσεις λογαριασμού" },
  { icon: HelpCircle, label: "Βρείτε βοήθεια" },
  { icon: User, label: "Προβολή προφίλ" },
  { icon: Shield, label: "Απόρρητο" },
  { icon: Users, label: "Συστήστε έναν οικοδεσπότη" },
  { icon: UserPlus, label: "Βρείτε έναν συνοικοδεσπότη" },
  { icon: Gift, label: "Δωροκάρτες" },
  { icon: BookOpen, label: "Νομικό τμήμα" },
];

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success("Αποσυνδεθήκατε");
    navigate("/");
  };

  // Not logged in – show login prompt
  if (!user) {
    return (
      <div className="px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Προφίλ</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Συνδεθείτε</h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Συνδεθείτε για να διαχειριστείτε τα ταξίδια, τα αγαπημένα σας και πολλά άλλα.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm"
          >
            Σύνδεση
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            Δεν έχετε λογαριασμό;{" "}
            <button onClick={() => navigate("/signup")} className="text-primary font-semibold">
              Εγγραφή
            </button>
          </p>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Χρήστης";
  const initials = displayName.charAt(0).toUpperCase();
  const roleLabel = profile?.role === "host" ? "Οικοδεσπότης" : "Επισκέπτης";

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Προφίλ</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
          <Bell className="w-6 h-6 text-foreground" />
        </button>
      </div>
      
      {/* Profile Card */}
      <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 flex flex-col items-center">
        <div className="relative mb-4">
          <Avatar className="w-24 h-24 border-4 border-background shadow-md">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback className="text-2xl font-semibold bg-muted">{initials}</AvatarFallback>
          </Avatar>
          {profile?.is_verified && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
              <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">{displayName}</h2>
        <p className="text-sm text-muted-foreground">{roleLabel}</p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="relative bg-card rounded-2xl p-4 shadow-sm border border-border">
          <Badge className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] px-2 py-0.5 hover:bg-blue-500">
            ΝΕΑ
          </Badge>
          <div className="mb-3 h-16 flex items-center justify-center">
            <Briefcase className="w-12 h-12 text-primary opacity-80" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Προηγούμενα ταξίδια</h3>
        </div>
        <div className="relative bg-card rounded-2xl p-4 shadow-sm border border-border">
          <Badge className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] px-2 py-0.5 hover:bg-blue-500">
            ΝΕΑ
          </Badge>
          <div className="mb-3 h-16 flex items-center justify-center">
            <Contact className="w-12 h-12 text-primary opacity-80" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Επαφές</h3>
        </div>
      </div>

      {/* Host Promotion Banner */}
      <div className="bg-gradient-to-r from-secondary to-muted rounded-2xl p-5 mb-6 flex items-center gap-4 border border-border">
        <div className="flex-1">
          <h3 className="text-base font-bold text-foreground mb-1">Γίνετε οικοδεσπότης</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Νοικιάστε το σπίτι σας και κερδίστε επιπλέον έσοδα
          </p>
        </div>
        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-muted transition-colors ${
                index !== settingsItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left text-foreground font-medium text-sm">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 px-4 py-4 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium text-sm">Αποσύνδεση</span>
      </button>

      {/* Floating Host Mode Toggle */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={() => window.location.href = '/host'}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-3 rounded-full shadow-lg hover:bg-foreground/90 transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span className="text-sm font-medium">Λειτουργία φιλοξενίας</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
