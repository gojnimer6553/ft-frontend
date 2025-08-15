import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const bubbleVariants = cva(
  "relative max-w-[75%] rounded-lg px-4 py-2 text-sm shadow-md", {
    variants: {
      role: {
        user: "bg-primary text-primary-foreground ml-auto",
        ai: "bg-muted text-foreground",
      },
    },
    defaultVariants: {
      role: "ai",
    },
  }
);

export interface ChatMessageProps extends VariantProps<typeof bubbleVariants> {
  content: string;
  timestamp: Date;
  status?: "sent" | "sending" | "error";
}

export function ChatMessage({ role, content, timestamp, status }: ChatMessageProps) {
  const time = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div
      className={cn(
        "flex w-full gap-2 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2",
        role === "user" && "justify-end"
      )}
    >
      <div className={bubbleVariants({ role })} aria-live="polite">
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-xs max-w-none break-words dark:prose-invert">
          {content}
        </ReactMarkdown>
        <span className="mt-1 block text-[10px] text-muted-foreground text-right">
          {status === "sending" ? "enviando..." : status === "error" ? "erro" : time}
        </span>
      </div>
    </div>
  );
}
