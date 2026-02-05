import { MessageSquare } from "lucide-react";

const Messages = () => {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">Μηνύματα</h1>
      
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Δεν υπάρχουν μηνύματα
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Τα μηνύματά σας με τους οικοδεσπότες θα εμφανίζονται εδώ
        </p>
      </div>
    </div>
  );
};

export default Messages;
