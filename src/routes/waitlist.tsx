import { createFileRoute } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { WaitlistForm } from "@/components/waitlist-form";

export const Route = createFileRoute("/waitlist")({
  component: WaitlistPage,
});

function WaitlistPage() {
  const { t } = useTranslate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/assets/mascot/mascot_thumbs_up.png"
            alt={t("waitlist.title")}
            className="w-40"
          />
          <h1 className="text-3xl font-bold">{t("waitlist.title")}</h1>
          <p className="text-muted-foreground">
            {t("waitlist.description")}
          </p>
          <WaitlistForm className="flex w-full flex-col gap-4" />
        </div>
      </div>
    </div>
  );
}
