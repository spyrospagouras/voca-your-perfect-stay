import { useState } from "react";
import { Home, Tent, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "accommodations", icon: Home, label: "Καταλύματα", isNew: false },
  { id: "experiences", icon: Tent, label: "Εμπειρίες", isNew: true },
  { id: "services", icon: Bell, label: "Υπηρεσίες", isNew: true },
];

const CategoryTabs = () => {
  const [activeCategory, setActiveCategory] = useState("accommodations");

  return (
    <div className="px-4 py-3 border-b border-border">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex flex-col items-center gap-1.5 min-w-fit pb-2 transition-all duration-200 relative ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {category.label}
                </span>
                {category.isNew && (
                  <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0 h-4 hover:bg-blue-500">
                    ΝΕΟ
                  </Badge>
                )}
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
