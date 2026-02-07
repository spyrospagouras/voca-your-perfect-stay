import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search, Clock, Navigation, MapPin, ChevronRight, Calendar, Users, Minus, Plus } from "lucide-react";
import DateCalendar from "@/components/search/DateCalendar";
import { usePhotonSearch, type PhotonResult } from "@/hooks/usePhotonSearch";
import PhotonDropdown from "@/components/search/PhotonDropdown";

const tabs = ["Καταλύματα", "Εμπειρίες", "Υπηρεσίες"];
const DATE_TABS = ["Ημερομηνίες", "Μήνες", "Έχω ευελιξία"];
const FLEX_OPTIONS = ["Ακριβείς ημερομηνίες", "± 1 ημέρα", "± 2 ημέρες"];

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatDateShort = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;

const SearchOverlay = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Καταλύματα");
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<PhotonResult | null>(null);
  const { results: photonResults, loading: photonLoading, search: photonSearch, clearResults } = usePhotonSearch();
  const [showPhotonDropdown, setShowPhotonDropdown] = useState(false);
  const [expandedSection, setExpandedSection] = useState<"where" | "when" | "who" | null>("where");
  const [guests, setGuests] = useState<GuestCounts>({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [dateTab, setDateTab] = useState("Ημερομηνίες");
  const [flexibility, setFlexibility] = useState("Ακριβείς ημερομηνίες");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const updateGuest = (key: keyof GuestCounts, delta: number) => {
    setGuests((prev) => {
      const next = { ...prev, [key]: Math.max(0, prev[key] + delta) };
      if (key !== "adults" && next[key] > 0 && next.adults === 0) next.adults = 1;
      if (key === "adults" && next.adults === 0 && (next.children > 0 || next.infants > 0 || next.pets > 0)) next.adults = 1;
      return next;
    });
  };

  const clearAll = () => {
    setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
    setQuery("");
    setStartDate(null);
    setEndDate(null);
    setFlexibility("Ακριβείς ημερομηνίες");
  };

  const totalGuests = guests.adults + guests.children;
  const guestSummary = totalGuests > 0
    ? `${totalGuests} επισκέπτ${totalGuests === 1 ? "ης" : "ες"}${guests.infants > 0 ? `, ${guests.infants} βρέφ${guests.infants === 1 ? "ος" : "η"}` : ""}${guests.pets > 0 ? `, ${guests.pets} κατοικίδι${guests.pets === 1 ? "ο" : "α"}` : ""}`
    : "";

  const dateSummary = startDate
    ? endDate && !isSameDay(startDate, endDate)
      ? `${formatDateShort(startDate)} – ${formatDateShort(endDate)}`
      : formatDateShort(startDate)
    : "";

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
        {/* Where */}
        {expandedSection === "where" ? (
          <div className="bg-card rounded-[24px] shadow-sm border border-border p-5">
            <h2 className="text-[22px] font-bold text-foreground mb-3">Πού;</h2>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3 mb-5">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Αναζήτηση προορισμών"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  photonSearch(e.target.value);
                  setShowPhotonDropdown(true);
                }}
                onFocus={() => query.length >= 2 && setShowPhotonDropdown(true)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                maxLength={200}
              />
            </div>
            <div className="relative mb-2">
              <PhotonDropdown
                results={photonResults}
                loading={photonLoading}
                visible={showPhotonDropdown && query.length >= 2}
                onSelect={(result) => {
                  setQuery(result.displayName);
                  setSelectedLocation(result);
                  setShowPhotonDropdown(false);
                  clearResults();
                  setExpandedSection("when");
                }}
              />
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Πρόσφατες αναζητήσεις</p>
              <button className="w-full flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><Clock className="w-5 h-5 text-muted-foreground" /></div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">Κυκλάδες</p>
                  <p className="text-xs text-muted-foreground">1-4 Ιουν • 4 επισκέπτες</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Προτεινόμενοι προορισμοί</p>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><Navigation className="w-5 h-5 text-muted-foreground" /></div>
                  <div className="flex-1 text-left"><p className="text-sm font-medium text-foreground">Σε κοντινή απόσταση</p></div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><MapPin className="w-5 h-5 text-green-600" /></div>
                  <div className="flex-1 text-left"><p className="text-sm font-medium text-foreground">Θεσσαλονίκη, Κεντρική Μακεδονία</p></div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => setExpandedSection("where")} className="w-full bg-card rounded-2xl shadow-sm border border-border px-5 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Πού;</span>
            <span className="text-sm text-muted-foreground">{query || "Οπουδήποτε"}</span>
          </button>
        )}

        {/* When */}
        {expandedSection === "when" ? (
          <div className="bg-card rounded-[24px] shadow-sm border border-border p-5">
            <h2 className="text-[22px] font-bold text-foreground mb-4">Πότε;</h2>

            {/* Date type tabs */}
            <div className="flex bg-muted rounded-full p-1 mb-5">
              {DATE_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setDateTab(t)}
                  className={`flex-1 text-xs font-medium py-2 rounded-full transition-colors ${
                    dateTab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <DateCalendar
              startDate={startDate}
              endDate={endDate}
              onSelect={(s, e) => { setStartDate(s); setEndDate(e); }}
            />

            {/* Flexibility pills */}
            <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
              {FLEX_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFlexibility(opt)}
                  className={`whitespace-nowrap text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
                    flexibility === opt
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Section footer */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
              <button
                onClick={() => { setStartDate(null); setEndDate(null); }}
                className="text-sm font-semibold text-foreground underline"
              >
                Επαναφορά
              </button>
              <button
                onClick={() => setExpandedSection("who")}
                className="bg-foreground text-background rounded-lg px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Επόμενο
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setExpandedSection("when")} className="w-full bg-card rounded-2xl shadow-sm border border-border px-5 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Πότε;</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{dateSummary || "Προσθέστε ημερομηνίες"}</span>
            </div>
          </button>
        )}

        {/* Who */}
        {expandedSection === "who" ? (
          <div className="bg-card rounded-[24px] shadow-sm border border-border p-5">
            <h2 className="text-[22px] font-bold text-foreground mb-3">Ποιος;</h2>
            <div className="divide-y divide-border">
              {([
                { key: "adults" as const, label: "Ενήλικες", sub: "Ηλικίας 13 ετών και άνω" },
                { key: "children" as const, label: "Παιδιά", sub: "Ηλικίας 2–12 ετών" },
                { key: "infants" as const, label: "Βρέφη", sub: "Κάτω των 2 ετών" },
                { key: "pets" as const, label: "Κατοικίδια", sub: undefined },
              ]).map((row) => (
                <div key={row.key} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-base font-medium text-foreground">{row.label}</p>
                    {row.sub ? (
                      <p className="text-xs text-muted-foreground mt-0.5">{row.sub}</p>
                    ) : (
                      <button className="text-xs text-foreground underline font-medium mt-0.5">Ταξιδεύετε με ζώο υπηρεσίας;</button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuest(row.key, -1)}
                      disabled={guests[row.key] === 0 || (row.key === "adults" && guests.adults <= 1 && (guests.children > 0 || guests.infants > 0 || guests.pets > 0))}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:border-foreground transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-foreground">{guests[row.key]}</span>
                    <button
                      onClick={() => updateGuest(row.key, 1)}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button onClick={() => setExpandedSection("who")} className="w-full bg-card rounded-2xl shadow-sm border border-border px-5 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Ποιος;</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{guestSummary || "Προσθήκη επισκεπτών"}</span>
            </div>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background border-t border-border px-4 py-3 flex items-center justify-between">
        <button onClick={clearAll} className="text-sm font-semibold text-foreground underline">
          Εκκαθάριση όλων
        </button>
        <button
          onClick={() => {
            const params = new URLSearchParams();
            if (selectedLocation) {
              params.set("lat", String(selectedLocation.lat));
              params.set("lng", String(selectedLocation.lng));
              params.set("name", selectedLocation.displayName);
              params.set("zoom", "13");
            }
            navigate(`/results?${params.toString()}`);
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Search className="w-4 h-4" />
          Αναζήτηση
        </button>
      </div>
    </div>
  );
};

export default SearchOverlay;
