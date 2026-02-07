import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateWishlist } from "@/hooks/useWishlists";

interface CreateWishlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** If provided, after creating the wishlist, auto-add this listing */
  onCreated?: (wishlistId: string) => void;
}

const CreateWishlistDialog = ({
  open,
  onOpenChange,
  onCreated,
}: CreateWishlistDialogProps) => {
  const [name, setName] = useState("");
  const createWishlist = useCreateWishlist();

  const handleSave = async () => {
    if (!name.trim()) return;
    const result = await createWishlist.mutateAsync(name.trim());
    setName("");
    onOpenChange(false);
    onCreated?.(result.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Νέα λίστα αγαπημένων
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Όνομα λίστας
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="π.χ. Άνδρος Μπατσί"
              className="rounded-xl"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || createWishlist.isPending}
            className="w-full rounded-xl"
          >
            {createWishlist.isPending ? "Αποθήκευση..." : "Αποθήκευση"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWishlistDialog;
