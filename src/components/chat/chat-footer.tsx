import { motion } from "motion/react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";

interface ChatFooterProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  placeholders: string[];
  className?: string;
}

export function ChatFooter({
  onSubmit,
  disabled,
  placeholders,
  className,
}: ChatFooterProps) {
  return (
    <motion.div
      layout
      className={cn("w-full shrink-0 bg-background p-4", className)}
    >
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onSubmit={onSubmit}
        disabled={disabled}
      />
    </motion.div>
  );
}
