import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslate } from "@tolgee/react";

export const Route = createFileRoute("/waitlist")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslate();

  const formSchema = z.object({
    email: z
      .string()
      .nonempty({ message: t("validation.required") })
      .refine((val) => z.string().email().safeParse(val).success, {
        message: t("validation.invalidEmail"),
      }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: FormValues) {
    toast.success(t("waitlist.success"));
    formMethods.reset();
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-md overflow-hidden">
        <CardContent className="flex flex-col items-center gap-6 p-6">
          <img
            src="/assets/mascot/mascot_full_body.png"
            alt={t("waitlist.title")}
            className="h-40 w-40 object-contain"
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">{t("waitlist.title")}</h1>
            <p className="text-muted-foreground">
              {t("waitlist.description")}
            </p>
          </div>
          <Form {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(onSubmit)}
              className="flex w-full gap-2"
            >
              <FormField
                control={formMethods.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("waitlist.emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{t("waitlist.joinButton")}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

