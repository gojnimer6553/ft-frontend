import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface ChatBubbleProps {
  role: string;
  children: ReactNode;
  layoutId?: string;
}

export function ChatBubble({ role, children, layoutId }: ChatBubbleProps) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <motion.div
        layout
        layoutId={layoutId}
        className={cn(
          "max-w-[80%] break-words whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
          role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}
