import { MapPin, Loader2 } from "lucide-react";
import type { PhotonResult } from "@/hooks/usePhotonSearch";

interface PhotonDropdownProps {
  results: PhotonResult[];
  loading: boolean;
  visible: boolean;
  onSelect: (result: PhotonResult) => void;
}

const PhotonDropdown = ({ results, loading, visible, onSelect }: PhotonDropdownProps) => {
  if (!visible) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden max-h-[260px] overflow-y-auto">
      {loading && (
        <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Αναζήτηση...</span>
        </div>
      )}
      {!loading && results.length === 0 && (
        <div className="px-4 py-3 text-sm text-muted-foreground">
          Δεν βρέθηκαν αποτελέσματα
        </div>
      )}
      {results.map((r, i) => (
        <button
          key={`${r.lat}-${r.lng}-${i}`}
          onClick={() => onSelect(r)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
            {r.displayName !== r.name && (
              <p className="text-xs text-muted-foreground truncate">{r.displayName}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default PhotonDropdown;
