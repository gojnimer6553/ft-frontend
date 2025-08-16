import { useState } from "react";
import { useTranslate } from "@tolgee/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

export function ContactDrawer() {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .nonempty({ message: t("validation.required") })
      .email({ message: t("validation.invalidEmail") }),
    message: z.string().nonempty({ message: t("validation.required") }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", message: "" },
  });

  const onSubmit = () => {
    toast.success(t("contact.success"));
    formMethods.reset();
    setOpen(false);
  };

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
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
            <FormField
              control={formMethods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contact.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("contact.emailPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contact.message")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("contact.messagePlaceholder")}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {t("contact.submit")}
            </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
