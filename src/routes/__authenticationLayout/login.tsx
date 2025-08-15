import EmailAndPasswordForm from "@/components/login/email-and-password";
import OAuth2Button from "@/components/login/oauth2-button";
import AppleIcon from "@/components/svg-icons/apple";
import GoogleIcon from "@/components/svg-icons/google";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { OAuthProvider } from "appwrite";

export const Route = createFileRoute("/__authenticationLayout/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslate();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">
                      {t("login.welcomeBack")}
                    </h1>
                    <p className="text-balance text-muted-foreground">
                      {t("login.loginWithAppleOrGoogle")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <OAuth2Button
                        icon={<AppleIcon />}
                        provider={OAuthProvider.Apple}
                        disabled
                      >
                        {t("login.loginWithApple")}
                      </OAuth2Button>
                      <Badge
                        variant={"secondary"}
                        className="absolute -top-2 -right-2"
                      >
                        {t("soon")}
                      </Badge>
                    </div>
                    <OAuth2Button
                      icon={<GoogleIcon />}
                      provider={OAuthProvider.Google}
                    >
                      {t("login.loginWithGoogle")}
                    </OAuth2Button>
                  </div>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      {t("login.orContinueWith")}
                    </span>
                  </div>
                  <EmailAndPasswordForm />
                  <div className="text-center text-sm">
                    {t("login.dontHaveAccount")} {" "}
                    <Link to="/register" className="underline underline-offset-4">
                      {t("login.signUp")}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/assets/mascot/mascot_default.png"
                  alt={t("login.welcomeBack")}
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            {t("login.agreeTo")} <a href="#">{t("login.termsOfService")}</a> {" "}
            {t("login.and")} <a href="#">{t("login.privacyPolicy")}</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

