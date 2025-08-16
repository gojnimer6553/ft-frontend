import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact-us")({
  component: ContactUsPage,
});

function ContactUsPage() {
  const { t } = useTranslate();

  const formSchema = z.object({
    email: z.string().email({ message: t("validation.invalidEmail") }),
    message: z.string().min(1, { message: t("validation.required") }),
  const formSchema = useMemo(
    () =>
      z.object({
        email: z.string().email({ message: t("validation.invalidEmail") }),
        message: z.string().min(1, { message: t("validation.required") }),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast.success(t("contact.success"));
    form.reset();
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/assets/mascot/mascot_detective.png"
            alt={t("contact.title")}
            className="w-40"
          />
          <h1 className="text-3xl font-bold">{t("contact.title")}</h1>
          <p className="text-muted-foreground">{t("contact.description")}</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-4"
            >
              <FormField
                control={form.control}
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
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.message")}</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder={t("contact.messagePlaceholder")}
                        className="min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}
