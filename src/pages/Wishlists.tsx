import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import WishlistCard from "@/components/wishlists/WishlistCard";
import CreateWishlistDialog from "@/components/wishlists/CreateWishlistDialog";
import { useWishlists } from "@/hooks/useWishlists";

const Wishlists = () => {
  const { data: wishlists = [], isLoading } = useWishlists();
  const [showCreate, setShowCreate] = useState(false);
  const isEmpty = !isLoading && wishlists.length === 0;

  return (
    <div className="px-4 py-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Αγαπημένα
        </h1>
        {!isEmpty && (
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full px-4 text-sm font-medium"
            onClick={() => setShowCreate(true)}
          >
            + Νέα λίστα
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-square rounded-[20px] bg-muted animate-pulse" />
          ))}
        </div>
      ) : isEmpty ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center pt-20 px-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Αγαπημένα
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-[280px]">
            Δημιουργήστε την πρώτη σας λίστα αγαπημένων για να αποθηκεύσετε τα καταλύματα που σας αρέσουν
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            className="rounded-xl px-6"
          >
            Δημιουργία νέας λίστας
          </Button>
        </div>
      ) : (
        /* Active State - Grid */
        <div className="grid grid-cols-2 gap-4">
          {wishlists.map((wl) => (
            <WishlistCard
              key={wl.id}
              title={wl.name}
              subtitle={`${wl.item_count} αποθηκευμένα`}
              images={wl.first_image ? [wl.first_image] : []}
            />
          ))}
        </div>
      )}

      <CreateWishlistDialog
        open={showCreate}
        onOpenChange={setShowCreate}
      />
    </div>
  );
};

export default Wishlists;
