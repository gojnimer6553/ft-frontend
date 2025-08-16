import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import {
  HttpChatTransport,
  type UIMessage,
  type UIMessageChunk,
} from "ai";
import { createParser } from "eventsource-parser";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: ChatPage,
});

class OpenAIChatTransport extends HttpChatTransport<UIMessage> {
  constructor() {
    super({
      api: "https://ai.laranjito.com/v1/chat/completions",
      credentials: "omit",
      body: { model: "gpt-4o-mini", stream: true },
      prepareSendMessagesRequest({ messages, body }) {
        return {
          body: {
            ...body,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join(""),
            })),
          },
        };
      },
    });
  }

  protected processResponseStream(
    stream: ReadableStream<Uint8Array>
  ): ReadableStream<UIMessageChunk> {
    const decoder = new TextDecoder();

    return new ReadableStream<UIMessageChunk>({
      start(controller) {
        let currentId: string | null = null;
        const parser = createParser((event) => {
          if (event.type !== "event") return;
          const data = event.data;
          if (data === "[DONE]") {
            if (currentId) controller.enqueue({ type: "text-end", id: currentId });
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const id = json.id || currentId || "res";
            if (!currentId) {
              currentId = id;
              controller.enqueue({ type: "text-start", id });
            }
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue({ type: "text-delta", id, delta: content });
            }
          } catch {
            // ignore non-JSON chunks
          }
        });

        const reader = stream.getReader();
        function read() {
          reader
            .read()
            .then(({ value, done }) => {
              if (done) {
                controller.close();
                return;
              }
              parser.feed(decoder.decode(value, { stream: true }));
              read();
            })
            .catch((err) => controller.error(err));
        }
        read();
      },
    });
  }
}

function ChatPage() {
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
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }],
    });
    setInput("");
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
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
