import { cn } from "@/lib/utils";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";

interface MessageBubbleProps {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  status?: "sending" | "error" | "sent";
}

function basicMarkdown(text: string) {
  return text
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded">$1<\/code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1<\/a>');
}

export function MessageBubble({ role, content, timestamp, status = "sent" }: MessageBubbleProps) {
  const isUser = role === "user";
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full gap-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-3 py-2 max-w-[85%] sm:max-w-[70%] break-words",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <div
          className="prose prose-sm dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: basicMarkdown(content) }}
        />
        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-muted-foreground">
          {status === "sending" && <Loader2 className="size-3 animate-spin" />}
          {status === "error" && <AlertCircle className="size-3 text-destructive" />}
          <span>{timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
