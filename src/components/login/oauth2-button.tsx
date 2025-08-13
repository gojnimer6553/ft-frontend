import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
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
  return (
    <Button
      {...props}
      onClick={() => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        account.createOAuth2Session(
          provider,
          baseUrl,
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
