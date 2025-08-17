import { HttpChatTransport, type UIMessage, type UIMessageChunk } from "ai";
import { createParser } from "eventsource-parser";

export class OpenAIChatTransport extends HttpChatTransport<UIMessage> {
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
              content: m.parts.map((p) => {
                if (p.type === "text") {
                  return { type: "text", text: p.text };
                }
                if (p.type === "file" && p.mediaType.startsWith("image/")) {
                  return { type: "image_url", image_url: { url: p.url } };
                }
                return { type: "text", text: "" };
              }),
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

