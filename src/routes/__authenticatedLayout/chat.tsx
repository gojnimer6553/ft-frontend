import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/components/chat/chat-panel";

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: ChatPage,
});

function ChatPage() {
  return <ChatPanel />;
}
