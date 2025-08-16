import { useState } from "react"
import { useTranslate } from "@tolgee/react"

import { Button } from "@/components/ui/button"
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
} from "@/components/ui/credenza"
import { WaitlistForm } from "@/components/waitlist-form"

export function WaitlistCredenza() {
  const { t } = useTranslate()
  const [open, setOpen] = useState(false)

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button>{t("waitlist.submit")}</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <img
          src="/assets/mascot/mascot_full_body.png"
          alt="Cat mascot"
          className="mx-auto my-4 h-40 w-auto"
        />
        <CredenzaHeader>
          <CredenzaTitle>{t("waitlist.title")}</CredenzaTitle>
          <CredenzaDescription>{t("waitlist.description")}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <WaitlistForm
            className="flex flex-col gap-4 p-4"
            onSubmitted={() => setOpen(false)}
          />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  )
}
