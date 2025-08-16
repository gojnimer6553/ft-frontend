import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

interface ChatFooterProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  placeholders: string[];
}

export function ChatFooter({ onSubmit, disabled, placeholders }: ChatFooterProps) {
  return (
    <div className="w-full bg-background p-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onSubmit={onSubmit}
        disabled={disabled}
      />
    </div>
  );
}
