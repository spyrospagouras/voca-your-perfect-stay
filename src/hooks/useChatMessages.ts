import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string | null;
  created_at: string;
  isMine: boolean;
}

export function useChatMessages(otherUserId: string, listingId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["chat-messages", otherUserId, listingId],
    queryFn: async (): Promise<ChatMessage[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let q = supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (listingId) {
        q = q.eq("listing_id", listingId);
      }

      const { data, error } = await q;
      if (error) throw error;

      return (data ?? []).map((m) => ({
        ...m,
        sender_id: m.sender_id!,
        receiver_id: m.receiver_id!,
        isMine: m.sender_id === user.id,
      }));
    },
    enabled: !!otherUserId,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("messages").insert({
        content,
        sender_id: user.id,
        receiver_id: otherUserId,
        listing_id: listingId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", otherUserId, listingId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return { ...query, sendMessage };
}
