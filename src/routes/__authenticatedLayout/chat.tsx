import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import MessageBubble from "@/components/chat/message-bubble";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  status: "sending" | "sent" | "error";
}

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: ChatRoute,
});

function ChatRoute() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const id = Date.now().toString();
    const userMsg: ChatMessage = {
      id,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      status: "sending",
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages((msgs) =>
        msgs.map((m) => (m.id === id ? { ...m, status: "sent" } : m))
      );
      const fail = userMsg.content.toLowerCase().includes("erro");
      const aiMsg: ChatMessage = {
        id: `${Date.now()}-ai`,
        role: "ai",
        content: fail
          ? "Algo deu errado"
          : `Você disse: ${userMsg.content}`,
        timestamp: new Date(),
        status: fail ? "error" : "sent",
      };
      setMessages((msgs) => [...msgs, aiMsg]);
      setLoading(false);
    }, 1000);
  };

  const clearMessages = () => setMessages([]);

  return (
    <div className="flex h-full w-full flex-col">
      <ChatHeader onClear={clearMessages} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} {...m} />
        ))}
        <div ref={endRef} />
      </div>
      <div className="border-t p-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          loading={loading}
          placeholder={loading ? "Gerando resposta..." : "Digite sua mensagem"}
        />
      </div>
    </div>
  );
}
