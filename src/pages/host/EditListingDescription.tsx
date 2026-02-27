import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";
import { supabase } from "@/integrations/supabase/client";

const MAX_CHARS = 500;

const EditListingDescription = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("description")
        .eq("id", id)
        .single();
      if (data) setDescription(data.description || "");
      setLoading(false);
    })();
  }, [id]);

  const handleChange = (val: string) => {
    if (val.length <= MAX_CHARS) setDescription(val);
  };

  const handleBack = () => navigate(`/host/edit/${id}/title`);

  const handleNext = async () => {
    if (!id) return;
    setSaving(true);
    await supabase
      .from("listings")
      .update({ description: description.trim() } as any)
      .eq("id", id);
    setSaving(false);
    navigate(`/host/edit/${id}/amenities`);
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
        <button className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors">
          <MessageCircleQuestion className="w-4 h-4" />
          Ερωτήσεις;
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 2</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Δημιουργήστε την περιγραφή σας
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Μοιραστείτε τι κάνει τον χώρο σας ξεχωριστό.
        </p>

        <Textarea
          value={description}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Περιγράψτε την ατμόσφαιρα, τη γειτονιά, τι θα βρουν οι επισκέπτες…"
          className="text-base resize-none min-h-[180px] rounded-xl border-border focus-visible:ring-foreground"
          maxLength={MAX_CHARS}
        />
        <p className="text-xs text-muted-foreground text-right mt-2">
          {description.length}/{MAX_CHARS}
        </p>
      </div>

      <OnboardingFooter
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={saving}
        loading={saving}
        progress={95}
      />
    </div>
  );
};

export default EditListingDescription;
