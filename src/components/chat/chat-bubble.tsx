import { Message } from "@ai-sdk/react";

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] break-words whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {message.parts?.map((p) => (p.type === "text" ? p.text : "")).join("")}
      </div>
    </div>
  );
}
