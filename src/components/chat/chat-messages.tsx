import { Loader2 } from "lucide-react";
import { ChatBubble } from "./chat-bubble";
import type { UIMessage } from "ai";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  className?: string;
}

export function ChatMessages({ messages, isLoading, className }: ChatMessagesProps) {
  return (
    <div className={cn("flex flex-1 flex-col space-y-4", className)}>
      {messages.map((m) => (
        <ChatBubble key={m.id} role={m.role}>
          {m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
        </ChatBubble>
      ))}
      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
