import { useState } from "react"
import { useTranslate } from "@tolgee/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"

export function WaitlistDrawer() {
  const { t } = useTranslate()
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(t("waitlist.success"))
    setEmail("")
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>{t("waitlist.submit")}</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <img
          src="/assets/mascot/mascot_full_body.png"
          alt="Cat mascot"
          className="mx-auto my-4 h-40 w-auto"
        />
        <DrawerHeader>
          <DrawerTitle>{t("waitlist.title")}</DrawerTitle>
          <DrawerDescription>{t("waitlist.description")}</DrawerDescription>
        </DrawerHeader>
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
      </DrawerContent>
    </Drawer>
  )
}

