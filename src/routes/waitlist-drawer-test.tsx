import { createFileRoute } from "@tanstack/react-router";
import { WaitlistDrawer } from "@/components/waitlist-drawer";

export const Route = createFileRoute("/waitlist-drawer-test")({
  component: WaitlistDrawerTest,
});

function WaitlistDrawerTest() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <WaitlistDrawer />
    </div>
  );
}
