import { Button } from "@/components/ui/button";
import WishlistCard from "@/components/wishlists/WishlistCard";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import listing5 from "@/assets/listing-5.jpg";
import listing6 from "@/assets/listing-6.jpg";

const wishlists = [
  {
    id: 1,
    title: "Πρόσφατες εμφανίσεις",
    subtitle: "Πριν από 3 εβδομάδες",
    images: [listing1, listing2, listing3, listing4],
  },
  {
    id: 2,
    title: "Άνδρος Μπατσί",
    subtitle: "27 αποθηκευμένα",
    images: [listing5, listing6, listing1, listing2],
  },
  {
    id: 3,
    title: "Καλοκαίρι 2025",
    subtitle: "12 αποθηκευμένα",
    images: [listing3, listing4, listing5, listing6],
  },
  {
    id: 4,
    title: "Σαντορίνη",
    subtitle: "8 αποθηκευμένα",
    images: [listing2, listing1, listing6, listing5],
  },
];

const Wishlists = () => {
  return (
    <div className="px-4 py-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Λίστες αγαπημένων
        </h1>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full px-4 text-sm font-medium"
        >
          Επεξεργασία
        </Button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 gap-4">
        {wishlists.map((wishlist) => (
          <WishlistCard
            key={wishlist.id}
            title={wishlist.title}
            subtitle={wishlist.subtitle}
            images={wishlist.images}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlists;
