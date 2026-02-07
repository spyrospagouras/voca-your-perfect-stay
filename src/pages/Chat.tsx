import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatMessages } from "@/hooks/useChatMessages";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const otherUserId = searchParams.get("userId") ?? "";
  const listingId = searchParams.get("listingId") ?? null;
  const otherUserName = searchParams.get("name") ?? "Χρήστης";
  const otherUserAvatar = searchParams.get("avatar") ?? null;
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading, sendMessage } = useChatMessages(otherUserId, listingId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage.mutate(trimmed);
    setText("");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-9 h-9">
          <AvatarImage src={otherUserAvatar ?? undefined} />
          <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-foreground">{otherUserName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading && (
          <p className="text-center text-muted-foreground text-sm">Φόρτωση…</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.isMine
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={`text-[10px] mt-1 ${msg.isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: el })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-background">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Γράψτε ένα μήνυμα…"
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button size="icon" onClick={handleSend} disabled={!text.trim() || sendMessage.isPending}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
