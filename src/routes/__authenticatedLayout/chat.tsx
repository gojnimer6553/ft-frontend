import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "@/components/chat";

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 min-h-0 flex-col items-center px-4 overflow-x-hidden overflow-y-auto">
      <Chat />
    </div>
  );
}

