import { useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, MapIcon, Info } from "lucide-react";
import type { LatLngBounds } from "leaflet";
import { mockListings, type Listing } from "@/data/mockListings";
import { usePhotonSearch } from "@/hooks/usePhotonSearch";
import ListingsMap from "@/components/map/ListingsMap";
import ListingCard from "@/components/results/ListingCard";
import BottomSheet from "@/components/results/BottomSheet";
import PropertyCardSheet from "@/components/results/PropertyCardSheet";
import BottomNavigation from "@/components/layout/BottomNavigation";

const DEFAULT_CENTER: [number, number] = [37.9755, 23.7348]; // Athens
const DEFAULT_ZOOM = 12;

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reverseGeocode } = usePhotonSearch();

  const initialLat = parseFloat(searchParams.get("lat") || String(DEFAULT_CENTER[0]));
  const initialLng = parseFloat(searchParams.get("lng") || String(DEFAULT_CENTER[1]));
  const initialZoom = parseInt(searchParams.get("zoom") || String(DEFAULT_ZOOM), 10);
  const initialName = searchParams.get("name") || "";

  const [center, setCenter] = useState<[number, number]>([initialLat, initialLng]);
  const [zoom] = useState(initialZoom);
  const [locationName, setLocationName] = useState(initialName);
  const [activeListing, setActiveListing] = useState<string | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const moveCountRef = useRef(0);

  const visibleListings = useMemo(() => {
    if (!bounds) return [];
    return mockListings.filter((l) => bounds.contains([l.lat, l.lng]));
  }, [bounds]);

  const handleBoundsChange = useCallback((newBounds: LatLngBounds) => {
    setBounds(newBounds);
  }, []);

  const handleCenterChange = useCallback(
    async (lat: number, lng: number) => {
      moveCountRef.current += 1;
      if (moveCountRef.current > 1) {
        setShowSearchArea(true);
      }
      const name = await reverseGeocode(lat, lng);
      if (name) setLocationName(name);
    },
    [reverseGeocode]
  );

  const handleSearchArea = useCallback(() => {
    setShowSearchArea(false);
  }, []);

  const handleMarkerClick = useCallback((listing: Listing) => {
    setActiveListing(listing.id);
  }, []);

  const sheetHeader = (
    <div>
      <p className="text-base font-semibold text-foreground">
        {visibleListings.length} καταλύματα
      </p>
      <button className="flex items-center gap-1 mt-0.5">
        <span className="text-xs text-muted-foreground underline">
          Πώς ταξινομούμε αποτελέσματα
        </span>
        <Info className="w-3 h-3 text-muted-foreground" />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate("/search")}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {locationName || "Αποτελέσματα"}
          </p>
          <p className="text-xs text-muted-foreground">
            {visibleListings.length} καταλύματα
          </p>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:bg-accent transition-colors">
          <SlidersHorizontal className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop: listings sidebar */}
        <div className="hidden md:flex flex-col w-[400px] lg:w-[440px] border-r border-border overflow-y-auto">
          {visibleListings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MapIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Δεν βρέθηκαν καταλύματα
              </h3>
              <p className="text-sm text-muted-foreground">
                Δοκιμάστε να μετακινήσετε τον χάρτη ή να αναζητήσετε μια διαφορετική περιοχή
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-1">
              {visibleListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isActive={activeListing === listing.id}
                  onHover={setActiveListing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Map - full width on mobile, flex-1 on desktop */}
        <div className="flex-1">
          <ListingsMap
            listings={visibleListings}
            center={center}
            zoom={zoom}
            onBoundsChange={handleBoundsChange}
            onCenterChange={handleCenterChange}
            activeListing={activeListing}
            onMarkerClick={handleMarkerClick}
            showSearchArea={showSearchArea}
            onSearchArea={handleSearchArea}
          />
        </div>

        {/* Mobile: Bottom Sheet over the map */}
        <BottomSheet headerContent={sheetHeader} collapsedHeight={220} bottomOffset={64}>
          {visibleListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MapIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Δεν βρέθηκαν καταλύματα
              </h3>
              <p className="text-sm text-muted-foreground">
                Μετακινήστε τον χάρτη για να βρείτε καταλύματα
              </p>
            </div>
          ) : (
            visibleListings.map((listing) => (
              <PropertyCardSheet key={listing.id} listing={listing} />
            ))
          )}
        </BottomSheet>
      </div>

      {/* Bottom Navigation - always visible */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default SearchResults;
