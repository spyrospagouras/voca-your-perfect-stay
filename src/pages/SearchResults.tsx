import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, MapIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { el } from "date-fns/locale";
import type { LatLngBounds } from "leaflet";
import type { Listing } from "@/data/mockListings";
import { usePhotonSearch } from "@/hooks/usePhotonSearch";
import { useSupabaseListings } from "@/hooks/useSupabaseListings";
import ListingsMap from "@/components/map/ListingsMap";
import ListingCard from "@/components/results/ListingCard";
import BottomSheet from "@/components/results/BottomSheet";
import PropertyCardSheet from "@/components/results/PropertyCardSheet";
import BottomNavigation from "@/components/layout/BottomNavigation";

const DEFAULT_CENTER: [number, number] = [37.9755, 23.7348];
const DEFAULT_ZOOM = 12;

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reverseGeocode } = usePhotonSearch();

  const initialLat = parseFloat(searchParams.get("lat") || String(DEFAULT_CENTER[0]));
  const initialLng = parseFloat(searchParams.get("lng") || String(DEFAULT_CENTER[1]));
  const initialZoom = parseInt(searchParams.get("zoom") || String(DEFAULT_ZOOM), 10);
  const initialName = searchParams.get("name") || "";
  const guestsParam = parseInt(searchParams.get("guests") || "0", 10);
  const checkIn = searchParams.get("checkIn") || undefined;
  const checkOut = searchParams.get("checkOut") || undefined;

  const [center, setCenter] = useState<[number, number]>([initialLat, initialLng]);
  const [zoom] = useState(initialZoom);
  const [locationName, setLocationName] = useState(initialName);
  const [activeListing, setActiveListing] = useState<string | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const moveCountRef = useRef(0);

  const { listings: allListings, loading, fetchListings } = useSupabaseListings();

  useEffect(() => {
    fetchListings({ guests: guestsParam, checkIn, checkOut });
  }, [fetchListings, guestsParam, checkIn, checkOut]);

  const visibleListings = useMemo(() => {
    if (!bounds) return allListings;
    return allListings.filter((l) => bounds.contains([l.lat, l.lng]));
  }, [bounds, allListings]);

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

  // Build search summary for floating bar
  let searchSummary = "";
  if (checkIn && checkOut) {
    try {
      const d1 = parseISO(checkIn);
      const d2 = parseISO(checkOut);
      searchSummary = `${format(d1, "d MMM", { locale: el })} - ${format(d2, "d MMM", { locale: el })}`;
    } catch {
      searchSummary = "";
    }
  }
  if (guestsParam > 0) {
    searchSummary += searchSummary
      ? ` · ${guestsParam} ${guestsParam === 1 ? "επισκέπτης" : "επισκέπτες"}`
      : `${guestsParam} ${guestsParam === 1 ? "επισκέπτης" : "επισκέπτες"}`;
  }

  const sheetHeader = (
    <div>
      <p className="text-base font-semibold text-foreground">
        {loading
          ? "Φόρτωση..."
          : visibleListings.length > 1000
          ? "Πάνω από 1.000 καταλύματα"
          : `${visibleListings.length} καταλύματα`}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Floating Search Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1001] px-4 pt-3 pb-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto max-w-lg mx-auto md:max-w-none md:mx-0">
          <button
            onClick={() => navigate("/search")}
            className="flex-1 flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2.5 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Search className="w-4 h-4 text-foreground shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-foreground truncate">
                {locationName || "Αναζήτηση"}
              </p>
              {searchSummary && (
                <p className="text-xs text-muted-foreground truncate">{searchSummary}</p>
              )}
            </div>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop: listings sidebar */}
        <div className="hidden md:flex flex-col w-[400px] lg:w-[440px] border-r border-border overflow-y-auto pt-16">
          <div className="px-4 pb-2">
            <p className="text-sm font-semibold text-foreground">
              {loading
                ? "Φόρτωση..."
                : visibleListings.length > 1000
                ? "Πάνω από 1.000 καταλύματα"
                : `${visibleListings.length} καταλύματα`}
            </p>
          </div>
          {visibleListings.length === 0 && !loading ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MapIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Δεν βρέθηκαν καταλύματα στην περιοχή
              </h3>
              <p className="text-sm text-muted-foreground">
                Δοκιμάστε να μετακινήσετε τον χάρτη ή να αναζητήσετε μια διαφορετική περιοχή
              </p>
            </div>
          ) : (
            <div className="p-3 grid grid-cols-1 gap-3">
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

        {/* Map */}
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

        {/* Mobile: Bottom Sheet */}
        <BottomSheet headerContent={sheetHeader} collapsedHeight={220} bottomOffset={64}>
          {visibleListings.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MapIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Δεν βρέθηκαν καταλύματα στην περιοχή
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

      {/* Bottom Navigation */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default SearchResults;
