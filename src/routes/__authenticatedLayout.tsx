import { AppSidebar } from "@/components/sidebar";
import { createFileRoute, redirect } from "@tanstack/react-router";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { account } from "@/lib/appwrite";
import { Outlet } from "@tanstack/react-router";

type ISession = Awaited<ReturnType<typeof account.get>>;

let cachedSession: ISession | undefined;
let cachedAt = 0;
const CACHE_TTL = 1000 * 60 * 120; // 120 minutes

export const Route = createFileRoute("/__authenticatedLayout")({
  component: RouteComponent,
  beforeLoad: async ({ context: { queryClient }, location: { pathname } }) => {
    if (sessionStorage.getItem("logged-out")) {
      cachedSession = undefined;
      cachedAt = 0;
      sessionStorage.removeItem("logged-out");
    }
    try {
      let session!: ISession;
      const now = Date.now();
      const isCachedSessionValid = now - cachedAt < CACHE_TTL;
      if (cachedSession && isCachedSessionValid) session = cachedSession;
      else {
        session = await account.get();
        cachedSession = session;
        cachedAt = now;
      }
      queryClient.ensureQueryData({
        queryKey: ["session"],
        initialData: session,
      });
      return { session };
    } catch {
      throw redirect({
        to: "/login",
        search: {
          redirect: pathname,
        },
      });
    }
  },
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* Allow the main content area to scroll when necessary */}
      <SidebarInset className="min-h-0 overflow-x-hidden overflow-y-auto">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="ml-auto px-4">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 min-h-0 flex-col gap-4 p-4 pt-0 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
