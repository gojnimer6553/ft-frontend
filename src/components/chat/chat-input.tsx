import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, X, Mic } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  loading,
  placeholder,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && !disabled) onSend();
    }
  };

  return (
    <div className="w-full flex items-end gap-2">
      <Button
        size="icon"
        variant="ghost"
        aria-label="Anexar arquivo"
        onClick={() => {}}
        disabled={disabled || loading}
      >
        <Paperclip className="size-5" />
      </Button>
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          rows={1}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          placeholder={placeholder}
          aria-label="Mensagem"
          value={value}
          disabled={disabled || loading}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span className="absolute bottom-1 right-2 text-xs text-muted-foreground">
          {value.length}
        </span>
      </div>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Limpar"
        onClick={() => onChange("")}
        disabled={disabled || loading || value.length === 0}
      >
        <X className="size-5" />
      </Button>
      <Button
        size="icon"
        aria-label="Enviar"
        onClick={onSend}
        disabled={disabled || loading || value.length === 0}
        loading={loading}
      >
        <Send className="size-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Microfone"
        onClick={() => {}}
        disabled={disabled || loading}
      >
        <Mic className="size-5" />
      </Button>
    </div>
  );
}

export default ChatInput;
