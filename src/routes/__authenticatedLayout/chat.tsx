import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "@/components/chat";

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}

