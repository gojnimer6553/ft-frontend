import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/waitlist")({
  component: WaitlistPage,
});

function WaitlistPage() {
  const { t } = useTranslate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("waitlist.success"));
    setEmail("");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted px-4 py-10">
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
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("waitlist.emailPlaceholder")}
            />
            <Button type="submit" className="w-full">
              {t("waitlist.submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
