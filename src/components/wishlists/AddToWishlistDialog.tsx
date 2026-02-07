import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { useWishlists, useAddToWishlist } from "@/hooks/useWishlists";
import CreateWishlistDialog from "./CreateWishlistDialog";

interface AddToWishlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
}

const AddToWishlistDialog = ({
  open,
  onOpenChange,
  listingId,
}: AddToWishlistDialogProps) => {
  const { data: wishlists = [], isLoading } = useWishlists();
  const addToWishlist = useAddToWishlist();
  const [showCreate, setShowCreate] = useState(false);
  const [addedTo, setAddedTo] = useState<string | null>(null);

  const handleAdd = async (wishlistId: string) => {
    await addToWishlist.mutateAsync({ wishlistId, listingId });
    setAddedTo(wishlistId);
    setTimeout(() => onOpenChange(false), 600);
  };

  const handleCreated = async (wishlistId: string) => {
    await addToWishlist.mutateAsync({ wishlistId, listingId });
    setAddedTo(wishlistId);
    setTimeout(() => onOpenChange(false), 600);
  };

  return (
    <>
      <Dialog open={open && !showCreate} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              Αποθήκευση σε λίστα
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-2 max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Φόρτωση...
              </p>
            ) : (
              <>
                {wishlists.map((wl) => (
                  <button
                    key={wl.id}
                    onClick={() => handleAdd(wl.id)}
                    disabled={addToWishlist.isPending}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-accent transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {wl.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {wl.item_count} αποθηκευμένα
                      </p>
                    </div>
                    {addedTo === wl.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCreate(true)}
            className="w-full rounded-xl gap-2"
          >
            <Plus className="w-4 h-4" />
            Δημιουργία νέας λίστας
          </Button>
        </DialogContent>
      </Dialog>

      <CreateWishlistDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={handleCreated}
      />
    </>
  );
};

export default AddToWishlistDialog;
