import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";

export const Route = createFileRoute("/__authenticationLayout/recover/success")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslate();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6 text-center flex flex-col items-center gap-6">
            <img
              src="/assets/mascot/mascot_satisfied_face.png"
              alt={t("passwordChanged.title")}
              className="w-40"
            />
            <h1 className="text-2xl font-bold">
              {t("passwordChanged.title")}
            </h1>
            <p className="text-balance text-muted-foreground">
              {t("passwordChanged.description")}
            </p>
            <Link to="/login">
              <Button className="w-full">{t("passwordChanged.login")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
