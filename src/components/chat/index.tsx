import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { useTranslate } from "@tolgee/react";
import { OpenAIChatTransport } from "@/lib/openai-chat-transport";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatFooter } from "./chat-footer";
import { Portal } from "@/components/portal";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

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

  const placeholders = [
    t("chat.placeholder.typeYourMessage"),
    t("chat.placeholder.askQuestion"),
    t("chat.placeholder.shareThoughts"),
  ];

  const hasMessages = messages.length > 0;

  return (
    <>
      <Portal containerId="page-header-portal">
        <ChatHeader />
      </Portal>
      <div className="flex flex-1 min-h-0 flex-col items-center px-4 overflow-x-hidden overflow-y-auto">
        <motion.div
          layout
          transition={{ type: "spring", bounce: 0.2 }}
          className={cn(
            "flex w-full max-w-2xl flex-1 min-h-0 flex-col overflow-x-hidden overflow-y-auto",
            !hasMessages && "justify-center"
          )}
        >
          <AnimatePresence initial={false}>
            {hasMessages && (
              <motion.div
                key="messages"
                layout
                className="flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChatMessages
                  messages={messages}
                  isLoading={status !== "ready"}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div layout>
            <ChatFooter
              onSubmit={handleSubmit}
              disabled={status !== "ready"}
              placeholders={placeholders}
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Chat;
