import RegisterEmailAndPasswordForm from "@/components/auth/register/EmailAndPassword";
import OAuth2Button from "@/components/auth/login/OAuth2Button";
import AppleIcon from "@/components/icons/AppleIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { OAuthProvider } from "appwrite";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/__authenticationLayout/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslate();
  const [hideRight, setHideRight] = useState(false);
  useEffect(() => {
    setHideRight(true);
  }, []);
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden">
            <CardContent className="p-0 md:flex">
              <div
                className={cn(
                  "p-6 md:p-8 transition-all duration-500 md:w-1/2",
                  hideRight && "md:w-full"
                )}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">
                      {t("register.createAccount")}
                    </h1>
                    <p className="text-balance text-muted-foreground">
                      {t("register.signUpWithAppleOrGoogle")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <OAuth2Button
                        icon={<AppleIcon />}
                        provider={OAuthProvider.Apple}
                        disabled
                      >
                        {t("register.signUpWithApple")}
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
                      {t("register.signUpWithGoogle")}
                    </OAuth2Button>
                  </div>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      {t("register.orContinueWith")}
                    </span>
                  </div>
                  <RegisterEmailAndPasswordForm />
                  <div className="text-center text-sm">
                    {t("register.alreadyHaveAccount")} {" "}
                    <Link to="/login" className="underline underline-offset-4">
                      {t("register.login")}
                    </Link>
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "relative hidden bg-background transition-all duration-500 md:flex md:w-1/2 md:items-center md:justify-center",
                  hideRight && "md:w-0 md:translate-x-full"
                )}
              >
                <img
                  src="/assets/mascot/mascot_thumbs_up.png"
                  alt={t("register.createAccount")}
                  className="h-32 w-32 object-contain"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            {t("register.agreeTo")} <a href="#">{t("register.termsOfService")}</a> {" "}
            {t("register.and")} <a href="#">{t("register.privacyPolicy")}</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

