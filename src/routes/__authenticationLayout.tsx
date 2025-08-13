import { account } from "@/lib/appwrite";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute("/__authenticationLayout")({
  component: RouteComponent,
  beforeLoad: async ({ search }) => {
    const isUserLoggedIn = await account.get().catch(() => false);
    if (!!isUserLoggedIn)
      throw redirect({
        to: search.redirect ?? "/",
      });
  },
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: search.redirect as string | undefined,
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
