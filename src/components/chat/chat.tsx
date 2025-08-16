import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { OpenAIChatTransport } from "@/lib/openai-chat-transport";
import { toast } from "sonner";

export function Chat() {
  const transport = useMemo(() => new OpenAIChatTransport(), []);
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const promise = sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }],
    });

    toast.promise(promise, {
      loading: "Sending...",
      success: "Message sent",
      error: "Failed to send message",
    });

    try {
      await promise;
      setInput("");
    } catch {
      // error handled by toast
    }
  }

  const isLoading = status !== "ready" && status !== "error";
  const isError = status === "error";

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {m.parts?.map((p) => (p.type === "text" ? p.text : "")).join("")}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {isError && (
          <div className="flex justify-center text-sm text-destructive">
            Something went wrong
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t bg-background p-4"
      >
        <PlaceholdersAndVanishInput
          placeholders={[
            "Type your message",
            "Ask anything...",
            "Start chatting",
          ]}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}

