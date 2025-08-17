import { ContactForm } from "@/components/contact/ContactForm"
import { Button } from "@/components/ui/button"
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
  CredenzaBody,
} from "@/components/ui/credenza"
import { useTranslate } from "@tolgee/react"
import { useState } from "react"

export function ContactCredenza({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslate()
  const [open, setOpen] = useState(false)

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        {children ?? <Button>{t("contact.title")}</Button>}
      </CredenzaTrigger>
      <CredenzaContent>
        <img
          src="/assets/mascot/mascot_detective.png"
          alt="Cat mascot"
          className="mx-auto my-4 hidden h-40 w-auto md:block"
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
  )
}
