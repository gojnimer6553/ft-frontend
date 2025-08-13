import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import { useSearch } from "@tanstack/react-router";
import { OAuthProvider } from "appwrite";

export default function OAuth2Button({
  provider,
  icon,
  children,
  ...props
}: {
  provider: OAuthProvider;
  icon?: React.ReactNode;
} & React.ComponentProps<"button">) {
  const redirectParams = useSearch({
    strict: false,
    select: (s) => s.redirect,
  });
  return (
    <Button
      {...props}
      onClick={() => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        account.createOAuth2Session(
          provider,
          `${baseUrl}${redirectParams ?? ""}`,
          `${baseUrl}/login-error`
        );
      }}
      variant="outline"
      className="w-full"
    >
      {icon}
      {children}
    </Button>
  );
}
