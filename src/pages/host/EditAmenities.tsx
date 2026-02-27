import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Plus, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";
import { supabase } from "@/integrations/supabase/client";
import { ALL_AMENITIES, AMENITY_CATEGORIES } from "@/data/amenitiesList";

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
          {AMENITY_CATEGORIES.map((cat) => (
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
