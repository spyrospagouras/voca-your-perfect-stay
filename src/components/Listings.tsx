import PropertyCard from "./PropertyCard";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import listing5 from "@/assets/listing-5.jpg";
import listing6 from "@/assets/listing-6.jpg";

const listings = [
  {
    id: 1,
    images: [listing1],
    location: "Μύκονος, Ελλάδα",
    distance: "258 χλμ μακριά",
    dates: "15-20 Μαρ",
    price: 245,
    rating: 4.92,
    isSuperhost: true,
  },
  {
    id: 2,
    images: [listing2],
    location: "Ζερμάτ, Ελβετία",
    distance: "1.456 χλμ μακριά",
    dates: "1-6 Απρ",
    price: 380,
    rating: 4.88,
    isSuperhost: false,
  },
  {
    id: 3,
    images: [listing3],
    location: "Νέα Υόρκη, ΗΠΑ",
    distance: "7.892 χλμ μακριά",
    dates: "22-27 Μαρ",
    price: 520,
    rating: 4.95,
    isSuperhost: true,
  },
  {
    id: 4,
    images: [listing4],
    location: "Κότσγουολντς, Αγγλία",
    distance: "2.134 χλμ μακριά",
    dates: "8-13 Απρ",
    price: 175,
    rating: 4.78,
    isSuperhost: false,
  },
  {
    id: 5,
    images: [listing5],
    location: "Ουμπούντ, Μπαλί",
    distance: "9.456 χλμ μακριά",
    dates: "5-10 Μαΐ",
    price: 195,
    rating: 4.97,
    isSuperhost: true,
  },
  {
    id: 6,
    images: [listing6],
    location: "Σαντορίνη, Ελλάδα",
    distance: "312 χλμ μακριά",
    dates: "18-23 Μαρ",
    price: 310,
    rating: 4.91,
    isSuperhost: true,
  },
];

const Listings = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing, index) => (
            <div key={listing.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <PropertyCard {...listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Listings;
