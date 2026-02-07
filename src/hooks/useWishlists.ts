import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WishlistWithCount {
  id: string;
  name: string;
  created_at: string | null;
  item_count: number;
  first_image: string | null;
}

export const useWishlists = () => {
  return useQuery({
    queryKey: ["wishlists"],
    queryFn: async (): Promise<WishlistWithCount[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: wishlists, error } = await supabase
        .from("wishlists")
        .select("id, name, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!wishlists?.length) return [];

      // Get item counts and first listing image for each wishlist
      const results: WishlistWithCount[] = [];
      for (const wl of wishlists) {
        const { data: items } = await supabase
          .from("wishlist_items")
          .select("listing_id")
          .eq("wishlist_id", wl.id);

        let first_image: string | null = null;
        if (items?.length) {
          const { data: listing } = await supabase
            .from("listings")
            .select("images")
            .eq("id", items[0].listing_id)
            .maybeSingle();
          if (listing?.images?.length) {
            first_image = listing.images[0];
          }
        }

        results.push({
          ...wl,
          item_count: items?.length ?? 0,
          first_image,
        });
      }

      return results;
    },
  });
};

export const useCreateWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("wishlists")
        .insert({ name, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wishlistId, listingId }: { wishlistId: string; listingId: string }) => {
      const { error } = await supabase
        .from("wishlist_items")
        .insert({ wishlist_id: wishlistId, listing_id: listingId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wishlistId, listingId }: { wishlistId: string; listingId: string }) => {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("wishlist_id", wishlistId)
        .eq("listing_id", listingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
  });
};
