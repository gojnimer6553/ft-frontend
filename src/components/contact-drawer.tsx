import { useState } from "react";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useTranslate } from "@tolgee/react";

export function ContactDrawer() {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>{t("contact.title")}</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <img
          src="/assets/mascot/mascot_detective.png"
          alt="Cat mascot"
          className="mx-auto my-4 h-40 w-auto"
        />
        <DrawerHeader>
          <DrawerTitle>{t("contact.title")}</DrawerTitle>
          <DrawerDescription>{t("contact.description")}</DrawerDescription>
        </DrawerHeader>
        <ContactForm className="p-4" onSubmitted={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}
