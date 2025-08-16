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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "@tolgee/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSession from "@/hooks/queries/user";
import { toast } from "sonner";
import { z } from "zod";

interface ContactFormProps {
  className?: string;
  onSubmitted?: () => void;
}

export function ContactForm({ className, onSubmitted }: ContactFormProps) {
  const { t } = useTranslate();
  const session = useSession().data;

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
    defaultValues: { email: session?.email ?? "", message: "" },
  });

  useEffect(() => {
    if (session?.email) {
      formMethods.setValue("email", session.email);
    }
  }, [session, formMethods]);

  const onSubmit = () => {
    toast.success(t("contact.success"));
    formMethods.reset({ email: session?.email ?? "", message: "" });
    onSubmitted?.();
  };

  return (
    <Form {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-4", className)}
      >
        {!session && (
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
        )}
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
  );
}
