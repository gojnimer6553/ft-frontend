import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__authenticatedLayout/home")({
  component: HomePage,
});

export default function HomePage() {
  return (
    <div className="w-full h-full flex  justify-center items-center">
      <p className="font-mono text-3xl">Em desenvolvimento</p>
    </div>
  );
}
