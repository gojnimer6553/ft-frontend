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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useExecution from "@/hooks/use-execution";

interface FeedbackFormProps {
  className?: string;
  onSubmitted?: () => void;
}

export function FeedbackForm({ className, onSubmitted }: FeedbackFormProps) {
  const { t } = useTranslate();

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

  const { mutate, status } = useExecution();

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        functionId: "689feffd0007270a4aa1",
        path: "/feedback",
        method: "POST",
        body: values,
      },
      {
        onSuccess: () => {
          toast.success(t("feedback.success"));
          formMethods.reset();
          onSubmitted?.();
        },
        onError: () => toast.error("Something went wrong."),
      }
    );
  };

  return (
    <Form {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-4", className)}
      >
        <FormField
          control={formMethods.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("feedback.email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("feedback.emailPlaceholder")}
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
              <FormLabel>{t("feedback.message")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("feedback.messagePlaceholder")}
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          loading={status === "pending" ? `${t("feedback.loading")}...` : undefined}
        >
          {t("feedback.submit")}
        </Button>
      </form>
    </Form>
  );
}

