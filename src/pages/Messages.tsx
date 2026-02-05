import { Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageFilters from "@/components/messages/MessageFilters";
import ChatItem from "@/components/messages/ChatItem";

const chats = [
  {
    id: 1,
    name: "Maria K.",
    date: "Χθες",
    message: "Καλησπέρα! Θα ήθελα να ρωτήσω αν υπάρχει διαθεσιμότητα για τις ημερομηνίες που ζήτησα.",
    contextInfo: "9-13 Αυγ • Stivari view",
    type: "hosting" as const,
    unread: true,
  },
  {
    id: 2,
    name: "Υποστήριξη Airbnb",
    date: "2 Ιαν",
    message: "Σας ευχαριστούμε που επικοινωνήσατε μαζί μας. Η αίτησή σας έχει ολοκληρωθεί επιτυχώς.",
    contextInfo: "Αίτηση #48291",
    type: "support" as const,
    unread: false,
  },
  {
    id: 3,
    name: "Alexandros P.",
    date: "28 Δεκ",
    message: "Ευχαριστώ πολύ για την φιλοξενία! Ήταν υπέροχη εμπειρία. Θα σας προτείνω σίγουρα.",
    contextInfo: "24-28 Δεκ • Μύκονος Villa",
    type: "trip" as const,
    unread: false,
  },
  {
    id: 4,
    name: "Elena S.",
    date: "15 Δεκ",
    message: "Γεια σας! Είμαι ο επόμενος επισκέπτης σας. Ήθελα να ρωτήσω για το check-in.",
    contextInfo: "18-22 Δεκ • Αθήνα Center",
    type: "hosting" as const,
    unread: false,
  },
  {
    id: 5,
    name: "Nikos T.",
    date: "10 Δεκ",
    message: "Σας ενημερώνω ότι θα φτάσουμε λίγο αργότερα από το προγραμματισμένο. Περίπου στις 18:00.",
    contextInfo: "10-14 Δεκ • Σαντορίνη Suite",
    type: "trip" as const,
    unread: false,
  },
];

const Messages = () => {
  return (
    <div className="bg-background min-h-full">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground">Μηνύματα</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <MessageFilters />

      {/* Chat List */}
      <div className="divide-y divide-border">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            name={chat.name}
            date={chat.date}
            message={chat.message}
            contextInfo={chat.contextInfo}
            type={chat.type}
            unread={chat.unread}
          />
        ))}
      </div>

      {/* Empty State (hidden when there are chats) */}
      {chats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="text-muted-foreground text-center">
            Δεν έχετε μηνύματα ακόμα
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
