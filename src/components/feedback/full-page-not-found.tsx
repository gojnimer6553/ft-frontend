import SoonBadge from "@/components/feedback/soon-badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";

export default function FullPageNotFound() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <img
            alt={t("feedback.notFound.logoAlt")}
            className="size-[200px] mx-auto"
            src="/assets/main-logo.png"
          />
        </div>

        {/* 404 Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t("feedback.notFound.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("feedback.notFound.description")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button className="w-full" onClick={() => navigate({ to: "/" })}>
            {t("feedback.notFound.backToDiary")}
          </Button>
          <SoonBadge>
            <Button variant="outline" disabled className="w-full">
              {t("feedback.notFound.contactSupport")}
            </Button>
          </SoonBadge>
        </div>

        {/* Fun Message */}
        <p className="text-sm text-muted-foreground mt-8">
          {t("feedback.notFound.funMessage")}
        </p>
      </div>
    </div>
  );
}
