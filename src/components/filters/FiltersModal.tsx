import { useState, useMemo, useCallback } from "react";
import { X, Minus, Plus, Waves, Wifi, UtensilsCrossed, WashingMachine, AirVent, Flame, Dumbbell, Waves as Pool, Star, Sparkles, Zap, DoorOpen, PawPrint, Home, Building2, Hotel, Warehouse, ChevronDown, ChevronUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export interface SearchFilters {
  spaceType: "any" | "room" | "entire";
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  instantBook: boolean;
  selfCheckIn: boolean;
  freeCancellation: boolean;
  petsAllowed: boolean;
  standout: string[];
  propertyTypes: string[];
  accessibility: string[];
  hostLanguages: string[];
}

const DEFAULT_FILTERS: SearchFilters = {
  spaceType: "any",
  priceMin: 10,
  priceMax: 500,
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  amenities: [],
  instantBook: false,
  selfCheckIn: false,
  freeCancellation: false,
  petsAllowed: false,
  standout: [],
  propertyTypes: [],
  accessibility: [],
  hostLanguages: [],
};

const AMENITY_FILTERS = [
  { id: "wifi", label: "Wifi", icon: Wifi },
  { id: "kitchen", label: "Κουζίνα", icon: UtensilsCrossed },
  { id: "washer", label: "Πλυντήριο", icon: WashingMachine },
  { id: "ac", label: "Κλιματισμός", icon: AirVent },
  { id: "heating", label: "Θέρμανση", icon: Flame },
  { id: "pool", label: "Πισίνα", icon: Pool },
  { id: "jacuzzi", label: "Τζακούζι", icon: Waves },
  { id: "gym", label: "Γυμναστήριο", icon: Dumbbell },
];

const MORE_AMENITIES = [
  { id: "tv", label: "Τηλεόραση" },
  { id: "workspace", label: "Χώρος εργασίας" },
  { id: "free_property_parking", label: "Δωρεάν πάρκινγκ" },
  { id: "bbq", label: "Ψησταριά" },
  { id: "balcony", label: "Μπαλκόνι" },
  { id: "garden", label: "Κήπος" },
  { id: "mountain_view", label: "Θέα βουνό" },
  { id: "elevator", label: "Ασανσέρ" },
  { id: "indoor_fireplace", label: "Τζάκι" },
  { id: "dishwasher", label: "Πλυντήριο πιάτων" },
];

const PROPERTY_TYPES = [
  { id: "house", label: "Σπίτι", icon: Home },
  { id: "apartment", label: "Διαμέρισμα", icon: Building2 },
  { id: "guesthouse", label: "Ξενώνας", icon: Warehouse },
  { id: "hotel", label: "Ξενοδοχείο", icon: Hotel },
];

const ACCESSIBILITY_ENTRANCE = [
  "Πρόσβαση χωρίς σκαλοπάτια",
  "Είσοδος πλατύτερη από 82 εκ.",
  "Χώρος στάθμευσης για ΑμεΑ",
  "Ισόπεδη πρόσβαση στο κτίριο",
];

const ACCESSIBILITY_BEDROOM = [
  "Υπνοδωμάτιο στο ισόγειο",
  "Κρεβάτι προσβάσιμο σε αναπηρικό αμαξίδιο",
];

const ACCESSIBILITY_BATHROOM = [
  "Μπάνιο στο ισόγειο",
  "Ντουζιέρα χωρίς σκαλοπάτι",
  "Κάθισμα μπάνιου",
  "Μπάρες στήριξης στο ντους",
  "Μπάρες στήριξης στην τουαλέτα",
];

const HOST_LANGUAGES = [
  "Ελληνικά", "Αγγλικά", "Γερμανικά", "Γαλλικά", "Ισπανικά",
  "Ιταλικά", "Πορτογαλικά", "Ρωσικά", "Τουρκικά", "Αραβικά",
  "Κινεζικά", "Ιαπωνικά", "Κορεάτικα", "Ολλανδικά", "Πολωνικά",
  "Σουηδικά", "Νορβηγικά", "Δανικά", "Φινλανδικά", "Τσέχικα",
  "Ουγγρικά", "Ρουμανικά", "Βουλγαρικά", "Κροατικά", "Σερβικά",
  "Αλβανικά", "Εβραϊκά", "Χίντι", "Ταϊλανδικά", "Βιετναμικά",
  "Ινδονησιακά", "Μαλαισιανά", "Φιλιππινικά", "Ουκρανικά",
];

interface FiltersModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
  totalResults: number;
  initialFilters?: SearchFilters;
}

