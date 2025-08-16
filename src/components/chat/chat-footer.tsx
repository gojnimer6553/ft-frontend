import { motion } from "motion/react";
import { useTranslate } from "@tolgee/react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";

interface ChatFooterProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  placeholders: string[];
  className?: string;
  showPrompt?: boolean;
}

export function ChatFooter({
  onSubmit,
  disabled,
  placeholders,
  className,
  showPrompt = false,
}: ChatFooterProps) {
  const { t } = useTranslate();
  return (
    <motion.div
      layout
      className={cn("w-full shrink-0 bg-background p-4", className)}
    >
      {showPrompt && (
        <p className="mb-4 text-start text-2xl text-muted-foreground">
          {t("chat.prompt")}
        </p>
      )}
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onSubmit={onSubmit}
        disabled={disabled}
      />
    </motion.div>
  );
}
