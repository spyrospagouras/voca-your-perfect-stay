import { useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, MapIcon, List } from "lucide-react";
import type { LatLngBounds } from "leaflet";
import { mockListings, type Listing } from "@/data/mockListings";
import { usePhotonSearch } from "@/hooks/usePhotonSearch";
import ListingsMap from "@/components/map/ListingsMap";
import ListingCard from "@/components/results/ListingCard";

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
  const [showMap, setShowMap] = useState(true); // mobile toggle
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
      // Reverse geocode
      const name = await reverseGeocode(lat, lng);
      if (name) setLocationName(name);
    },
    [reverseGeocode]
  );

  const handleSearchArea = useCallback(() => {
    setShowSearchArea(false);
    // bounds already updated via onBoundsChange
  }, []);

  const handleMarkerClick = useCallback((listing: Listing) => {
    setActiveListing(listing.id);
  }, []);

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

      {/* Desktop: split view, Mobile: toggle */}
      <div className="flex-1 flex overflow-hidden">
        {/* Listings panel - hidden on mobile when map is shown */}
        <div
          className={`${
            showMap ? "hidden md:flex" : "flex"
          } flex-col w-full md:w-[400px] lg:w-[440px] border-r border-border overflow-y-auto`}
        >
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

        {/* Map - hidden on mobile when list is shown */}
        <div className={`${showMap ? "flex" : "hidden md:flex"} flex-1`}>
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
      </div>

      {/* Mobile toggle button */}
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1001]">
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-3 text-sm font-semibold shadow-lg"
        >
          {showMap ? (
            <>
              <List className="w-4 h-4" />
              Λίστα
            </>
          ) : (
            <>
              <MapIcon className="w-4 h-4" />
              Χάρτης
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
