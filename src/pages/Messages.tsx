import { Search, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageFilters from "@/components/messages/MessageFilters";
import ChatItem from "@/components/messages/ChatItem";
import { useConversations } from "@/hooks/useConversations";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";

const Messages = () => {
  const { data: conversations = [], isLoading } = useConversations();
  const navigate = useNavigate();

  const handleConversationClick = (conv: typeof conversations[0]) => {
    const params = new URLSearchParams({
      userId: conv.otherUserId,
      name: conv.otherUserName,
    });
    if (conv.listingId) params.set("listingId", conv.listingId);
    if (conv.otherUserAvatar) params.set("avatar", conv.otherUserAvatar);
    navigate(`/chat?${params.toString()}`);
  };

  const isEmpty = !isLoading && conversations.length === 0;

  return (
    <div className="bg-background min-h-full">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground">Μηνύματα</h1>
          {!isEmpty && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-3">Μηνύματα</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Δεν έχετε μηνύματα ακόμα. Όταν επικοινωνήσετε με έναν οικοδεσπότη ή
            λάβετε μια απάντηση, τα μηνύματά σας θα εμφανιστούν εδώ.
          </p>
        </div>
      ) : (
        <>
          <MessageFilters />
          <div className="divide-y divide-border">
            {conversations.map((conv) => (
              <div key={conv.id} onClick={() => handleConversationClick(conv)}>
                <ChatItem
                  avatar={conv.otherUserAvatar ?? undefined}
                  name={conv.otherUserName}
                  date={formatDistanceToNow(new Date(conv.lastMessageAt), {
                    addSuffix: true,
                    locale: el,
                  })}
                  message={conv.lastMessage}
                  contextInfo={conv.listingTitle ?? ""}
                  type="hosting"
                  unread={conv.unread}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Messages;
