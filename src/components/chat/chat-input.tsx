import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X, Mic, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ChatInput({ onSend, disabled, loading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  function handleSend() {
    const message = value.trim();
    if (!message) return;
    onSend(message);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && !disabled) handleSend();
    }
  }

  const count = value.length;

  return (
    <div className="border-t p-3">
      <div className="flex items-end gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Anexar arquivo"
          className="self-center"
        >
          <Paperclip className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Limpar mensagem"
          className="self-center"
          onClick={() => setValue("")}
          disabled={loading || disabled}
        >
          <X className="size-4" />
        </Button>
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || disabled}
            rows={1}
            aria-label="Digite sua mensagem"
            placeholder={
              loading ? "Aguardando resposta..." : "Digite sua mensagem"
            }
            className="w-full resize-none rounded-md border bg-background p-2 pr-8 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
          <span className="pointer-events-none absolute bottom-1 right-2 text-[10px] text-muted-foreground">
            {count}
          </span>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Ativar microfone"
          className="self-center"
        >
          <Mic className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          aria-label="Enviar mensagem"
          onClick={handleSend}
          disabled={loading || disabled || !value.trim()}
          loading={loading}
        >
          {!loading && <Send className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
