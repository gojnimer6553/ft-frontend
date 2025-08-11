import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-full flex  justify-center items-center">
      <p className="font-mono text-3xl">Em desenvolvimento</p>
    </div>
  );
}
