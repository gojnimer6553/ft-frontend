import { useState } from "react"
import { useTranslate } from "@tolgee/react"
import { toast } from "sonner"
import { functions } from "@/lib/appwrite"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
} from "@/components/ui/credenza"

export function WaitlistCredenza() {
  const { t } = useTranslate()
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await functions.createExecution(
        "689feffd0007270a4aa1",
        JSON.stringify({ email }),
        false,
        "/waitlist",
        "POST"
      )
      toast.success(t("waitlist.success"))
      setEmail("")
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
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
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  )
}
