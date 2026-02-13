import { MapPin, Bed, Bath, Users, Euro } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

interface Props {
  title: string;
  description: string;
  category: string;
  privacyType: string;
  location: string;
  basics: { guests: number; bedrooms: number; beds: number; bathrooms: number };
  price: number;
  coverImage: string;
  highlights: string[];
  onPublish: () => void;
  onBack: () => void;
  loading?: boolean;
}

const StepReview = ({
  title,
  description,
  category,
  privacyType,
  location,
  basics,
  price,
  coverImage,
  highlights,
  onPublish,
  onBack,
  loading,
}: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 px-6 py-10 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 3</p>
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Ελέγξτε την καταχώρησή σας
        </h1>

        {/* Cover image */}
        <div className="rounded-xl overflow-hidden mb-6 aspect-[16/10] bg-muted">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-foreground mb-1">{title || "Χωρίς τίτλο"}</h2>

        {/* Category & privacy */}
        <p className="text-sm text-muted-foreground mb-4">
          {[category, privacyType].filter(Boolean).join(" · ")}
        </p>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{location}</span>
          </div>
        )}

        {/* Basics */}
        <div className="flex flex-wrap gap-4 text-sm text-foreground mb-6">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted-foreground" /> {basics.guests} επισκέπτες
          </span>
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-muted-foreground" /> {basics.bedrooms} υπνοδωμάτια
          </span>
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-muted-foreground" /> {basics.beds} κρεβάτια
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-muted-foreground" /> {basics.bathrooms} μπάνια
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
          <Euro className="w-5 h-5" />
          <span>{price} / βράδυ</span>
        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">Χαρακτηριστικά</h3>
            <div className="flex flex-wrap gap-2">
              {highlights.map((h) => (
                <span
                  key={h}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-border text-foreground"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Περιγραφή</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        )}
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onPublish}
        nextLabel="Συνέχεια"
        loading={loading}
        progress={94}
      />
    </div>
  );
};

export default StepReview;
