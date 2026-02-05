import { Search, Settings } from "lucide-react";
import MessageFilters from "@/components/messages/MessageFilters";
import ChatItem from "@/components/messages/ChatItem";

const hostChats = [
  {
    id: "1",
    name: "Maria K.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    message: "Καλησπέρα! Θα ήθελα να ρωτήσω για την καταχώρηση...",
    date: "Σήμ",
    contextInfo: "15-18 Μαρ • Stivari view",
    unread: true,
    type: "hosting" as const,
  },
  {
    id: "2",
    name: "Γιάννης Π.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    message: "Ευχαριστώ πολύ για τη φιλοξενία! Ήταν υπέροχα.",
    date: "Χθες",
    contextInfo: "10-12 Μαρ • Athens Downtown Loft",
    unread: false,
    type: "hosting" as const,
  },
];

const HostMessages = () => {
  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">Μηνύματα</h1>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Search className="w-5 h-5 text-foreground" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <MessageFilters />

      {/* Chat List */}
      <div className="space-y-1">
        {hostChats.map((chat) => (
          <ChatItem key={chat.id} {...chat} />
        ))}
      </div>

      {/* Empty State (hidden when chats exist) */}
      {hostChats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Δεν έχετε μηνύματα
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Τα μηνύματα από τους επισκέπτες σας θα εμφανίζονται εδώ
          </p>
        </div>
      )}
    </div>
  );
};

export default HostMessages;
