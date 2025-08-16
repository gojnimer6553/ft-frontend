import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
  CredenzaBody,
} from "@/components/ui/credenza";
import { useTranslate } from "@tolgee/react";
import { useState, type ComponentPropsWithoutRef, type ReactElement } from "react";

type ContactCredenzaProps = {
  trigger?: ReactElement;
} & ComponentPropsWithoutRef<typeof CredenzaTrigger>;

export function ContactCredenza({ trigger, ...props }: ContactCredenzaProps) {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild {...props}>
        {trigger ?? <Button>{t("contact.title")}</Button>}
      </CredenzaTrigger>
      <CredenzaContent>
        <img
          src="/assets/mascot/mascot_detective.png"
          alt="Cat mascot"
          className="mx-auto my-4 h-40 w-auto"
        />
        <CredenzaHeader>
          <CredenzaTitle>{t("contact.title")}</CredenzaTitle>
          <CredenzaDescription>{t("contact.description")}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="pb-4">
          <ContactForm onSubmitted={() => setOpen(false)} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
