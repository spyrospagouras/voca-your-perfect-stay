import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Plus, Check, X,
  Wifi, Tv, UtensilsCrossed, WashingMachine, Car, AirVent, Flame, Briefcase,
  Waves, Mountain, TreePine, Dumbbell, Wine, Music, Gamepad2,
  ShieldCheck, BellRing, FireExtinguisher, HeartPulse,
  Bath, Microwave, Coffee, Refrigerator, Utensils, Bed, Sofa, Fan,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Amenity {
  id: string;
  label: string;
  icon: LucideIcon;
  category: string;
}

const CATEGORIES = [
  "Όλες",
  "Βασικές παροχές",
  "Μπάνιο",
  "Κουζίνα",
  "Υπνοδωμάτιο",
  "Ψυχαγωγία",
  "Θέρμανση & Κλιματισμός",
  "Εξωτερικοί χώροι",
  "Ασφάλεια",
];

const ALL_AMENITIES: Amenity[] = [
  // Βασικές παροχές
  { id: "wifi", label: "Wi-Fi", icon: Wifi, category: "Βασικές παροχές" },
  { id: "tv", label: "Τηλεόραση", icon: Tv, category: "Βασικές παροχές" },
  { id: "parking", label: "Πάρκινγκ", icon: Car, category: "Βασικές παροχές" },
  { id: "workspace", label: "Χώρος εργασίας", icon: Briefcase, category: "Βασικές παροχές" },
  { id: "washer", label: "Πλυντήριο", icon: WashingMachine, category: "Βασικές παροχές" },
  { id: "sofa", label: "Καναπές", icon: Sofa, category: "Βασικές παροχές" },
  // Μπάνιο
  { id: "bath", label: "Μπανιέρα", icon: Bath, category: "Μπάνιο" },
  { id: "hairdryer", label: "Πιστολάκι μαλλιών", icon: Fan, category: "Μπάνιο" },
  // Κουζίνα
  { id: "kitchen", label: "Κουζίνα", icon: UtensilsCrossed, category: "Κουζίνα" },
  { id: "microwave", label: "Φούρνος μικροκυμάτων", icon: Microwave, category: "Κουζίνα" },
  { id: "coffee", label: "Καφετιέρα", icon: Coffee, category: "Κουζίνα" },
  { id: "fridge", label: "Ψυγείο", icon: Refrigerator, category: "Κουζίνα" },
  { id: "mini_fridge", label: "Ψυγειάκι", icon: Refrigerator, category: "Κουζίνα" },
  { id: "utensils", label: "Σκεύη & πιάτα", icon: Utensils, category: "Κουζίνα" },
  // Υπνοδωμάτιο
  { id: "bed_linen", label: "Κλινοσκεπάσματα", icon: Bed, category: "Υπνοδωμάτιο" },
  // Ψυχαγωγία
  { id: "pool", label: "Πισίνα", icon: Waves, category: "Ψυχαγωγία" },
  { id: "gym", label: "Γυμναστήριο", icon: Dumbbell, category: "Ψυχαγωγία" },
  { id: "wine", label: "Κάβα κρασιών", icon: Wine, category: "Ψυχαγωγία" },
  { id: "music", label: "Μουσική", icon: Music, category: "Ψυχαγωγία" },
  { id: "games", label: "Επιτραπέζια παιχνίδια", icon: Gamepad2, category: "Ψυχαγωγία" },
  // Θέρμανση & Κλιματισμός
  { id: "ac", label: "Κλιματισμός", icon: AirVent, category: "Θέρμανση & Κλιματισμός" },
  { id: "heating", label: "Θέρμανση", icon: Flame, category: "Θέρμανση & Κλιματισμός" },
  // Εξωτερικοί χώροι
  { id: "mountain_view", label: "Θέα βουνό", icon: Mountain, category: "Εξωτερικοί χώροι" },
  { id: "garden", label: "Κήπος", icon: TreePine, category: "Εξωτερικοί χώροι" },
  // Ασφάλεια
  { id: "smoke_alarm", label: "Ανιχνευτής καπνού", icon: ShieldCheck, category: "Ασφάλεια" },
  { id: "carbon_alarm", label: "Ανιχνευτής CO", icon: BellRing, category: "Ασφάλεια" },
  { id: "fire_extinguisher", label: "Πυροσβεστήρας", icon: FireExtinguisher, category: "Ασφάλεια" },
  { id: "first_aid", label: "Πρώτες βοήθειες", icon: HeartPulse, category: "Ασφάλεια" },
];

const EditAmenities = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Όλες");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("amenities")
        .eq("id", id)
        .single();
      if (data?.amenities) setSelected(data.amenities);
      setLoading(false);
    })();
  }, [id]);

  const toggle = (amenityId: string) => {
    setSelected((prev) =>
      prev.includes(amenityId)
        ? prev.filter((s) => s !== amenityId)
        : [...prev, amenityId]
    );
  };

  const filtered = useMemo(() => {
    let list = ALL_AMENITIES;
    if (activeCategory !== "Όλες") {
      list = list.filter((a) => a.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.label.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, search]);

  const handleBack = () => navigate(`/host/edit/${id}/description`);

  const handleNext = async () => {
    if (!id) return;
    setSaving(true);
    await supabase
      .from("listings")
      .update({ amenities: selected } as any)
      .eq("id", id);
    setSaving(false);
    navigate(`/host/edit/${id}/intro3`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Φόρτωση…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Πίσω"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground">Προσθέστε παροχές</h1>
        <button
          onClick={() => setShowSearch((p) => !p)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Αναζήτηση"
        >
          {showSearch ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Search className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-border">
          <Input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Αναζήτηση παροχών…"
            className="rounded-full bg-muted border-0 focus-visible:ring-foreground"
          />
        </div>
      )}

      {/* Category chips */}
      <div className="px-4 py-3 border-b border-border overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities list */}
      <div className="flex-1 overflow-y-auto pb-32">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">
            Δεν βρέθηκαν παροχές
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((amenity) => {
              const Icon = amenity.icon;
              const isSelected = selected.includes(amenity.id);
              return (
                <li
                  key={amenity.id}
                  onClick={() => toggle(amenity.id)}
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm text-foreground">{amenity.label}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-foreground text-background"
                        : "border-2 border-border text-muted-foreground"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <OnboardingFooter
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={saving}
        loading={saving}
        progress={96}
      />
    </div>
  );
};

export default EditAmenities;
