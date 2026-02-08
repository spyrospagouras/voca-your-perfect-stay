import { useState, useEffect, useRef } from "react";
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
import StepAmenities from "@/components/onboarding/StepAmenities";
import StepPhotos from "@/components/onboarding/StepPhotos";

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
  | "intro2"
  | "amenities"
  | "photos";

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
  "amenities",
  "photos",
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
  const draftListingId = useRef<string | null>(draft?.listingId || null);

  const [step, setStep] = useState<Step>(
    draft?.step && user ? draft.step : "landing"
  );
  const [showAuth, setShowAuth] = useState(false);
  const [saving, setSaving] = useState(false);

  // Listing data
  const [category, setCategory] = useState(draft?.category || "");
  const [privacyType, setPrivacyType] = useState(draft?.privacyType || "");
  const [address, setAddress] = useState(draft?.address || "");
  const [lat, setLat] = useState(draft?.lat ?? 37.9838);
  const [lng, setLng] = useState(draft?.lng ?? 23.7275);
  const [street, setStreet] = useState(draft?.street || "");
  const [zip, setZip] = useState(draft?.zip || "");
  const [city, setCity] = useState(draft?.city || "");
  const [showExact, setShowExact] = useState(draft?.showExact ?? true);
  const [basics, setBasics] = useState(
    draft?.basics || { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 }
  );
  const [amenities, setAmenities] = useState<string[]>(draft?.amenities || []);
  const [photos, setPhotos] = useState<string[]>(draft?.photos || []);

  // Persist draft to localStorage
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
          amenities,
          photos,
          listingId: draftListingId.current,
        })
      );
    }
  }, [step, category, privacyType, address, lat, lng, street, zip, city, showExact, basics, amenities, photos]);

  // --- Supabase draft sync helpers ---
  const upsertDraft = async (extraFields: Record<string, any> = {}) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    const payload: Record<string, any> = {
      host_id: currentUser.id,
      title: "Νέα καταχώρηση",
      status: "draft",
      property_type: category || null,
      privacy_type: privacyType || null,
      location_name: address || null,
      latitude: lat,
      longitude: lng,
      street: street || null,
      zip: zip || null,
      city: city || null,
      show_exact_location: showExact,
      max_guests: basics.guests,
      bedrooms: basics.bedrooms,
      beds: basics.beds,
      bathrooms: basics.bathrooms,
      images: photos.length > 0 ? photos : null,
      ...extraFields,
    };

    setSaving(true);
    try {
      if (draftListingId.current) {
        await supabase
          .from("listings")
          .update(payload as any)
          .eq("id", draftListingId.current);
      } else {
        const { data, error } = await supabase
          .from("listings")
          .insert(payload as any)
          .select("id")
          .single();
        if (error) throw error;
        if (data) draftListingId.current = data.id;
      }
    } catch (err: any) {
      console.error("Draft save error:", err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Navigation ---
  const handleStart = () => {
    if (user) setStep("intro");
    else setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setStep("intro");
  };

  const DATA_STEPS: Step[] = ["category", "privacy", "location", "address", "privacy-toggle", "pin-refine", "basics", "amenities", "photos"];

  const goNextFrom = async (current: Step) => {
    const idx = FLOW.indexOf(current);
    if (idx < FLOW.length - 1) {
      if (DATA_STEPS.includes(current)) {
        await upsertDraft();
      }
      setStep(FLOW[idx + 1]);
    }
  };

  const goBack = () => {
    const idx = FLOW.indexOf(step);
    if (idx <= 0) navigate(-1);
    else setStep(FLOW[idx - 1]);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("No user");

      await supabase
        .from("profiles")
        .update({ role: "host" })
        .eq("id", currentUser.id);

      if (draftListingId.current) {
        await supabase
          .from("listings")
          .update({
            status: "active",
            images: photos,
            location_name: [street, city].filter(Boolean).join(", ") || address,
          })
          .eq("id", draftListingId.current);
      }

      localStorage.removeItem(STORAGE_KEY);
      toast({ title: "Επιτυχία!", description: "Η καταχώρησή σας δημιουργήθηκε." });
      navigate("/host/listings");
    } catch (error: any) {
      toast({ title: "Σφάλμα", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {step === "landing" && <HostLanding onStart={handleStart} />}

      {step === "intro" && <StepIntro onNext={() => goNextFrom("intro")} onBack={goBack} />}

      {step === "category" && (
        <StepCategory
          selected={category}
          onSelect={setCategory}
          onNext={() => goNextFrom("category")}
          onBack={goBack}
        />
      )}

      {step === "privacy" && (
        <StepPrivacyType
          selected={privacyType}
          onSelect={setPrivacyType}
          onNext={() => goNextFrom("privacy")}
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
          onNext={() => goNextFrom("location")}
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
          onNext={() => goNextFrom("address")}
          onBack={goBack}
        />
      )}

      {step === "privacy-toggle" && (
        <StepPrivacyToggle
          lat={lat}
          lng={lng}
          showExact={showExact}
          onToggle={setShowExact}
          onNext={() => goNextFrom("privacy-toggle")}
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
          onNext={() => goNextFrom("pin-refine")}
          onBack={goBack}
        />
      )}

      {step === "basics" && (
        <StepBasics
          basics={basics}
          onChange={setBasics}
          onNext={() => goNextFrom("basics")}
          onBack={goBack}
        />
      )}

      {step === "intro2" && (
        <StepIntro2 onNext={() => goNextFrom("intro2")} onBack={goBack} />
      )}

      {step === "amenities" && (
        <StepAmenities
          selected={amenities}
          onSelect={setAmenities}
          onNext={() => goNextFrom("amenities")}
          onBack={goBack}
        />
      )}

      {step === "photos" && (
        <StepPhotos
          photos={photos}
          onChange={setPhotos}
          listingId={draftListingId.current}
          onNext={handleFinish}
          onBack={goBack}
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
