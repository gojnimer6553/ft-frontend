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
import { account } from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/__authenticationLayout/recover/")({
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
  type FormValues = z.infer<typeof formSchema>;
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) =>
      account.createRecovery(
        data.email,
        `${window.location.origin}/recover/reset`
      ),
    onSuccess: () => {
      toast.success(t("recover.success"));
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-6 text-center">
                <img
                  src="/assets/mascot/mascot_worried_face.png"
                  alt={t("recover.title")}
                  className="w-40"
                />
                <h1 className="text-2xl font-bold">{t("recover.title")}</h1>
                <p className="text-balance text-muted-foreground">
                  {t("recover.description")}
                </p>
              </div>
              <Form {...formMethods}>
                <form
                  className="grid gap-6"
                  onSubmit={formMethods.handleSubmit((values) => mutate(values))}
                >
                  <FormField
                    control={formMethods.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("recover.email")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("recover.emailPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    loading={
                      isPending ? `${t("feedback.loading")}...` : undefined
                    }
                    type="submit"
                    className="w-full"
                  >
                    {t("recover.submit")}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
