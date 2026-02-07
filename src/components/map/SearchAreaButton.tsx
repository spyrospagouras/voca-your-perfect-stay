import { RotateCw } from "lucide-react";

interface SearchAreaButtonProps {
  visible: boolean;
  onClick: () => void;
}

const SearchAreaButton = ({ visible, onClick }: SearchAreaButtonProps) => {
  if (!visible) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
      <button
        onClick={onClick}
        className="flex items-center gap-2 bg-card text-foreground border border-border rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg hover:bg-accent transition-colors"
      >
        <RotateCw className="w-4 h-4" />
        Αναζήτηση σε αυτή την περιοχή
      </button>
    </div>
  );
};

export default SearchAreaButton;
