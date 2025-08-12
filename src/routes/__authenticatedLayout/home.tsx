import { Button } from "@/components/ui/button";
import useExecution from "@/hooks/use-execution";
import { createFileRoute } from "@tanstack/react-router";
import { ExecutionMethod } from "appwrite";

export const Route = createFileRoute("/__authenticatedLayout/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate, status } = useExecution();

  return (
    <div className="w-full h-full flex  justify-center items-center">
      <p className="font-mono text-3xl">Em desenvolvimento</p>
      <p>{status}</p>
      <Button
        onClick={async () => {
          mutate({
            functionId: "689b3e16003cc966d506",
            method: ExecutionMethod.GET,
          });
        }}
      >
        Test
      </Button>
    </div>
  );
}
