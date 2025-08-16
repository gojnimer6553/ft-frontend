import { Sidebar } from "@/components/admin-panel/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { account } from "@/lib/appwrite";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";


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
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-screen transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <div id="page-header-portal" className="flex-1" />
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <div className="p-4 pt-0">
          <Outlet />
        </div>
      </main>
    </>
  );
}
