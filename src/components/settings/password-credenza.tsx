import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@tolgee/react";

const passwordSchema = z.object({ password: z.string().min(1) });

export function PasswordCredenza({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => void;
}) {
  const { t } = useTranslate();
  const form = useForm<{ password: string }>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  return (
    <Credenza open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) form.reset(); }}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t("settings.passwordCredenza.title")}</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form
              id="password-form"
              onSubmit={form.handleSubmit(({ password }) => {
                onConfirm(password);
                form.reset();
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings.passwordCredenza.password")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button type="button" variant="outline">
              {t("settings.passwordCredenza.cancel")}
            </Button>
          </CredenzaClose>
          <Button type="submit" form="password-form">
            {t("settings.passwordCredenza.confirm")}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
