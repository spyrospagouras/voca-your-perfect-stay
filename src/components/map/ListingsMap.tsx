import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Listing } from "@/data/mockListings";
import type { LatLngBounds } from "leaflet";
import PriceMarker from "./PriceMarker";
import CenterPin from "./CenterPin";
import SearchAreaButton from "./SearchAreaButton";

interface ListingsMapProps {
  listings: Listing[];
  center: [number, number];
  zoom: number;
  onBoundsChange: (bounds: LatLngBounds) => void;
  onCenterChange: (lat: number, lng: number) => void;
  activeListing: string | null;
  onMarkerClick: (listing: Listing) => void;
  showSearchArea: boolean;
  onSearchArea: () => void;
}

function FlyToHandler({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const prevCenter = useRef(center);

  useEffect(() => {
    if (prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1]) {
      map.flyTo(center, zoom, { duration: 1.5 });
      prevCenter.current = center;
    }
  }, [center, zoom, map]);

  return null;
}

function MapEventHandler({
  onBoundsChange,
  onCenterChange,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void;
  onCenterChange: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      onBoundsChange(bounds);
      onCenterChange(center.lat, center.lng);
    },
  });

  useEffect(() => {
    // Initial bounds
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
}

const ListingsMap = ({
  listings,
  center,
  zoom,
  onBoundsChange,
  onCenterChange,
  activeListing,
  onMarkerClick,
  showSearchArea,
  onSearchArea,
}: ListingsMapProps) => {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FlyToHandler center={center} zoom={zoom} />
        <MapEventHandler onBoundsChange={onBoundsChange} onCenterChange={onCenterChange} />
        {listings.map((listing) => (
          <PriceMarker
            key={listing.id}
            listing={listing}
            isActive={activeListing === listing.id}
            onClick={onMarkerClick}
          />
        ))}
      </MapContainer>
      <CenterPin />
      <SearchAreaButton visible={showSearchArea} onClick={onSearchArea} />
    </div>
  );
};

export default ListingsMap;
