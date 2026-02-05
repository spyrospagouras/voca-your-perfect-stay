import SearchBar from "@/components/home/SearchBar";
import CategoryTabs from "@/components/home/CategoryTabs";
import PropertySection from "@/components/home/PropertySection";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import listing5 from "@/assets/listing-5.jpg";
import listing6 from "@/assets/listing-6.jpg";

const athensProperties = [
  {
    id: 1,
    image: listing1,
    title: "Μεταξουργείο — Δωμάτιο",
    dates: "24-26 Απρ",
    hostType: "Επαγγελματίας οικοδεσπότης",
    price: 120,
    rating: 4.9,
  },
  {
    id: 2,
    image: listing2,
    title: "Κουκάκι — Διαμέρισμα",
    dates: "1-3 Μαΐ",
    hostType: "Superhost",
    price: 185,
    rating: 4.8,
  },
  {
    id: 3,
    image: listing3,
    title: "Πλάκα — Στούντιο",
    dates: "10-12 Μαΐ",
    hostType: "Επαγγελματίας οικοδεσπότης",
    price: 95,
    rating: 4.7,
  },
  {
    id: 4,
    image: listing4,
    title: "Μοναστηράκι — Loft",
    dates: "15-17 Μαΐ",
    hostType: "Superhost",
    price: 210,
    rating: 5.0,
  },
];

const madridProperties = [
  {
    id: 5,
    image: listing5,
    title: "Gran Vía — Boutique Hotel",
    dates: "20-23 Απρ",
    hostType: "Ξενοδοχείο",
    price: 320,
    rating: 4.9,
  },
  {
    id: 6,
    image: listing6,
    title: "Malasaña — Design Hotel",
    dates: "5-8 Μαΐ",
    hostType: "Ξενοδοχείο",
    price: 275,
    rating: 4.8,
  },
  {
    id: 7,
    image: listing1,
    title: "Salamanca — Luxury Suite",
    dates: "12-15 Μαΐ",
    hostType: "Ξενοδοχείο",
    price: 450,
    rating: 4.9,
  },
  {
    id: 8,
    image: listing2,
    title: "Chueca — Boutique Room",
    dates: "18-21 Μαΐ",
    hostType: "Ξενοδοχείο",
    price: 195,
    rating: 4.7,
  },
];

const Index = () => {
  return (
    <div className="bg-background min-h-full">
      <SearchBar />
      <CategoryTabs />
      
      <div className="divide-y divide-border">
        <PropertySection
          title="Δημοφιλή καταλύματα σε Αθήνα"
          properties={athensProperties}
        />
        
        <PropertySection
          title="Προτεινόμενα ξενοδοχεία στην περιοχή Μαδρίτη"
          subtitle="Μια συλλογή με ανεξάρτητα και προσεκτικά επιλεγμένα ξενοδοχεία"
          properties={madridProperties}
        />
      </div>
    </div>
  );
};

export default Index;
