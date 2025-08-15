import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  Paperclip,
  Send,
  Mic,
  Trash2,
  Plus,
  MoreVertical,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  status: "sending" | "sent" | "error";
  createdAt: Date;
}

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: RouteComponent,
});

function formatMessage(text: string) {
  const link = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
  let html = text.replace(
    link,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-primary">$1</a>'
  );
  html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded">$1<\/code>');
  return html;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex w-full motion-safe:animate-fadeIn motion-safe:animate-slideInUp motion-safe:animate-duration-300 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-xs ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        <div
          className="whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
        />
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
          {message.status === "sending" && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
          {message.status === "error" && (
            <span className="text-destructive">erro</span>
          )}
          <span>{formatTime(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      status: "sending",
      createdAt: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === userMsg.id ? { ...msg, status: "sent" } : msg
        ).concat({
          id: Date.now() + 1,
          role: "ai",
          content: "Esta é uma resposta de exemplo.",
          status: "sent",
          createdAt: new Date(),
        })
      );
      setLoading(false);
    }, 1000);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const placeholder = loading
    ? "Aguardando resposta..."
    : "Digite sua mensagem...";

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <h1 className="text-lg font-semibold">Chat</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Novo chat"
            onClick={() => setMessages([])}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Opções">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto scroll-smooth p-4 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </main>
      <footer className="border-t p-4">
        <div className="relative flex items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="self-end"
            aria-label="Anexar arquivo"
            disabled={loading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Mensagem"
            disabled={loading}
            rows={1}
            className="max-h-40 resize-none"
          />
          <div className="flex items-center gap-2 self-end">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Limpar"
              disabled={!input || loading}
              onClick={() => setInput("")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              aria-label="Enviar"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              loading={loading}
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Microfone"
              disabled={loading}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <span className="pointer-events-none absolute -bottom-5 right-0 text-xs text-muted-foreground">
            {input.length}
          </span>
        </div>
      </footer>
    </div>
  );
}

