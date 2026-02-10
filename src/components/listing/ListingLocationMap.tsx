import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface ListingLocationMapProps {
  lat: number | null;
  lng: number | null;
  locationName: string | null;
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ListingLocationMap = ({ lat, lng, locationName }: ListingLocationMapProps) => {
  if (!lat || !lng) return null;

  return (
    <section>
      <h2 className="text-base font-bold text-foreground mb-2">Τοποθεσία</h2>
      {locationName && (
        <p className="text-sm text-muted-foreground mb-3">{locationName}</p>
      )}
      <div className="rounded-xl overflow-hidden border border-border h-52">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          attributionControl={false}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} icon={markerIcon} />
        </MapContainer>
      </div>
    </section>
  );
};

export default ListingLocationMap;
