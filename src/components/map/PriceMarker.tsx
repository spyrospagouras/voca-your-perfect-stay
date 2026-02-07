import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Listing } from "@/data/mockListings";
import { Star } from "lucide-react";

interface PriceMarkerProps {
  listing: Listing;
  isActive: boolean;
  onClick: (listing: Listing) => void;
}

function createPriceIcon(price: number, isActive: boolean) {
  const bg = isActive ? "hsl(349, 100%, 59%)" : "hsl(0, 0%, 13%)";
  const text = "white";

  return L.divIcon({
    className: "custom-price-marker",
    html: `<div style="
      background: ${bg};
      color: ${text};
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      font-family: Inter, system-ui, sans-serif;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      border: 2px solid white;
      cursor: pointer;
      transform: translate(-50%, -50%);
    ">€${price}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

const PriceMarker = ({ listing, isActive, onClick }: PriceMarkerProps) => {
  return (
    <Marker
      position={[listing.lat, listing.lng]}
      icon={createPriceIcon(listing.price, isActive)}
      eventHandlers={{
        click: () => onClick(listing),
      }}
    >
      <Popup className="listing-popup" closeButton={false} maxWidth={260}>
        <div className="w-[240px] font-['Inter',sans-serif]">
          <div className="w-full h-[140px] bg-gray-200 rounded-lg mb-2 overflow-hidden">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-medium">{listing.rating}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{listing.type}</p>
          <p className="text-sm font-semibold mt-1">
            €{listing.price} <span className="font-normal text-gray-500">/ νύχτα</span>
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

export default PriceMarker;
