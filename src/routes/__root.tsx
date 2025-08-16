import FullPageNotFound from "@/components/feedback/full-page-not-found";
import { Toaster } from "@/components/ui/sonner";
import { account } from "@/lib/appwrite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
interface RootContext {
  session?: ReturnType<typeof account.createEmailPasswordSession>;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: RootComponent,
  loader: ({ context }) => {
    return {
      queryClient: context.queryClient,
    };
  },
  notFoundComponent: FullPageNotFound,
});

function RootComponent() {
  const { queryClient } = Route.useLoaderData();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-1 flex-col overflow-hidden">
        <TanStackRouterDevtools position="top-right" />
        <Outlet />
        <Toaster position="top-center" offset={60} />
      </div>
    </QueryClientProvider>
  );
}
