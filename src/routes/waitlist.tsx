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
import { useTranslate } from "@tolgee/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export const Route = createFileRoute("/waitlist")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslate();

  const formSchema = z.object({
    email: z
      .string()
      .nonempty({ message: t("validation.required") })
      .refine((val) => z.email().safeParse(val).success, {
        message: t("validation.invalidEmail"),
      }),
  });

  type IFormValues = z.infer<typeof formSchema>;

  const formMethods = useForm<IFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = formMethods.handleSubmit((values) => {
    console.log("waitlist email", values.email);
    toast.success(t("waitlist.success"));
    formMethods.reset();
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <div className="w-full max-w-sm md:max-w-lg">
        <Card className="overflow-hidden">
          <CardContent className="p-0 md:grid md:grid-cols-2">
            <div className="flex flex-col gap-6 p-6 md:p-8">
              <div className="flex flex-col items-center text-center gap-2">
                <h1 className="text-2xl font-bold">{t("waitlist.joinWaitlist")}</h1>
                <p className="text-balance text-muted-foreground">
                  {t("waitlist.description")}
                </p>
              </div>
              <Form {...formMethods}>
                <form onSubmit={onSubmit} className="grid gap-4">
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
                    {t("waitlist.join")}
                  </Button>
                </form>
              </Form>
            </div>
            <div className="relative hidden bg-background md:flex md:items-center md:justify-center">
              <img
                src="/assets/mascot/mascot_thumbs_up.png"
                alt={t("waitlist.joinWaitlist")}
                className="w-52 object-contain"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RouteComponent;

