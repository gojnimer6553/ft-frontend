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
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslate } from "@tolgee/react";
import { toast } from "sonner";

export const Route = createFileRoute("/waitlist")({
  component: WaitlistPage,
});

function WaitlistPage() {
  const { t } = useTranslate();

  const formSchema = z.object({
    email: z
      .string()
      .nonempty({ message: t("validation.required") })
      .email(t("validation.invalidEmail")),
  });

  type FormValues = z.infer<typeof formSchema>;

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (_values: FormValues) => {
    // Placeholder for submission logic
    toast.success(t("waitlist.success"));
    formMethods.reset();
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 p-6 text-center">
          <img
            src="/assets/mascot/mascot_full_body.png"
            alt="Mascot"
            className="h-32 w-32 object-contain"
          />
          <h1 className="text-2xl font-bold">{t("waitlist.title")}</h1>
          <p className="text-muted-foreground">
            {t("waitlist.description")}
          </p>
          <Form {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-4"
            >
              <FormField
                control={formMethods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("waitlist.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("waitlist.email-placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t("waitlist.button")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default WaitlistPage;

