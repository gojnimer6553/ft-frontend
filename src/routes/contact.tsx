import { ContactForm } from "@/components/contact/ContactForm";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/assets/mascot/mascot_detective.png"
            alt={t("contact.title")}
            className="hidden w-40 md:block"
          />
          <h1 className="text-3xl font-bold">{t("contact.title")}</h1>
          <p className="text-muted-foreground">{t("contact.description")}</p>
          <ContactForm className="w-full" />
        </div>
      </div>
    </div>
  );
}
