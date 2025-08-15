import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Loader2,
  Mic,
  MoreVertical,
  Paperclip,
  RefreshCcw,
  Send,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: RouteComponent,
});

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  status: "sent" | "sending" | "error";
  createdAt: Date;
};

function MarkdownText({ text }: { text: string }) {
  const html = useMemo(() => {
    const escape = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return escape(text)
      .replace(
        /`([^`]+)`/g,
        '<code class="rounded bg-muted px-1 py-0.5 font-mono text-xs">$1</code>',
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="underline text-primary" target="_blank" rel="noopener noreferrer">$1</a>',
      );
  }, [text]);

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-md px-3 py-2 text-sm shadow-sm motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        <MarkdownText text={message.text} />
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
          {message.status === "sending" && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
          {message.status === "error" && (
            <AlertCircle className="h-3 w-3 text-destructive" />
          )}
          <span>
            {message.status === "sending"
              ? "enviando..."
              : message.status === "error"
                ? "erro"
                : message.createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
          </span>
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: `${Date.now()}-u`,
      role: "user",
      text: input,
      status: "sent",
      createdAt: new Date(),
    };
    const aiMessage: Message = {
      id: `${Date.now()}-a`,
      role: "ai",
      text: "",
      status: "sending",
      createdAt: new Date(),
    };
    setMessages((m) => [...m, userMessage, aiMessage]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === aiMessage.id
            ? {
                ...msg,
                text: "Esta é uma resposta de exemplo.",
                status: Math.random() < 0.1 ? "error" : "sent",
              }
            : msg,
        ),
      );
      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Novo chat"
            onClick={handleClear}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Mais opções">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div
        className="flex-1 space-y-4 overflow-y-auto p-4 scroll-smooth"
        aria-live="polite"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="space-y-2 border-t p-4"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              loading ? "Aguardando resposta..." : "Digite sua mensagem..."
            }
            aria-label="Mensagem"
            disabled={loading}
            rows={1}
            className="flex-1 resize-none overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Anexar arquivo"
              disabled={loading}
              onClick={() => alert("Anexar arquivo (mock)")}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Microfone"
              disabled={loading}
              onClick={() => alert("Microfone (mock)")}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Limpar"
              disabled={!messages.length && !input}
              onClick={handleClear}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              aria-label="Enviar mensagem"
              disabled={!input.trim() || loading}
              loading={loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          {input.length} tokens
        </div>
      </form>
    </div>
  );
}
