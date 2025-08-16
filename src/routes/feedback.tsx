import { FeedbackForm } from "@/components/feedback-form";
import { AppVersion } from "@/components/app-version";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const { t } = useTranslate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/assets/mascot/mascot_full_body.png"
            alt={t("feedback.title")}
            className="w-40"
          />
          <h1 className="text-3xl font-bold">{t("feedback.title")}</h1>
          <p className="text-muted-foreground">{t("feedback.description")}</p>
          <FeedbackForm className="w-full" />
          <p className="text-xs text-muted-foreground">
            {t("feedback.version")} <AppVersion />
          </p>
        </div>
      </div>
    </div>
  );
}

