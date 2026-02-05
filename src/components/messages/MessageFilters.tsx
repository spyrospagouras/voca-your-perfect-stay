import { useState } from "react";

const filters = [
  { id: "all", label: "Όλα" },
  { id: "hosting", label: "Φιλοξενία" },
  { id: "trips", label: "Ταξίδια" },
  { id: "support", label: "Υποστήριξη" },
];

const MessageFilters = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="overflow-x-auto scrollbar-hide py-3">
      <div className="flex gap-2 px-4">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MessageFilters;
