import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search, Clock, Navigation, MapPin, ChevronRight, Calendar, Users } from "lucide-react";

const tabs = ["Καταλύματα", "Εμπειρίες", "Υπηρεσίες"];

const SearchOverlay = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Καταλύματα");
  const [query, setQuery] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F7F7] flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8" />
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-foreground border-b-2 border-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-background shadow-sm"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {/* Where Card */}
        <div className="bg-card rounded-[24px] shadow-sm border border-border p-5">
          <h2 className="text-[22px] font-bold text-foreground mb-3">Πού;</h2>
          <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3 mb-5">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Αναζήτηση προορισμών"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              maxLength={200}
            />
          </div>

          {/* Recent Searches */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Πρόσφατες αναζητήσεις
            </p>
            <button className="w-full flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">Κυκλάδες</p>
                <p className="text-xs text-muted-foreground">1-4 Ιουν • 4 επισκέπτες</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Recommended */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Προτεινόμενοι προορισμοί
            </p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">Σε κοντινή απόσταση</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">Θεσσαλονίκη, Κεντρική Μακεδονία</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* When */}
        <div className="bg-card rounded-2xl shadow-sm border border-border px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Πότε;</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Προσθέστε ημερομηνίες</span>
          </div>
        </div>

        {/* Who */}
        <div className="bg-card rounded-2xl shadow-sm border border-border px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Ποιος;</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Προσθήκη επισκεπτών</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background border-t border-border px-4 py-3 flex items-center justify-between">
        <button className="text-sm font-semibold text-foreground underline">
          Εκκαθάριση όλων
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-[#FF385C] text-white rounded-full px-6 py-3 font-semibold text-sm hover:bg-[#E31C5F] transition-colors"
        >
          <Search className="w-4 h-4" />
          Αναζήτηση
        </button>
      </div>
    </div>
  );
};

export default SearchOverlay;
