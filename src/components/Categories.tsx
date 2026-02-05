import { useState } from "react";
import { Waves, Mountain, Building2, TreePine, Sailboat, Castle, Tent, Flame } from "lucide-react";

const categories = [
  { id: "beach", icon: Waves, label: "Παραλία" },
  { id: "mountain", icon: Mountain, label: "Βουνό" },
  { id: "city", icon: Building2, label: "Πόλη" },
  { id: "countryside", icon: TreePine, label: "Εξοχή" },
  { id: "lakefront", icon: Sailboat, label: "Λίμνη" },
  { id: "castle", icon: Castle, label: "Κάστρα" },
  { id: "camping", icon: Tent, label: "Κάμπινγκ" },
  { id: "trending", icon: Flame, label: "Δημοφιλή" },
];

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState("beach");

  return (
    <section className="py-6 border-b border-border bg-card sticky top-[72px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center gap-2 min-w-fit pb-2 transition-all duration-200 ${
                  isActive
                    ? "text-foreground border-b-2 border-foreground"
                    : "text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium whitespace-nowrap">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
