import { FeedbackForm } from "@/components/feedback-form";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";

export function FeedbackCredenza({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        {children ?? <Button>{t("feedback.title")}</Button>}
      </CredenzaTrigger>
      <CredenzaContent>
        <img
          src="/assets/mascot/mascot_full_body.png"
          alt="Cat mascot"
          className="mx-auto my-4 h-40 w-auto"
        />
        <CredenzaHeader>
          <CredenzaTitle>{t("feedback.title")}</CredenzaTitle>
          <CredenzaDescription>{t("feedback.description")}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="pb-4">
          <FeedbackForm onSubmitted={() => setOpen(false)} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}

