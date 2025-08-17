import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useSession from "@/hooks/queries/user";
import useExecution from "@/hooks/use-execution";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "@tolgee/react";
import { ExecutionMethod } from "appwrite";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormBase from "./form-base";

interface ContactFormProps {
  className?: string;
  onSubmitted?: () => void;
}

export function ContactForm({ className, onSubmitted }: ContactFormProps) {
  const { t } = useTranslate();
  const session = useSession().data;
  const { mutate, status } = useExecution();

  const formSchema = z.object({
    email: z
      .string()
      .nonempty({ message: t("validation.required") })
      .email({ message: t("validation.invalidEmail") }),
    subject: z.string().nonempty({ message: t("validation.required") }),
    message: z.string().nonempty({ message: t("validation.required") }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: session?.email ?? "", subject: "", message: "" },
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        functionId: "689feffd0007270a4aa1",
        body: {
          email: values.email,
          subject: values.subject,
          message: values.message,
          userId: session?.$id ?? null,
        },
        path: "/contact",
        method: ExecutionMethod.POST,
      },
      {
        onSuccess: () => {
          toast.success(t("contact.success"));
          formMethods.reset({
            email: session?.email ?? "",
            subject: "",
            message: "",
          });
          onSubmitted?.();
        },
        onError: (err: any) => toast.error(err.message),
      }
    );
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
              <FormBase label={t("contact.email")}>
                <Input
                  type="email"
                  placeholder={t("contact.emailPlaceholder")}
                  {...field}
                />
              </FormBase>
            )}
          />
        )}
        <FormField
          control={formMethods.control}
          name="subject"
          render={({ field }) => (
            <FormBase label={t("contact.subject")}>
              <Input placeholder={t("contact.subjectPlaceholder")} {...field} />
            </FormBase>
          )}
        />
        <FormField
          control={formMethods.control}
          name="message"
          render={({ field }) => (
            <FormBase label={t("contact.message")}>
              <Textarea
                placeholder={t("contact.messagePlaceholder")}
                className="min-h-[120px]"
                {...field}
              />
            </FormBase>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          loading={
            status === "pending" ? `${t("feedback.loading")}...` : undefined
          }
        >
          {t("contact.submit")}
        </Button>
      </form>
    </Form>
  );
}
