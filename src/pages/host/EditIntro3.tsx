import { useParams, useNavigate } from "react-router-dom";
import { X, MessageCircleQuestion } from "lucide-react";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";
import step3House from "@/assets/step3-house.png";

const EditIntro3 = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => navigate(`/host/edit/${id}/description`);
  const handleNext = () => navigate(`/host/edit/${id}/pricing`);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={() => navigate(`/host/listings`)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Κλείσιμο"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <button className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors">
          <MessageCircleQuestion className="w-4 h-4" />
          Ερωτήσεις;
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 max-w-lg mx-auto w-full">
        {/* 3D House illustration */}
        <div className="w-full mt-6 mb-8">
          <img
            src={step3House}
            alt="3D σπίτι εικονογράφηση"
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>

        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 3</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
          Ολοκλήρωση{"\n"}και δημοσίευση
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Θα ορίσετε την τιμή σας ανά διανυκτέρευση. Έπειτα, απαντήστε σε μερικές σύντομες ερωτήσεις και δημοσιεύστε την καταχώρησή σας όταν είστε έτοιμος/η.
        </p>
      </div>

      <OnboardingFooter onBack={handleBack} onNext={handleNext} nextLabel="Επόμενο" progress={97} />
    </div>
  );
};

export default EditIntro3;
