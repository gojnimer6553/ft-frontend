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
import { APPWRITE_FUNCTION_ID } from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "@tolgee/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useFunction from "@/hooks/use-function";

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

  const { mutate } = useFunction(APPWRITE_FUNCTION_ID);

  const onSubmit = (values: FormValues) => {
    mutate(
      { body: values, path: "/feedback" },
      {
        onSuccess: () => {
          toast.success(t("feedback.success"));
          formMethods.reset();
          onSubmitted?.();
        },
        onError: (err: any) => {
          toast.error(err.message);
        },
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
        <Button type="submit" className="w-full">
          {t("feedback.submit")}
        </Button>
      </form>
    </Form>
  );
}

