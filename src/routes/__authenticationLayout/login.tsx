import EmailAndPasswordForm from "@/components/login/email-and-password";
import OAuth2Button from "@/components/login/oauth2-button";
import AppleIcon from "@/components/svg-icons/apple";
import GoogleIcon from "@/components/svg-icons/google";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { OAuthProvider } from "appwrite";

export const Route = createFileRoute("/__authenticationLayout/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslate();
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/*  <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <ChefHat className="size-4" />
          </div>
          Gojlevicius Inc.
        </a> */}
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {t("login.welcomeBack")}
              </CardTitle>
              <CardDescription>
                {t("login.loginWithAppleOrGoogle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
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
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    {t("login.orContinueWith")}
                  </span>
                </div>
                <EmailAndPasswordForm />
                <div className="text-center text-sm">
                  {t("login.dontHaveAccount")}{" "}
                  <a href="#" className="underline underline-offset-4">
                    {t("login.signUp")}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            {t("login.agreeTo")} <a href="#">{t("login.termsOfService")}</a>{" "}
            {t("login.and")} <a href="#">{t("login.privacyPolicy")}</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
