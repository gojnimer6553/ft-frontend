import * as React from "react";

export type ChatMessage = {
  role: "user" | "bot";
  content: string;
};

export function useChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  const sendMessage = React.useCallback(async (content: string) => {
    const userMessage: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.reply ?? "" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Erro no servidor" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Erro de conexao" },
      ]);
    }
  }, []);

  return { messages, sendMessage };
}
