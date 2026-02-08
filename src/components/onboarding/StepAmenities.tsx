import { useState } from "react";
import {
  Wifi,
  Tv,
  UtensilsCrossed,
  WashingMachine,
  Car,
  AirVent,
  Flame,
  Briefcase,
  Waves,
  Mountain,
  TreePine,
  Dumbbell,
  Wine,
  Music,
  Gamepad2,
  ShieldCheck,
  BellRing,
  FireExtinguisher,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  selected: string[];
  onSelect: (amenities: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Amenity {
  id: string;
  label: string;
  icon: LucideIcon;
}

const categories: { title: string; items: Amenity[] }[] = [
  {
    title: "Αγαπημένες παροχές",
    items: [
      { id: "wifi", label: "Wi-Fi", icon: Wifi },
      { id: "tv", label: "Τηλεόραση", icon: Tv },
      { id: "kitchen", label: "Κουζίνα", icon: UtensilsCrossed },
      { id: "washer", label: "Πλυντήριο", icon: WashingMachine },
      { id: "parking", label: "Πάρκινγκ", icon: Car },
      { id: "ac", label: "Κλιματισμός", icon: AirVent },
      { id: "heating", label: "Θέρμανση", icon: Flame },
      { id: "workspace", label: "Χώρος εργασίας", icon: Briefcase },
    ],
  },
  {
    title: "Ξεχωριστές παροχές",
    items: [
      { id: "pool", label: "Πισίνα", icon: Waves },
      { id: "mountain_view", label: "Θέα βουνό", icon: Mountain },
      { id: "garden", label: "Κήπος", icon: TreePine },
      { id: "gym", label: "Γυμναστήριο", icon: Dumbbell },
      { id: "wine", label: "Κάβα κρασιών", icon: Wine },
      { id: "music", label: "Μουσική", icon: Music },
      { id: "games", label: "Παιχνίδια", icon: Gamepad2 },
    ],
  },
  {
    title: "Εξαρτήματα ασφαλείας",
    items: [
      { id: "smoke_alarm", label: "Ανιχνευτής καπνού", icon: ShieldCheck },
      { id: "carbon_alarm", label: "Ανιχνευτής CO", icon: BellRing },
      { id: "fire_extinguisher", label: "Πυροσβεστήρας", icon: FireExtinguisher },
      { id: "first_aid", label: "Πρώτες βοήθειες", icon: HeartPulse },
    ],
  },
];

const StepAmenities = ({ selected, onSelect, onNext, onBack }: Props) => {
  const toggle = (id: string) => {
    onSelect(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 6</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Πείτε στους επισκέπτες τι διαθέτει ο χώρος σας
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Μπορείτε να προσθέσετε περισσότερες παροχές αφού δημοσιεύσετε.
        </p>

        {categories.map((cat) => (
          <div key={cat.title} className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {cat.title}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {cat.items.map((item) => {
                const Icon = item.icon;
                const isSelected = selected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-4 transition-all text-center ${
                      isSelected
                        ? "border-foreground bg-accent/40"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <Icon className="w-6 h-6 text-foreground" />
                    <span className="text-xs text-foreground leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <OnboardingFooter onBack={onBack} onNext={onNext} progress={78} />
    </div>
  );
};

export default StepAmenities;
