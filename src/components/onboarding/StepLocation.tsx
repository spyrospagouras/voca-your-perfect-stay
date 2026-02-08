import { useState, useCallback } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import OnboardingFooter from "./OnboardingFooter";
import "leaflet/dist/leaflet.css";

interface Props {
  address: string;
  lat: number;
  lng: number;
  onUpdate: (data: { address: string; lat: number; lng: number }) => void;
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

const StepLocation = ({ address, lat, lng, onUpdate, onNext, onBack }: Props) => {
  const [localAddress, setLocalAddress] = useState(address);

  const handleMove = useCallback(
    async (newLat: number, newLng: number) => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/reverse?lat=${newLat}&lon=${newLng}&lang=el`
        );
        const data = await res.json();
        const feature = data.features?.[0];
        if (feature) {
          const p = feature.properties;
          const name = [p.name, p.street, p.city, p.country].filter(Boolean).join(", ");
          setLocalAddress(name);
          onUpdate({ address: name, lat: newLat, lng: newLng });
        } else {
          onUpdate({ address: localAddress, lat: newLat, lng: newLng });
        }
      } catch {
        onUpdate({ address: localAddress, lat: newLat, lng: newLng });
      }
    },
    [localAddress, onUpdate]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="px-6 pt-10 max-w-lg mx-auto w-full">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Βήμα 1</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Πού βρίσκεται ο χώρος σας;
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            Η διεύθυνσή σας κοινοποιείται μόνο στους επιβεβαιωμένους επισκέπτες.
          </p>
          <Input
            value={localAddress}
            onChange={(e) => {
              setLocalAddress(e.target.value);
              onUpdate({ address: e.target.value, lat, lng });
            }}
            placeholder="Εισάγετε τη διεύθυνσή σας"
            className="h-12 rounded-lg mb-4"
          />
        </div>

        {/* Map */}
        <div className="relative flex-1 min-h-[300px]">
          <MapContainer
            center={[lat, lng]}
            zoom={14}
            className="h-full w-full z-0"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents onMove={handleMove} />
          </MapContainer>

          {/* Center pin */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
            <MapPin className="w-10 h-10 text-[hsl(var(--primary))] -mt-10 drop-shadow-lg" />
          </div>
        </div>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!localAddress.trim()}
        progress={60}
      />
    </div>
  );
};

export default StepLocation;
