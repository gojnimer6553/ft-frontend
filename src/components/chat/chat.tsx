import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { toast } from "sonner";
import { OpenAIChatTransport } from "@/lib/openai-chat-transport";

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
    try {
      await toast.promise(
        sendMessage({
          role: "user",
          parts: [{ type: "text", text: input }],
        }),
        {
          loading: "Sending message...",
          success: "Message sent",
          error: "Failed to send message",
        }
      );
      setInput("");
    } catch (error) {
      // error handled by toast.promise
    }
  }

  const isLoading = status !== "ready";

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
        <div ref={endRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t bg-background p-4"
      >
        <PlaceholdersAndVanishInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholders={[
            "Type your message",
            "Ask me anything",
            "Need help with something?",
          ]}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}

