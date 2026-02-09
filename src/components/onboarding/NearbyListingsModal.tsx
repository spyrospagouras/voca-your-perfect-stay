import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";

interface NearbyListing {
  id: string;
  title: string;
  price_per_night: number | null;
  latitude: number;
  longitude: number;
}

interface Props {
  lat: number;
  lng: number;
  listingId: string | null;
  onClose: () => void;
}

function createPriceIcon(price: number | null) {
  const label = price ? `€${price}` : "—";
  return L.divIcon({
    className: "custom-price-marker",
    html: `<div style="
      background: hsl(0,0%,13%);
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      font-family: Inter, system-ui, sans-serif;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      border: 2px solid white;
      transform: translate(-50%, -50%);
    ">${label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

const hostIcon = L.divIcon({
  className: "custom-price-marker",
  html: `<div style="
    background: hsl(349,100%,59%);
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    font-family: Inter, system-ui, sans-serif;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    border: 2px solid white;
    transform: translate(-50%, -50%);
  ">Εσείς</div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

const NearbyListingsModal = ({ lat, lng, listingId, onClose }: Props) => {
  const [listings, setListings] = useState<NearbyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("nearby_listings", {
        p_lat: lat,
        p_lng: lng,
        p_radius_km: 2,
        p_exclude_id: listingId ?? undefined,
      });
      if (!error && data) {
        setListings(
          (data as any[]).map((l) => ({
            id: l.id,
            title: l.title,
            price_per_night: l.price_per_night,
            latitude: l.latitude,
            longitude: l.longitude,
          }))
        );
      }
      setLoading(false);
    };
    fetch();
  }, [lat, lng, listingId]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Κλείσιμο">
          <X className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-sm font-semibold text-foreground">Παρόμοιες καταχωρήσεις κοντά σας</h2>
        <div className="w-9" />
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <p className="text-sm text-muted-foreground">Φόρτωση…</p>
          </div>
        )}
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          className="w-full h-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Host pin */}
          <Marker position={[lat, lng]} icon={hostIcon}>
            <Popup closeButton={false}>
              <span className="text-sm font-semibold">Η τοποθεσία σας</span>
            </Popup>
          </Marker>

          {/* Nearby listings */}
          {listings.map((l) => (
            <Marker key={l.id} position={[l.latitude, l.longitude]} icon={createPriceIcon(l.price_per_night)}>
              <Popup closeButton={false} maxWidth={220}>
                <div className="font-['Inter',sans-serif]">
                  <h3 className="text-sm font-semibold leading-tight line-clamp-2">{l.title}</h3>
                  <p className="text-sm font-semibold mt-1">
                    {l.price_per_night ? `€${l.price_per_night}` : "—"}{" "}
                    <span className="font-normal text-gray-500">/ νύχτα</span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Results count */}
        {!loading && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {listings.length === 0
              ? "Δεν βρέθηκαν καταχωρήσεις σε ακτίνα 2 χλμ."
              : `${listings.length} καταχωρήσ${listings.length === 1 ? "η" : "εις"} σε ακτίνα 2 χλμ.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyListingsModal;
