import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";

export const Route = createFileRoute("/__authenticationLayout/password-changed")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslate();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h1 className="text-2xl font-bold">{t("recover.successTitle")}</h1>
            <p className="text-muted-foreground">
              {t("recover.successDescription")}
            </p>
            <Button asChild className="w-full">
              <Link to="/login">{t("recover.backToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RouteComponent;
