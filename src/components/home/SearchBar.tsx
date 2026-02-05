import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="px-4 pt-4 pb-2">
      <button className="w-full flex items-center gap-3 bg-card border border-border rounded-full px-4 py-3 shadow-md hover:shadow-lg transition-shadow">
        <Search className="w-5 h-5 text-foreground" />
        <span className="text-muted-foreground text-sm">Αναζήτηση καταλυμάτων</span>
      </button>
    </div>
  );
};

export default SearchBar;
