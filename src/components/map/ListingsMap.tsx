import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import type { Listing } from "@/data/mockListings";
import type { LatLngBounds } from "leaflet";
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

function createPriceIcon(price: number, isActive: boolean) {
  const bg = isActive ? "hsl(349, 100%, 59%)" : "white";
  const text = isActive ? "white" : "hsl(0, 0%, 13%)";
  const border = isActive ? "white" : "rgba(0,0,0,0.08)";

  return L.divIcon({
    className: "custom-price-marker",
    html: `<div style="
      background: ${bg};
      color: ${text};
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      font-family: Inter, system-ui, sans-serif;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      border: 1.5px solid ${border};
      cursor: pointer;
      transform: translate(-50%, -50%);
    ">€${price}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
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
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
}

function ClusteredMarkers({
  listings,
  activeListing,
  onMarkerClick,
}: {
  listings: Listing[];
  activeListing: string | null;
  onMarkerClick: (listing: Listing) => void;
}) {
  const map = useMap();
  const clusterGroupRef = useRef<any>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!clusterGroupRef.current) {
      clusterGroupRef.current = (L as any).markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div style="
              background: hsl(0, 0%, 13%);
              color: white;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 13px;
              font-weight: 600;
              font-family: Inter, system-ui, sans-serif;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              border: 2px solid white;
            ">${count}</div>`,
            className: "custom-cluster-icon",
            iconSize: L.point(36, 36),
            iconAnchor: L.point(18, 18),
          });
        },
      });
      map.addLayer(clusterGroupRef.current);
    }

    const group = clusterGroupRef.current;
    const existingMarkers = markersRef.current;
    const newMarkerMap = new Map<string, L.Marker>();

    // Remove markers that no longer exist
    existingMarkers.forEach((marker, id) => {
      if (!listings.find((l) => l.id === id)) {
        group.removeLayer(marker);
      }
    });

    listings.forEach((listing) => {
      const isActive = activeListing === listing.id;
      const existing = existingMarkers.get(listing.id);

      if (existing) {
        existing.setIcon(createPriceIcon(listing.price, isActive));
        newMarkerMap.set(listing.id, existing);
      } else {
        const marker = L.marker([listing.lat, listing.lng], {
          icon: createPriceIcon(listing.price, isActive),
        });
        marker.on("click", () => onMarkerClick(listing));
        group.addLayer(marker);
        newMarkerMap.set(listing.id, marker);
      }
    });

    markersRef.current = newMarkerMap;
  }, [listings, activeListing, onMarkerClick, map]);

  // Update active marker icon
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const listing = listings.find((l) => l.id === id);
      if (listing) {
        marker.setIcon(createPriceIcon(listing.price, activeListing === id));
      }
    });
  }, [activeListing, listings]);

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
        <ClusteredMarkers
          listings={listings}
          activeListing={activeListing}
          onMarkerClick={onMarkerClick}
        />
      </MapContainer>
      <CenterPin />
      <SearchAreaButton visible={showSearchArea} onClick={onSearchArea} />
    </div>
  );
};

export default ListingsMap;
