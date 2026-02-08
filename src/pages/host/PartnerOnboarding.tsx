import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import HostLanding from "@/components/onboarding/HostLanding";
import AuthModal from "@/components/onboarding/AuthModal";
import StepIntro from "@/components/onboarding/StepIntro";
import StepCategory from "@/components/onboarding/StepCategory";
import StepPrivacyType from "@/components/onboarding/StepPrivacyType";
import StepLocation from "@/components/onboarding/StepLocation";

export interface OnboardingData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  password: string;
  propertyType: string;
  propertySubType: string;
}

type Step = "landing" | "intro" | "category" | "privacy" | "location";

const STORAGE_KEY = "voca_onboarding_draft";

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const PartnerOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const draft = loadDraft();

  const [step, setStep] = useState<Step>(draft?.step && user ? draft.step : "landing");
  const [showAuth, setShowAuth] = useState(false);

  // Listing data (restore from draft)
  const [category, setCategory] = useState(draft?.category || "");
  const [privacyType, setPrivacyType] = useState(draft?.privacyType || "");
  const [address, setAddress] = useState(draft?.address || "");
  const [lat, setLat] = useState(draft?.lat ?? 37.9838);
  const [lng, setLng] = useState(draft?.lng ?? 23.7275);

  // Persist draft on every change
  useEffect(() => {
    if (step !== "landing") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, category, privacyType, address, lat, lng }));
    }
  }, [step, category, privacyType, address, lat, lng]);

  const handleStart = () => {
    if (user) {
      setStep("intro");
    } else {
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setStep("intro");
  };

  const handleFinish = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("No user");

      // Update profile to host
      await supabase
        .from("profiles")
        .update({ role: "host" })
        .eq("id", currentUser.id);

      // Create listing
      await supabase.from("listings").insert({
        host_id: currentUser.id,
        title: `Νέα καταχώρηση`,
        property_type: category,
        privacy_type: privacyType,
        location_name: address,
        latitude: lat,
        longitude: lng,
      });

      // Clear draft
      localStorage.removeItem(STORAGE_KEY);

      toast({ title: "Επιτυχία!", description: "Η καταχώρησή σας δημιουργήθηκε." });
      navigate("/host/listings");
    } catch (error: any) {
      toast({ title: "Σφάλμα", description: error.message, variant: "destructive" });
    }
  };

  const handleBack = () => {
    const flow: Step[] = ["landing", "intro", "category", "privacy", "location"];
    const idx = flow.indexOf(step);
    if (idx <= 0) {
      navigate(-1);
    } else {
      setStep(flow[idx - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {step === "landing" && <HostLanding onStart={handleStart} />}

      {step === "intro" && (
        <StepIntro onNext={() => setStep("category")} onBack={handleBack} />
      )}

      {step === "category" && (
        <StepCategory
          selected={category}
          onSelect={setCategory}
          onNext={() => setStep("privacy")}
          onBack={handleBack}
        />
      )}

      {step === "privacy" && (
        <StepPrivacyType
          selected={privacyType}
          onSelect={setPrivacyType}
          onNext={() => setStep("location")}
          onBack={handleBack}
        />
      )}

      {step === "location" && (
        <StepLocation
          address={address}
          lat={lat}
          lng={lng}
          onUpdate={(d) => {
            setAddress(d.address);
            setLat(d.lat);
            setLng(d.lng);
          }}
          onNext={handleFinish}
          onBack={handleBack}
        />
      )}

      <AuthModal
        open={showAuth}
        onOpenChange={setShowAuth}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default PartnerOnboarding;
