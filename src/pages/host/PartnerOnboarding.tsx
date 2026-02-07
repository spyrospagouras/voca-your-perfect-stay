import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepEmail from "@/components/onboarding/StepEmail";
import StepPersonalDetails from "@/components/onboarding/StepPersonalDetails";
import StepPassword from "@/components/onboarding/StepPassword";
import StepPropertyType from "@/components/onboarding/StepPropertyType";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

const PartnerOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "+30",
    password: "",
    propertyType: "",
    propertySubType: "",
  });

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const handleBack = () => {
    if (step === 1) {
      navigate("/host/menu");
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleSignUp = async () => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName },
        },
      });

      if (error) throw error;

      // Update profile with phone
      if (authData.user) {
        await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            role: "host",
          })
          .eq("id", authData.user.id);
      }

      setStep(4);
    } catch (error: any) {
      toast({
        title: "Σφάλμα",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFinish = async (propertyType: string, subType: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      await supabase.from("listings").insert({
        host_id: user.id,
        title: `Νέα καταχώρηση - ${subType || propertyType}`,
        property_type: subType || propertyType,
      });

      toast({ title: "Επιτυχία!", description: "Ο λογαριασμός σας δημιουργήθηκε." });
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
      {step === 1 && (
        <StepEmail
          email={data.email}
          onUpdate={updateData}
          onNext={() => setStep(2)}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <StepPersonalDetails
          data={data}
          onUpdate={updateData}
          onNext={() => setStep(3)}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <StepPassword
          data={data}
          onUpdate={updateData}
          onSignUp={handleSignUp}
          onBack={handleBack}
        />
      )}
      {step === 4 && (
        <StepPropertyType onFinish={handleFinish} onBack={handleBack} />
      )}
    </div>
  );
};

export default PartnerOnboarding;