function Counter({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-base text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-6 text-center text-base font-medium text-foreground">
          {value === 0 ? "∞" : value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const FiltersModal = ({ open, onClose, onApply, totalResults, initialFilters }: FiltersModalProps) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || DEFAULT_FILTERS);
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);

  const update = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayItem = useCallback((key: "amenities" | "standout" | "propertyTypes" | "accessibility" | "hostLanguages", item: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item] };
    });
  }, []);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.spaceType !== "any") count++;
    if (filters.priceMin > 10 || filters.priceMax < 500) count++;
    if (filters.bedrooms > 0) count++;
    if (filters.beds > 0) count++;
    if (filters.bathrooms > 0) count++;
    count += filters.amenities.length;
    if (filters.instantBook) count++;
    if (filters.selfCheckIn) count++;
    if (filters.freeCancellation) count++;
    if (filters.petsAllowed) count++;
    count += filters.standout.length;
    count += filters.propertyTypes.length;
    count += filters.accessibility.length;
    count += filters.hostLanguages.length;
    return count;
  }, [filters]);

  const handleClear = () => setFilters(DEFAULT_FILTERS);
  const handleApply = () => { onApply(filters); onClose(); };

  if (!open) return null;

  const displayedLanguages = showMoreLanguages ? HOST_LANGUAGES : HOST_LANGUAGES.slice(0, 8);

  return (
    <div className="fixed inset-0 z-[2000] bg-background flex flex-col">
      {/* Sticky Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
          <X className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-base font-semibold text-foreground">Φίλτρα</h2>
        <div className="w-8" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-0">

          {/* === Τύπος χώρου === */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Τύπος χώρου</h3>
            <div className="flex rounded-xl border border-border overflow-hidden">
              {([["any", "Κάθε τύπος"], ["room", "Δωμάτιο"], ["entire", "Ολόκληρο κατάλυμα"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => update("spaceType", val)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    filters.spaceType === val
                      ? "bg-foreground text-background"
                      : "bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <Separator className="my-6" />

          {/* === Εύρος τιμών === */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-2">Εύρος τιμών</h3>
            <p className="text-sm text-muted-foreground mb-6">Τιμές ανά βράδυ πριν τους φόρους και τα τέλη</p>
            
            {/* Price histogram placeholder + slider */}
            <div className="mb-6">
              <div className="h-16 flex items-end gap-px mb-2">
                {Array.from({ length: 30 }, (_, i) => {
                  const h = Math.random() * 100;
                  const inRange = i >= (filters.priceMin / 500) * 30 && i <= (filters.priceMax / 500) * 30;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm transition-colors ${inRange ? "bg-foreground" : "bg-muted"}`}
                      style={{ height: `${Math.max(4, h)}%` }}
                    />
                  );
                })}
              </div>
              <Slider
                value={[filters.priceMin, filters.priceMax]}
                min={10}
                max={500}
                step={5}
                onValueChange={([min, max]) => {
                  update("priceMin", min);
                  update("priceMax", max);
                }}
                className="mb-4"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Ελάχιστη τιμή</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                  <Input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => update("priceMin", Number(e.target.value) || 0)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="flex items-end pb-2 text-muted-foreground">—</div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Μέγιστη τιμή</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                  <Input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => update("priceMax", Number(e.target.value) || 500)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
          </section>

          <Separator className="my-6" />

          {/* === Δωμάτια και κρεβάτια === */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-2">Δωμάτια και κρεβάτια</h3>
            <Counter label="Υπνοδωμάτια" value={filters.bedrooms} onChange={(v) => update("bedrooms", v)} />
            <Counter label="Κρεβάτια" value={filters.beds} onChange={(v) => update("beds", v)} />
            <Counter label="Μπάνια" value={filters.bathrooms} onChange={(v) => update("bathrooms", v)} />
          </section>

          <Separator className="my-6" />

          {/* === Παροχές === */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Παροχές</h3>
            <div className="grid grid-cols-2 gap-3">
              {AMENITY_FILTERS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => toggleArrayItem("amenities", id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    filters.amenities.includes(id)
                      ? "border-foreground bg-secondary text-foreground"
                      : "border-border text-foreground hover:border-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            {/* More amenities */}
            <button
              onClick={() => setShowMoreAmenities(!showMoreAmenities)}
              className="flex items-center gap-1 mt-4 text-sm font-semibold text-foreground underline underline-offset-2"
            >
              {showMoreAmenities ? "Λιγότερα" : "Περισσότερα"}
              {showMoreAmenities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMoreAmenities && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {MORE_AMENITIES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => toggleArrayItem("amenities", id)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                      filters.amenities.includes(id)
                        ? "border-foreground bg-secondary text-foreground"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </section>

          <Separator className="my-6" />

          {/* === Επιλογές κράτησης === */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Επιλογές κράτησης</h3>
            <div className="space-y-4">
              {([
                ["instantBook", "Άμεση κράτηση", "Κάντε κράτηση χωρίς αναμονή έγκρισης", Zap],
                ["selfCheckIn", "Check-in χωρίς παρουσία οικοδεσπότη", "Κλειδοθήκη ή έξυπνη κλειδαριά", DoorOpen],
                ["freeCancellation", "Δωρεάν ακύρωση", "Ακυρώστε δωρεάν πριν την ημερομηνία", null],
                ["petsAllowed", "Επιτρέπονται κατοικίδια", "Φέρτε τον τετράποδο φίλο σας", PawPrint],
              ] as const).map(([key, title, desc, IconComp]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {IconComp && <IconComp className="w-5 h-5 text-foreground shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={filters[key] as boolean}
                    onCheckedChange={(v) => update(key, v)}
                  />
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-6" />

          {/* === Καταλύματα που ξεχωρίζουν === */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Καταλύματα που ξεχωρίζουν</h3>
            <div className="flex gap-3">
              {[
                { id: "guest_favorite", label: "Επιλογή επισκεπτών", icon: Star },
                { id: "luxury", label: "Πολυτελή", icon: Sparkles },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => toggleArrayItem("standout", id)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-colors ${
                    filters.standout.includes(id)
                      ? "border-foreground bg-secondary text-foreground"
                      : "border-border text-foreground hover:border-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          <Separator className="my-6" />

          {/* === Τύπος ιδιοκτησίας === */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Τύπος ιδιοκτησίας</h3>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => toggleArrayItem("propertyTypes", id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-colors ${
                    filters.propertyTypes.includes(id)
                      ? "border-foreground bg-secondary text-foreground"
                      : "border-border text-foreground hover:border-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          <Separator className="my-6" />

          {/* === Προσβασιμότητα === */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Προσβασιμότητα</h3>

            <p className="text-sm font-medium text-foreground mb-2">Είσοδος επισκεπτών</p>
            <div className="space-y-3 mb-4">
              {ACCESSIBILITY_ENTRANCE.map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={filters.accessibility.includes(item)}
                    onCheckedChange={() => toggleArrayItem("accessibility", item)}
                  />
                  <span className="text-sm text-foreground">{item}</span>
                </label>
              ))}
            </div>

            <p className="text-sm font-medium text-foreground mb-2">Υπνοδωμάτιο</p>
            <div className="space-y-3 mb-4">
              {ACCESSIBILITY_BEDROOM.map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={filters.accessibility.includes(item)}
                    onCheckedChange={() => toggleArrayItem("accessibility", item)}
                  />
                  <span className="text-sm text-foreground">{item}</span>
                </label>
              ))}
            </div>

            <p className="text-sm font-medium text-foreground mb-2">Μπάνιο</p>
            <div className="space-y-3">
              {ACCESSIBILITY_BATHROOM.map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={filters.accessibility.includes(item)}
                    onCheckedChange={() => toggleArrayItem("accessibility", item)}
                  />
                  <span className="text-sm text-foreground">{item}</span>
                </label>
              ))}
            </div>
          </section>

          <Separator className="my-6" />

          {/* === Γλώσσα οικοδεσπότη === */}
          <section className="pb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Γλώσσα οικοδεσπότη</h3>
            <div className="space-y-3">
              {displayedLanguages.map((lang) => (
                <label key={lang} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={filters.hostLanguages.includes(lang)}
                    onCheckedChange={() => toggleArrayItem("hostLanguages", lang)}
                  />
                  <span className="text-sm text-foreground">{lang}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowMoreLanguages(!showMoreLanguages)}
              className="mt-3 text-sm font-semibold text-foreground underline underline-offset-2"
            >
              {showMoreLanguages ? "Λιγότερα" : `Περισσότερα (${HOST_LANGUAGES.length - 8})`}
            </button>
          </section>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="border-t border-border px-6 py-4 flex items-center justify-between shrink-0 bg-background">
        <button
          onClick={handleClear}
          className="text-sm font-semibold text-foreground underline underline-offset-2"
        >
          Εκκαθάριση όλων
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-3 bg-foreground text-background rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Εμφάνιση {totalResults > 1000 ? "1.000+" : totalResults} χώρων
        </button>
      </div>
    </div>
  );
};

export default FiltersModal;
