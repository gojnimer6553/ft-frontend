import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { useTranslate } from "@tolgee/react";
import { OpenAIChatTransport } from "@/lib/openai-chat-transport";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatFooter } from "./chat-footer";

export function Chat() {
  const { t } = useTranslate();
  const transport = useMemo(() => new OpenAIChatTransport(), []);
  const { messages, sendMessage, status } = useChat({ transport });

  async function handleSubmit(value: string) {
    if (!value.trim()) return;
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: value }],
    });
  }

  const isLoading = status !== "ready";

  const placeholders = [
    t("chat.placeholder.typeYourMessage"),
    t("chat.placeholder.askQuestion"),
    t("chat.placeholder.shareThoughts"),
  ];

  return (
    <div className="flex h-full flex-col items-center">
      <ChatHeader />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatFooter
        onSubmit={handleSubmit}
        disabled={isLoading}
        placeholders={placeholders}
      />
    </div>
  );
}
