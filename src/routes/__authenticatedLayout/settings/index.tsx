import { createFileRoute } from "@tanstack/react-router";
import { UpdateNameForm } from "@/components/settings/update-name-form";
import { UpdateEmailForm } from "@/components/settings/update-email-form";
import { UpdatePhoneForm } from "@/components/settings/update-phone-form";
import { UpdatePreferencesForm } from "@/components/settings/update-preferences-form";
import { SessionsList } from "@/components/settings/sessions-list";

export const Route = createFileRoute("/__authenticatedLayout/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <UpdateNameForm />
      <UpdateEmailForm />
      <UpdatePhoneForm />
      <UpdatePreferencesForm className="md:col-span-2" />
      <SessionsList className="md:col-span-2" />
    </div>
  );
}

export default SettingsPage;
