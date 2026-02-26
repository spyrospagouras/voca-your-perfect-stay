import { useParams, useNavigate } from "react-router-dom";
import { DollarSign, CalendarCheck } from "lucide-react";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";

const items = [
  {
    icon: DollarSign,
    title: "Ορίστε την τιμή σας",
    description: "Μπορείτε να αλλάξετε την τιμή σας ανά πάσα στιγμή.",
  },
  {
    icon: CalendarCheck,
    title: "Επιλέξτε διαθεσιμότητα",
    description: "Ελέγξτε πότε είναι διαθέσιμος ο χώρος σας.",
  },
];

const EditIntro3 = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => navigate(`/host/edit/${id}/description`);
  const handleNext = () => navigate(`/host/edit/${id}/pricing`);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 3</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Ολοκλήρωση και δημοσίευση
        </h1>
        <p className="text-muted-foreground mb-10 text-base">
          Τέλος, θα ορίσετε μια τιμή και θα δημοσιεύσετε την καταχώρησή σας.
        </p>

        <div className="space-y-8">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex gap-5 items-start">
                <span className="text-2xl font-bold text-foreground">{i + 1}</span>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <Icon className="w-8 h-8 text-primary shrink-0 mt-0.5" />
              </div>
            );
          })}
        </div>
      </div>

      <OnboardingFooter onBack={handleBack} onNext={handleNext} nextLabel="Συνέχεια" progress={97} />
    </div>
  );
};

export default EditIntro3;
