import { useState } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import { Switch } from "@/components/ui/switch";
import OnboardingFooter from "./OnboardingFooter";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lng: number;
  showExact: boolean;
  onToggle: (val: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPrivacyToggle = ({ lat, lng, showExact, onToggle, onNext, onBack }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 px-6 pt-10 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 3</p>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Απόρρητο τοποθεσίας
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Επιλέξτε αν θα εμφανίζεται η ακριβής τοποθεσία στους επισκέπτες ή μόνο η περιοχή.
        </p>

        {/* Map preview */}
        <div className="w-full aspect-square rounded-2xl overflow-hidden border border-border mb-6">
          <MapContainer
            center={[lat, lng]}
            zoom={showExact ? 16 : 14}
            className="h-full w-full"
            zoomControl={false}
            attributionControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {!showExact && (
              <Circle
                center={[lat, lng]}
                radius={450}
                pathOptions={{
                  fillColor: "hsl(var(--primary))",
                  fillOpacity: 0.15,
                  color: "hsl(var(--primary))",
                  weight: 2,
                }}
              />
            )}
          </MapContainer>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between py-4 border-t border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Εμφάνιση ακριβούς τοποθεσίας
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {showExact
                ? "Οι επισκέπτες θα βλέπουν την ακριβή θέση."
                : "Οι επισκέπτες θα βλέπουν μόνο την ευρύτερη περιοχή."}
            </p>
          </div>
          <Switch checked={showExact} onCheckedChange={onToggle} />
        </div>
      </div>

      <OnboardingFooter onBack={onBack} onNext={onNext} progress={55} />
    </div>
  );
};

export default StepPrivacyToggle;
