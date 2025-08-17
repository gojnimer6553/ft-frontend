import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { useTranslate } from "@tolgee/react";
import { OpenAIChatTransport } from "@/lib/openai-chat-transport";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatFooter } from "./chat-footer";
import { Portal } from "@/components/portal";

export function Chat() {
  const { t } = useTranslate();
  const transport = useMemo(() => new OpenAIChatTransport(), []);
  const { messages, sendMessage, status } = useChat({ transport });

  async function handleSubmit(value: string, files?: FileList) {
    const uploadFiles = files && files.length > 0 ? files : undefined;
    if (!value.trim() && !uploadFiles) return;
    await sendMessage({ text: value, files: uploadFiles });
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
        <div className="flex w-full max-w-2xl flex-1 min-h-0 flex-col overflow-x-hidden overflow-y-auto">
          {hasMessages && (
            <ChatMessages messages={messages} isLoading={status !== "ready"} />
          )}
          <ChatFooter
            onSubmit={handleSubmit}
            disabled={status !== "ready"}
            placeholders={placeholders}
            className={hasMessages ? "mt-auto" : "my-auto"}
            showPrompt={!hasMessages}
          />
        </div>
      </div>
    </>
  );
}

export default Chat;
