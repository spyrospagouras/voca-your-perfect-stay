import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  listingId: string | null;
  listingTitle: string | null;
  listingImage: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
}

async function fetchConversations(): Promise<Conversation[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error || !messages || messages.length === 0) return [];

  // Group by the other user + listing combo
  const convMap = new Map<string, typeof messages[0]>();
  for (const msg of messages) {
    const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
    const key = `${otherUserId}_${msg.listing_id ?? "none"}`;
    if (!convMap.has(key)) {
      convMap.set(key, msg);
    }
  }

  // Fetch profiles and listings for the conversations
  const otherUserIds = [...new Set([...convMap.values()].map(m => m.sender_id === user.id ? m.receiver_id : m.sender_id).filter(Boolean))] as string[];
  const listingIds = [...new Set([...convMap.values()].map(m => m.listing_id).filter(Boolean))] as string[];

  const [profilesRes, listingsRes] = await Promise.all([
    otherUserIds.length > 0
      ? supabase.from("profiles").select("id, full_name, avatar_url").in("id", otherUserIds)
      : Promise.resolve({ data: [] }),
    listingIds.length > 0
      ? supabase.from("listings").select("id, title, images").in("id", listingIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap = new Map((profilesRes.data ?? []).map(p => [p.id, p]));
  const listingMap = new Map((listingsRes.data ?? []).map(l => [l.id, l]));

  const conversations: Conversation[] = [];
  for (const [key, msg] of convMap) {
    const otherUserId = (msg.sender_id === user.id ? msg.receiver_id : msg.sender_id) as string;
    const profile = profileMap.get(otherUserId);
    const listing = msg.listing_id ? listingMap.get(msg.listing_id) : null;

    conversations.push({
      id: key,
      otherUserId,
      otherUserName: profile?.full_name ?? "Χρήστης",
      otherUserAvatar: profile?.avatar_url ?? null,
      listingId: msg.listing_id,
      listingTitle: listing?.title ?? null,
      listingImage: listing?.images?.[0] ?? null,
      lastMessage: msg.content,
      lastMessageAt: msg.created_at ?? "",
      unread: msg.receiver_id === user.id && msg.sender_id !== user.id,
    });
  }

  return conversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function useConversations() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as any;
          if (msg.sender_id === userId || msg.receiver_id === userId) {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
}
