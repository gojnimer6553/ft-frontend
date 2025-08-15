import { Button } from "@/components/ui/button";
import { Trash2, RefreshCcw } from "lucide-react";

interface ChatHeaderProps {
  onClear: () => void;
}

export function ChatHeader({ onClear }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <h1 className="text-lg font-semibold">Chat</h1>
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          aria-label="Nova conversa"
          onClick={onClear}
        >
          <RefreshCcw className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Limpar mensagens"
          onClick={onClear}
        >
          <Trash2 className="size-5" />
        </Button>
      </div>
    </header>
  );
}

export default ChatHeader;
