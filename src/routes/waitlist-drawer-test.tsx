import { createFileRoute } from "@tanstack/react-router";
import { WaitlistCredenza } from "@/components/waitlist-credenza";

export const Route = createFileRoute("/waitlist-drawer-test")({
  component: WaitlistDrawerTest,
});

function WaitlistDrawerTest() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <WaitlistCredenza />
    </div>
  );
}
