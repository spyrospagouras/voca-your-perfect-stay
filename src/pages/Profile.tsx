import { User, Settings, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const menuItems = [
  { icon: User, label: "Προσωπικά στοιχεία" },
  { icon: Settings, label: "Ρυθμίσεις" },
  { icon: HelpCircle, label: "Βοήθεια" },
];

const Profile = () => {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Προφίλ</h1>
      
      {/* Profile Card */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-divider mb-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">Επισκέπτης</h2>
          <p className="text-sm text-muted-foreground">Σύνδεση ή εγγραφή</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted rounded-xl transition-colors"
            >
              <Icon className="w-6 h-6 text-foreground" />
              <span className="flex-1 text-left text-foreground font-medium">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="mt-8 pt-6 border-t border-divider">
        <button className="flex items-center gap-4 p-4 text-destructive hover:bg-muted rounded-xl transition-colors w-full">
          <LogOut className="w-6 h-6" />
          <span className="font-medium">Αποσύνδεση</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
