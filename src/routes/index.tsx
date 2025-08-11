import { createFileRoute, redirect } from "@tanstack/react-router";

const mainAuthenticatedRoute = "/home";
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: mainAuthenticatedRoute,
    });
  },
});
