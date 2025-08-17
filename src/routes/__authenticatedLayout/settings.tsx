import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { SettingsForm } from "@/components/settings/settings-form";

export const Route = createFileRoute("/__authenticatedLayout/settings")({
  component: SettingsForm,
  onLeave: () => {
    toast.dismiss("settings-save-alert");
  },
});
