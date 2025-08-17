import { account } from "@/lib/appwrite";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

interface LoginSearch {
  redirect?: string;
}

let isUserLoggedIn!: boolean | undefined;

export const Route = createFileRoute("/__authenticationLayout")({
  component: RouteComponent,
  beforeLoad: async ({ search }) => {
    if (isUserLoggedIn === undefined) {
      isUserLoggedIn = await account
        .get()
        .then(() => true)
        .catch(() => false);
    }
    if (!!isUserLoggedIn)
      throw redirect({
        to: search.redirect ?? "/",
      });
  },
  loader: ({ context }) => ({
    session: context.session,
  }),
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: search.redirect as string | undefined,
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
