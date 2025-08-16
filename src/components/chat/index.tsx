import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { useTranslate } from "@tolgee/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { OpenAIChatTransport } from "@/lib/openai-chat-transport";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatFooter } from "./chat-footer";
import { Portal } from "@/components/portal";

export function Chat() {
  const { t } = useTranslate();
  const transport = useMemo(() => new OpenAIChatTransport(), []);
  const { messages, sendMessage, status } = useChat({ transport });
  const hasMessages = messages.length > 0;

  async function handleSubmit(value: string) {
    if (!value.trim()) return;
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: value }],
    });
  }

  const placeholders = [
    t("chat.placeholder.typeYourMessage"),
    t("chat.placeholder.askQuestion"),
    t("chat.placeholder.shareThoughts"),
  ];

  return (
    <>
      <Portal containerId="page-header-portal">
        <ChatHeader />
      </Portal>
      <div className="flex flex-1 min-h-0 flex-col items-center px-4 overflow-x-hidden overflow-y-auto">
        <div className="flex w-full max-w-2xl flex-1 min-h-0 flex-col overflow-x-hidden overflow-y-auto">
          {hasMessages && (
            <ChatMessages messages={messages} isLoading={status !== "ready"} />
          )}
          <motion.div
            layout
            transition={{ duration: 0.3 }}
            className={cn(
              "w-full",
              hasMessages ? "" : "flex flex-1 items-center"
            )}
          >
            <ChatFooter
              onSubmit={handleSubmit}
              disabled={status !== "ready"}
              placeholders={placeholders}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Chat;
