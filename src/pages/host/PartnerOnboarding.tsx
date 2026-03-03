import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import HostLanding from "@/components/onboarding/HostLanding";
import AuthModal from "@/components/onboarding/AuthModal";
import StepIntro from "@/components/onboarding/StepIntro";
import StepCategory from "@/components/onboarding/StepCategory";
import StepPropertyType from "@/components/onboarding/StepPropertyType";
import StepPrivacyType from "@/components/onboarding/StepPrivacyType";
import StepLocation from "@/components/onboarding/StepLocation";
import StepAddressConfirm from "@/components/onboarding/StepAddressConfirm";
import StepPrivacyToggle from "@/components/onboarding/StepPrivacyToggle";
import StepPinRefine from "@/components/onboarding/StepPinRefine";
import StepBasics from "@/components/onboarding/StepBasics";
import StepBathrooms from "@/components/onboarding/StepBathrooms";
import StepIntro2 from "@/components/onboarding/StepIntro2";
import StepAmenities from "@/components/onboarding/StepAmenities";
import StepPhotos from "@/components/onboarding/StepPhotos";

import StepTitle from "@/components/onboarding/StepTitle";
import StepHighlights from "@/components/onboarding/StepHighlights";
import StepDescription from "@/components/onboarding/StepDescription";
import StepIntro3 from "@/components/onboarding/StepIntro3";
import StepPricing from "@/components/onboarding/StepPricing";
import StepReview from "@/components/onboarding/StepReview";
import StepIntro4 from "@/components/onboarding/StepIntro4";
import StepBookingType from "@/components/onboarding/StepBookingType";
import StepContactInfo from "@/components/onboarding/StepContactInfo";

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

// Keep Step type updated

type Step =
  | "landing"
  | "intro"
  | "category"
  | "property-type"
  | "privacy"
  | "location"
  | "address"
  | "privacy-toggle"
  | "pin-refine"
  | "basics"
  | "bathrooms"
  | "intro2"
  | "amenities"
  | "photos"
  | "title"
  | "highlights"
  | "description"
  | "intro3"
  | "pricing"
  | "review"
  | "intro4"
  | "booking-type"
  | "contact-info";

const BASE_FLOW: Step[] = [
  "landing",
  "intro",
  "category",
  "property-type",
  "privacy",
  "location",
  "address",
  "privacy-toggle",
  "pin-refine",
  "basics",
  "intro2",
  "amenities",
  "photos",
  "title",
  "highlights",
  "description",
  "intro3",
  "pricing",
  "review",
  "intro4",
  "booking-type",
];

