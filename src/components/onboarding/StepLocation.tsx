import { useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { MapPin, LocateFixed, Loader2 } from "lucide-react";
// Input removed – using native input for pill-shaped search bar
import OnboardingFooter from "./OnboardingFooter";
import { toast } from "@/hooks/use-toast";
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

function FlyToTarget({ target }: { target: [number, number] | null }) {
  const map = useMap();
  const prev = useRef<[number, number] | null>(null);
  if (target && (!prev.current || prev.current[0] !== target[0] || prev.current[1] !== target[1])) {
    prev.current = target;
    map.flyTo(target, 16, { duration: 1.5 });
  }
  return null;
}

const StepLocation = ({ address, lat, lng, onUpdate, onNext, onBack }: Props) => {
  const [localAddress, setLocalAddress] = useState(address);
  const [geoLoading, setGeoLoading] = useState(false);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

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

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Η πρόσβαση στην τοποθεσία δεν είναι ενεργοποιημένη" });
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setFlyTarget([latitude, longitude]);
        // Reverse geocode
        try {
          const res = await fetch(
            `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}&limit=1&lang=el`
          );
          const data = await res.json();
          const feature = data.features?.[0];
          if (feature) {
            const p = feature.properties;
            const name = [p.name, p.street, p.city, p.country].filter(Boolean).join(", ");
            setLocalAddress(name);
            onUpdate({ address: name, lat: latitude, lng: longitude });
          } else {
            const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setLocalAddress(fallback);
            onUpdate({ address: fallback, lat: latitude, lng: longitude });
          }
        } catch {
          const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocalAddress(fallback);
          onUpdate({ address: fallback, lat: latitude, lng: longitude });
        }
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
        toast({ title: "Η πρόσβαση στην τοποθεσία δεν είναι ενεργοποιημένη" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen map */}
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        className="absolute inset-0 h-full w-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onMove={handleMove} />
        <FlyToTarget target={flyTarget} />
      </MapContainer>

      {/* Center pin */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
        <MapPin className="w-10 h-10 text-primary -mt-10 drop-shadow-lg" fill="hsl(349, 100%, 59%)" />
      </div>

      {/* Top overlay: title + search */}
      <div className="absolute top-0 left-0 right-0 z-[1001] pointer-events-none">
        <div className="pointer-events-auto px-5 pt-6 pb-3 bg-gradient-to-b from-background/90 via-background/60 to-transparent">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Βήμα 1</p>
          <h1 className="text-lg font-bold text-foreground leading-tight">
            Πού βρίσκεται ο χώρος σας;
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Η διεύθυνσή σας κοινοποιείται μόνο στους επιβεβαιωμένους επισκέπτες.
          </p>
        </div>

        {/* Floating search bar */}
        <div className="pointer-events-auto px-5">
          <div className="relative">
            <div className="flex items-center bg-background rounded-full shadow-lg border border-border px-4 h-12">
              {geoLoading ? (
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0 mr-3" />
              ) : (
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mr-3" />
              )}
              <input
                value={localAddress}
                onChange={(e) => {
                  setLocalAddress(e.target.value);
                  onUpdate({ address: e.target.value, lat, lng });
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setTimeout(() => setInputFocused(false), 200)}
                placeholder="Εισάγετε τη διεύθυνσή σας"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>

            {/* Dropdown */}
            {inputFocused && (
              <div className="absolute top-14 left-0 right-0 bg-background rounded-2xl shadow-lg border border-border overflow-hidden z-[1002]">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleCurrentLocation}
                  disabled={geoLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors disabled:opacity-60"
                >
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                    {geoLoading ? (
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    ) : (
                      <LocateFixed className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {geoLoading ? "Εντοπισμός..." : "Χρήση τρέχουσας τοποθεσίας"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="absolute bottom-0 left-0 right-0 z-[1001]">
        <OnboardingFooter
          onBack={onBack}
          onNext={onNext}
          nextDisabled={!localAddress.trim()}
          progress={60}
        />
      </div>
    </div>
  );
};

export default StepLocation;
