import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChatBubbleProps {
  role: string;
  children: ReactNode;
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}> 
      <div
        className={cn(
          "max-w-[80%] break-words whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
          role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {children}
      </div>
    </div>
  );
}