const PRIVATE_FLOW: Step[] = [
  "landing",
  "intro",
  "category",
  "property-type",
  "privacy",
  "location",
  "address",
  "privacy-toggle",
  "pin-refine",
  "basics",
  "bathrooms",
  "intro2",
  "amenities",
  "photos",
  "title",
  "highlights",
  "description",
  "intro3",
  "pricing",
  "review",
  "intro4",
  "booking-type",
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
  const [propertySubType, setPropertySubType] = useState(draft?.propertySubType || "");
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
  const [listingTitle, setListingTitle] = useState(draft?.listingTitle || "");
  const [highlights, setHighlights] = useState<string[]>(draft?.highlights || []);
  const [description, setDescription] = useState(draft?.description || "");
  const [pricePerNight, setPricePerNight] = useState(draft?.pricePerNight || 50);
  const [bookingType, setBookingType] = useState(draft?.bookingType || "");
  const [termsAccepted, setTermsAccepted] = useState(draft?.termsAccepted || false);
  const [hasBedroomLock, setHasBedroomLock] = useState<boolean | null>(draft?.hasBedroomLock ?? null);
  const [bathroomData, setBathroomData] = useState({
    privateEnsuite: draft?.privateEnsuite || 0,
    privateHallway: draft?.privateHallway || 0,
    shared: draft?.shared || 0,
  });
  const [contactData, setContactData] = useState({
    contactMobile: draft?.contactMobile || "",
    contactLandline: draft?.contactLandline || "",
    contactEmail: draft?.contactEmail || "",
    contactWebsite: draft?.contactWebsite || "",
    contactFacebook: draft?.contactFacebook || "",
    contactInstagram: draft?.contactInstagram || "",
  });

  // Dynamic flow
  const baseFlow = privacyType === "private" ? PRIVATE_FLOW : BASE_FLOW;
  const FLOW: Step[] = bookingType === "listing_only"
    ? [...baseFlow, "contact-info"]
    : baseFlow;

  // Persist draft to localStorage
  useEffect(() => {
    if (step !== "landing") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step,
          category,
          propertySubType,
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
          listingTitle,
          highlights,
          description,
          pricePerNight,
          bookingType,
          hasBedroomLock,
          privateEnsuite: bathroomData.privateEnsuite,
          privateHallway: bathroomData.privateHallway,
          shared: bathroomData.shared,
          contactMobile: contactData.contactMobile,
          contactLandline: contactData.contactLandline,
          contactEmail: contactData.contactEmail,
          contactWebsite: contactData.contactWebsite,
          contactFacebook: contactData.contactFacebook,
          contactInstagram: contactData.contactInstagram,
          listingId: draftListingId.current,
        })
      );
    }
  }, [step, category, privacyType, address, lat, lng, street, zip, city, showExact, basics, amenities, photos, listingTitle, highlights, description, pricePerNight, bookingType, hasBedroomLock, bathroomData, contactData]);

  // --- Supabase draft sync helpers ---
  const upsertDraft = async (extraFields: Record<string, any> = {}) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    const payload: Record<string, any> = {
      host_id: currentUser.id,
      status: "draft",
      property_type: category || null,
      property_sub_type: propertySubType || null,
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
      amenities: amenities.length > 0 ? amenities : [],
      images: photos.length > 0 ? photos : null,
      cover_image_url: photos.length > 0 ? photos[0] : "/placeholder.svg",
      title: listingTitle.trim() || "Νέα καταχώρηση",
      description: description.trim() || null,
      highlights: highlights.length > 0 ? highlights : [],
      price_per_night: pricePerNight > 0 ? pricePerNight : null,
      booking_type: bookingType || null,
      has_bedroom_lock: privacyType === "private" ? hasBedroomLock : null,
      private_ensuite_bathrooms: privacyType === "private" ? bathroomData.privateEnsuite : 0,
      private_hallway_bathrooms: privacyType === "private" ? bathroomData.privateHallway : 0,
      shared_bathrooms: privacyType === "private" ? bathroomData.shared : 0,
      contact_mobile: contactData.contactMobile || null,
      contact_landline: contactData.contactLandline || null,
      contact_email: contactData.contactEmail || null,
      contact_website: contactData.contactWebsite || null,
      contact_facebook: contactData.contactFacebook || null,
      contact_instagram: contactData.contactInstagram || null,
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

  const DATA_STEPS: Step[] = ["category", "property-type", "privacy", "location", "address", "privacy-toggle", "pin-refine", "basics", "bathrooms", "amenities", "photos", "title", "highlights", "description", "pricing", "booking-type", "contact-info"];

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
        .update({ role: "host" } as any)
        .eq("id", currentUser.id);

      if (draftListingId.current) {
        await supabase
          .from("listings")
          .update({
            status: "active",
            images: photos,
            cover_image_url: photos[0] || "/placeholder.svg",
            title: listingTitle.trim() || "Νέα καταχώρηση",
            description: description.trim() || null,
            highlights: highlights.length > 0 ? highlights : [],
            price_per_night: pricePerNight > 0 ? pricePerNight : null,
            location_name: [street, city].filter(Boolean).join(", ") || address,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
            contact_mobile: contactData.contactMobile || null,
            contact_landline: contactData.contactLandline || null,
            contact_email: contactData.contactEmail || null,
            contact_website: contactData.contactWebsite || null,
            contact_facebook: contactData.contactFacebook || null,
            contact_instagram: contactData.contactInstagram || null,
          } as any)
          .eq("id", draftListingId.current);
      }

      localStorage.removeItem(STORAGE_KEY);
      toast({ title: "Επιτυχία!", description: "Η καταχώρησή σας δημοσιεύτηκε!" });
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
          onSelect={(cat) => {
            setCategory(cat);
            setPropertySubType("");
          }}
          onNext={() => goNextFrom("category")}
          onBack={goBack}
        />
      )}

      {step === "property-type" && (
        <StepPropertyType
          category={category}
          selected={propertySubType}
          onSelect={setPropertySubType}
          onNext={() => goNextFrom("property-type")}
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
          privacyType={privacyType}
          hasBedroomLock={hasBedroomLock}
          onLockChange={setHasBedroomLock}
        />
      )}

      {step === "bathrooms" && (
        <StepBathrooms
          data={bathroomData}
          onChange={setBathroomData}
          onNext={() => goNextFrom("bathrooms")}
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
          onNext={() => goNextFrom("photos")}
          onBack={goBack}
        />
      )}

      {step === "title" && (
        <StepTitle
          title={listingTitle}
          onChange={setListingTitle}
          onNext={() => goNextFrom("title")}
          onBack={goBack}
        />
      )}

      {step === "highlights" && (
        <StepHighlights
          selected={highlights}
          onSelect={setHighlights}
          onNext={() => goNextFrom("highlights")}
          onBack={goBack}
        />
      )}

      {step === "description" && (
        <StepDescription
          description={description}
          onChange={setDescription}
          onNext={() => goNextFrom("description")}
          onBack={goBack}
        />
      )}

      {step === "intro3" && (
        <StepIntro3
          onNext={() => goNextFrom("intro3")}
          onBack={goBack}
        />
      )}

      {step === "pricing" && (
        <StepPricing
          price={pricePerNight}
          onChange={setPricePerNight}
          onNext={() => goNextFrom("pricing")}
          onBack={goBack}
          lat={lat}
          lng={lng}
          listingId={draftListingId.current}
        />
      )}

      {step === "review" && (
        <StepReview
          title={listingTitle}
          description={description}
          category={category}
          privacyType={privacyType}
          location={[street, city].filter(Boolean).join(", ") || address}
          basics={basics}
          price={pricePerNight}
          coverImage={photos[0] || "/placeholder.svg"}
          highlights={highlights}
          onPublish={() => goNextFrom("review")}
          onBack={goBack}
          loading={saving}
        />
      )}

      {step === "intro4" && (
        <StepIntro4
          onNext={() => goNextFrom("intro4")}
          onBack={goBack}
        />
      )}

      {step === "booking-type" && (
        <StepBookingType
          selected={bookingType}
          onSelect={setBookingType}
          onNext={bookingType === "listing_only" ? () => goNextFrom("booking-type") : handleFinish}
          onBack={goBack}
          termsAccepted={termsAccepted}
          onTermsChange={setTermsAccepted}
        />
      )}

      {step === "contact-info" && (
        <StepContactInfo
          data={contactData}
          onChange={setContactData}
          onNext={handleFinish}
          onBack={goBack}
          loading={saving}
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
