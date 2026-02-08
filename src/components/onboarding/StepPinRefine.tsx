import { useCallback, useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { MapPin } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lng: number;
  onUpdate: (lat: number, lng: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const MapEvents = ({ onMove }: { onMove: (lat: number, lng: number) => void }) => {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      onMove(center.lat, center.lng);
    },
  });
  return null;
};

const StepPinRefine = ({ lat, lng, onUpdate, onNext, onBack }: Props) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleMove = useCallback(
    (newLat: number, newLng: number) => {
      setShowTooltip(false);
      onUpdate(newLat, newLng);
    },
    [onUpdate]
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen map */}
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        className="absolute inset-0 h-full w-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onMove={handleMove} />
      </MapContainer>

      {/* Center pin */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
        <MapPin
          className="w-10 h-10 text-primary -mt-10 drop-shadow-lg"
          fill="hsl(349, 100%, 59%)"
        />
      </div>

      {/* Floating tooltip */}
      {showTooltip && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-4 z-[1001] pointer-events-none">
          <div className="bg-foreground text-background text-xs font-medium px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap">
            Σύρετε τον χάρτη για να αλλάξετε τη θέση της πινέζας
          </div>
        </div>
      )}

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1001] pointer-events-none">
        <div className="pointer-events-auto px-5 pt-6 pb-3 bg-gradient-to-b from-background/90 via-background/60 to-transparent">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 4</p>
          <h1 className="text-lg font-bold text-foreground leading-tight">
            Ρυθμίστε τη θέση της πινέζας
          </h1>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="absolute bottom-0 left-0 right-0 z-[1001]">
        <OnboardingFooter onBack={onBack} onNext={onNext} progress={60} />
      </div>
    </div>
  );
};

export default StepPinRefine;
