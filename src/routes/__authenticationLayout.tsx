import { account } from "@/lib/appwrite";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/__authenticationLayout")({
  component: RouteComponent,
  beforeLoad: async () => {
    const isUserLoggedIn = await account.get().catch(() => false);
    if (!!isUserLoggedIn)
      throw redirect({
        to: "/",
      });
  },
});

function RouteComponent() {
  return <Outlet />;
}
