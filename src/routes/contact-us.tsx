import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact-us")({
  component: ContactUsPage,
});

function ContactUsPage() {
  const { t } = useTranslate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("contact.success"));
    setEmail("");
    setMessage("");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/assets/mascot/mascot_detective.png"
            alt={t("contact.title")}
            className="w-40"
          />
          <h1 className="text-3xl font-bold">{t("contact.title")}</h1>
          <p className="text-muted-foreground">{t("contact.description")}</p>
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contact.emailPlaceholder")}
            />
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("contact.messagePlaceholder")}
              className="min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit" className="w-full">
              {t("contact.submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
