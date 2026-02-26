import { useState } from "react";
import { Check, Zap, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  selected: string;
  onSelect: (type: string) => void;
  onNext: () => void;
  onBack: () => void;
  termsAccepted?: boolean;
  onTermsChange?: (accepted: boolean) => void;
}

const cards = [
  {
    id: "instant",
    title: "Online Κράτηση",
    icon: Zap,
    bullets: [
      {
        label: "Αυτοματοποίηση και Ταχύτητα",
        text: "Οι κρατήσεις σας επιβεβαιώνονται αυτόματα χωρίς την ανάγκη για ανταλλαγή μηνυμάτων, εξοικονομώντας σας πολύτιμο χρόνο και προσφέροντας στους σύγχρονους ταξιδιώτες την ταχύτητα και την άμεση ικανοποίηση που αναζητούν.",
      },
      {
        label: "Εγγύηση Πληρωμών και Ασφάλεια",
        text: "Εξασφαλίζετε σιγουριά για τις πληρωμές σας καθώς η πλατφόρμα αναλαμβάνει πλήρως τη διαχείριση των συναλλαγών, ενώ ταυτόχρονα καλύπτεστε από τις επίσημες πολιτικές ακύρωσης σε κάθε περίπτωση απρόοπτου γεγονότος.",
      },
      {
        label: "Υψηλότερη Κατάταξη στα Αποτελέσματα",
        text: "Εμφανίζεστε υψηλότερα στα αποτελέσματα αναζήτησης καθώς το σύστημα προωθεί κατά προτεραιότητα τα καταλύματα με άμεση κράτηση, αυξάνοντας έτσι κατακόρυφα τις προβολές της αγγελίας σας και τις τελικές σας κρατήσεις.",
      },
    ],
  },
  {
    id: "listing_only",
    title: "Μόνο Προβολή",
    icon: Eye,
    bullets: [
      {
        label: "Απόλυτος Έλεγχος Επισκεπτών",
        text: "Επικοινωνείτε απευθείας με τους ενδιαφερόμενους ταξιδιώτες και αποφασίζετε εσείς αν ταιριάζουν στο προφίλ του καταλύματός σας, διατηρώντας τον απόλυτο έλεγχο για κάθε κράτηση που συμφωνείτε ιδιωτικά.",
      },
      {
        label: "Μηδενικές Προμήθειες Κράτησης",
        text: "Αποφεύγετε τις προμήθειες συναλλαγής προς την πλατφόρμα και κρατάτε το σύνολο των κερδών από κάθε συμφωνία, εξασφαλίζοντας έτσι τη μέγιστη δυνατή απόδοση για την τουριστική σας επιχείρηση.",
      },
      {
        label: "Ευελιξία χωρίς Δεσμεύσεις",
        text: "Απολαμβάνετε πλήρη ευελιξία χωρίς το άγχος του συγχρονισμού των ημερολογίων ή των αυστηρών ποινών ακύρωσης, επιλέγοντας μια χαλαρή προσέγγιση που ταιριάζει ιδανικά στις δικές σας προσωπικές ανάγκες.",
      },
    ],
  },
];

const StepBookingType = ({ selected, onSelect, onNext, onBack, termsAccepted = false, onTermsChange }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 px-6 pt-10 pb-6 max-w-4xl mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 4</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 leading-tight">
          Τώρα είναι ώρα να επιλέξετε μια κατηγορία.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const isSelected = selected === card.id;
            return (
              <button
                key={card.id}
                onClick={() => onSelect(card.id)}
                className={`w-full text-left rounded-xl border-2 p-5 transition-all relative ${
                  isSelected
                    ? "border-foreground bg-muted/30"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                    <Check className="w-4 h-4 text-background" />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <Icon
                    className={`w-6 h-6 shrink-0 ${
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    }`}
                    strokeWidth={1.5}
                  />
                  <h2 className="text-lg font-bold text-foreground">{card.title}</h2>
                </div>

                <ul className="space-y-3">
                  {card.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">{b.label}: </span>
                      {b.text}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="flex items-start gap-3 mt-6">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => onTermsChange?.(checked === true)}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
            Αποδέχομαι τους{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80"
            >
              Όρους Χρήσης
            </a>
          </label>
        </div>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selected || !termsAccepted}
        nextLabel="Δημοσιεύστε"
        progress={92}
      />
    </div>
  );
};

export default StepBookingType;
