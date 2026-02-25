import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";
import { supabase } from "@/integrations/supabase/client";

const MAX_CHARS = 50;

const EditListingTitle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("title")
        .eq("id", id)
        .single();
      if (data) setTitle(data.title || "");
      setLoading(false);
    })();
  }, [id]);

  const handleChange = (val: string) => {
    if (val.length <= MAX_CHARS) setTitle(val);
  };

  const handleBack = () => navigate(`/host/edit/${id}`);

  const handleNext = async () => {
    if (!id) return;
    setSaving(true);
    await supabase
      .from("listings")
      .update({ title: title.trim() } as any)
      .eq("id", id);
    setSaving(false);
    // Navigate to next step (highlights or next edit page)
    navigate("/host/listings");
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
          Τώρα, δώστε στον χώρο σας έναν τίτλο
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Ένας σύντομος τίτλος κάνει τη μεγαλύτερη εντύπωση. Μην ανησυχείτε, μπορείτε πάντα να τον αλλάξετε.
        </p>

        <Textarea
          value={title}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="π.χ. Φωτεινό διαμέρισμα στο κέντρο"
          className="text-lg font-medium resize-none min-h-[120px] rounded-xl border-border focus-visible:ring-foreground"
          maxLength={MAX_CHARS}
        />
        <p className="text-xs text-muted-foreground text-right mt-2">
          {title.length}/{MAX_CHARS}
        </p>
      </div>

      <OnboardingFooter
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={saving}
        loading={saving}
        progress={90}
      />
    </div>
  );
};

export default EditListingTitle;
