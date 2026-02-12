import { useState, useCallback } from "react";

export interface RecentSearch {
  locationName: string;
  lat?: number;
  lng?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  timestamp: number;
}

const STORAGE_KEY = "recent_searches";
const MAX_ITEMS = 3;

const formatDateShort = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

export const formatRecentSubtext = (search: RecentSearch): string => {
  const parts: string[] = [];
  if (search.checkIn) {
    const range = search.checkOut
      ? `${formatDateShort(search.checkIn)} – ${formatDateShort(search.checkOut)}`
      : formatDateShort(search.checkIn);
    parts.push(range);
  }
  if (search.guests && search.guests > 0) {
    parts.push(`${search.guests} επισκέπτ${search.guests === 1 ? "ης" : "ες"}`);
  }
  return parts.join(" • ");
};

const load = (): RecentSearch[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (list: RecentSearch[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const useRecentSearches = () => {
  const [searches, setSearches] = useState<RecentSearch[]>(load);

  const addSearch = useCallback((entry: Omit<RecentSearch, "timestamp">) => {
    if (!entry.locationName) return;
    const list = load().filter(
      (s) =>
        !(
          s.locationName === entry.locationName &&
          s.checkIn === entry.checkIn &&
          s.checkOut === entry.checkOut &&
          s.guests === entry.guests
        )
    );
    const updated = [{ ...entry, timestamp: Date.now() }, ...list].slice(0, MAX_ITEMS);
    save(updated);
    setSearches(updated);
  }, []);

  return { searches, addSearch };
};
