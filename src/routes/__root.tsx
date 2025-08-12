import { Toaster } from "@/components/ui/sonner";
import { account } from "@/lib/appwrite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
interface RootContext {
  session?: ReturnType<typeof account.createEmailPasswordSession>;
}

const queryClient = new QueryClient();

export const Route = createRootRouteWithContext<RootContext>()({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <TanStackRouterDevtools position="top-right" />
      <RootOutlet />
      <Toaster position="top-center" offset={60} />
    </QueryClientProvider>
  ),
  notFoundComponent: () => {
    return <div>Página não encontrada</div>;
  },
  beforeLoad: async ({ context: { session }, location: { pathname } }) => {
    if (!!session) return;
    try {
      const session = await account.get();
      queryClient.ensureQueryData({
        queryKey: ["session"],
        initialData: session,
      });
      return { session };
    } catch {
      if (pathname === "/login")
        return {
          session: undefined,
        };
      throw redirect({
        to: "/login",
      });
    }
  },
});

const RootOutlet = () => {
  /*   const status = useRouterState({ select: (s) => s.status });
  if (status === "pending") return <FullPageLoader />; */
  return <Outlet />;
};
