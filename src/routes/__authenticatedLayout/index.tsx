import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/__authenticatedLayout/")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: !!context.session ? "/home" : "/login",
    });
  },
});
