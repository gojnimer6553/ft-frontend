import { AppSidebar } from "@/components/sidebar";
import { createFileRoute, redirect } from "@tanstack/react-router";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { account } from "@/lib/appwrite";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/__authenticatedLayout")({
  component: RouteComponent,
  beforeLoad: async ({ context: { session, queryClient } }) => {
    if (!!session) return;
    try {
      const session = await account.get();
      queryClient.ensureQueryData({
        queryKey: ["session"],
        initialData: session,
      });
      return { session };
    } catch {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
