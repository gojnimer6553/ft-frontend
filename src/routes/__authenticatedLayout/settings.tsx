import { SettingsForm } from "@/components/settings/settings-form";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/__authenticatedLayout/settings")({
  component: SettingsForm,
  loader: ({ context }) => {
    return {
      session: context.session,
    };
  },
  onLeave: () => {
    toast.dismiss("settings-save-alert");
  },
});
