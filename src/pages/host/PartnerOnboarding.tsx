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
import StepAddressConfirm from "@/components/onboarding/StepAddressConfirm";
import StepPrivacyToggle from "@/components/onboarding/StepPrivacyToggle";
import StepPinRefine from "@/components/onboarding/StepPinRefine";
import StepBasics from "@/components/onboarding/StepBasics";
import StepIntro2 from "@/components/onboarding/StepIntro2";

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

type Step =
  | "landing"
  | "intro"
  | "category"
  | "privacy"
  | "location"
  | "address"
  | "privacy-toggle"
  | "pin-refine"
  | "basics"
  | "intro2";

const FLOW: Step[] = [
  "landing",
  "intro",
  "category",
  "privacy",
  "location",
  "address",
  "privacy-toggle",
  "pin-refine",
  "basics",
  "intro2",
];

const STORAGE_KEY = "voca_onboarding_draft";

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const PartnerOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const draft = loadDraft();

  const [step, setStep] = useState<Step>(
    draft?.step && user ? draft.step : "landing"
  );
  const [showAuth, setShowAuth] = useState(false);

  // Listing data
  const [category, setCategory] = useState(draft?.category || "");
  const [privacyType, setPrivacyType] = useState(draft?.privacyType || "");
  const [address, setAddress] = useState(draft?.address || "");
  const [lat, setLat] = useState(draft?.lat ?? 37.9838);
  const [lng, setLng] = useState(draft?.lng ?? 23.7275);

  // New fields
  const [street, setStreet] = useState(draft?.street || "");
  const [zip, setZip] = useState(draft?.zip || "");
  const [city, setCity] = useState(draft?.city || "");
  const [showExact, setShowExact] = useState(draft?.showExact ?? true);
  const [basics, setBasics] = useState(
    draft?.basics || { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 }
  );

  // Persist draft
  useEffect(() => {
    if (step !== "landing") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step,
          category,
          privacyType,
          address,
          lat,
          lng,
          street,
          zip,
          city,
          showExact,
          basics,
        })
      );
    }
  }, [step, category, privacyType, address, lat, lng, street, zip, city, showExact, basics]);

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

  const goNext = () => {
    const idx = FLOW.indexOf(step);
    if (idx < FLOW.length - 1) setStep(FLOW[idx + 1]);
  };

  const goBack = () => {
    const idx = FLOW.indexOf(step);
    if (idx <= 0) navigate(-1);
    else setStep(FLOW[idx - 1]);
  };

  const handleFinish = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("No user");

      await supabase
        .from("profiles")
        .update({ role: "host" })
        .eq("id", currentUser.id);

      await supabase.from("listings").insert({
        host_id: currentUser.id,
        title: `Νέα καταχώρηση`,
        property_type: category,
        privacy_type: privacyType,
        location_name: [street, city].filter(Boolean).join(", ") || address,
        latitude: lat,
        longitude: lng,
      });

      localStorage.removeItem(STORAGE_KEY);
      toast({
        title: "Επιτυχία!",
        description: "Η καταχώρησή σας δημιουργήθηκε.",
      });
      navigate("/host/listings");
    } catch (error: any) {
      toast({
        title: "Σφάλμα",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {step === "landing" && <HostLanding onStart={handleStart} />}

      {step === "intro" && <StepIntro onNext={goNext} onBack={goBack} />}

      {step === "category" && (
        <StepCategory
          selected={category}
          onSelect={setCategory}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === "privacy" && (
        <StepPrivacyType
          selected={privacyType}
          onSelect={setPrivacyType}
          onNext={goNext}
          onBack={goBack}
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
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === "address" && (
        <StepAddressConfirm
          address={address}
          onUpdate={(d) => {
            setStreet(d.street);
            setZip(d.zip);
            setCity(d.city);
          }}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === "privacy-toggle" && (
        <StepPrivacyToggle
          lat={lat}
          lng={lng}
          showExact={showExact}
          onToggle={setShowExact}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === "pin-refine" && (
        <StepPinRefine
          lat={lat}
          lng={lng}
          onUpdate={(newLat, newLng) => {
            setLat(newLat);
            setLng(newLng);
          }}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === "basics" && (
        <StepBasics
          basics={basics}
          onChange={setBasics}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === "intro2" && (
        <StepIntro2 onNext={handleFinish} onBack={goBack} />
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
