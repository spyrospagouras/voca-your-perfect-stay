import { useState, useCallback, useRef } from "react";

export interface PhotonResult {
  name: string;
  city?: string;
  state?: string;
  country?: string;
  lat: number;
  lng: number;
  displayName: string;
}

export function usePhotonSearch() {
  const [results, setResults] = useState<PhotonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!query || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=default`,
          { signal: controller.signal }
        );
        const data = await res.json();

        const mapped: PhotonResult[] = (data.features || []).map((f: any) => {
          const p = f.properties;
          const parts = [p.name, p.city, p.state, p.country].filter(Boolean);
          return {
            name: p.name || "",
            city: p.city,
            state: p.state,
            country: p.country,
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            displayName: parts.join(", "),
          };
        });

        setResults(mapped);
      } catch (e: any) {
        if (e.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&limit=1&lang=default`
      );
      const data = await res.json();
      if (data.features?.length) {
        const p = data.features[0].properties;
        const parts = [p.name, p.city || p.county, p.state].filter(Boolean);
        return parts.join(", ");
      }
    } catch {
      // ignore
    }
    return "";
  }, []);

  const clearResults = useCallback(() => setResults([]), []);

  return { results, loading, search, reverseGeocode, clearResults };
}
