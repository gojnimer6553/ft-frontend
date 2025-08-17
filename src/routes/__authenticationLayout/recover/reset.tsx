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
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";

interface ResetSearch {
  userId: string;
  secret: string;
}

export const Route = createFileRoute("/__authenticationLayout/recover/reset")({
  component: RouteComponent,
  beforeLoad: ({ search }) => {
    if (!search.userId || !search.secret)
      throw redirect({ to: "/recover" });
  },
  validateSearch: (search: Record<string, unknown>): ResetSearch => {
    return {
      userId: search.userId as string,
      secret: search.secret as string,
    };
  },
});

function RouteComponent() {
  const { t } = useTranslate();
  const navigate = useNavigate({ from: "/recover/reset" });
  const { userId, secret } = Route.useSearch();

  const formSchema = z
    .object({
      password: z
        .string()
        .nonempty({ message: t("validation.required") })
        .min(8, { message: t("validation.passwordMin", { count: 8 }) }),
      confirmPassword: z.string().nonempty({ message: t("validation.required") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

  type FormValues = z.infer<typeof formSchema>;
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) =>
      account.updateRecovery(userId, secret, data.password),
    onSuccess: () => navigate({ to: "/recover/success" }),
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-6 text-center">
                <img
                  src="/assets/mascot/mascot_sad_face.png"
                  alt={t("resetPassword.title")}
                  className="w-40"
                />
                <h1 className="text-2xl font-bold">{t("resetPassword.title")}</h1>
              </div>
              <Form {...formMethods}>
                <form
                  className="grid gap-6"
                  onSubmit={formMethods.handleSubmit((values) => mutate(values))}
                >
                  <FormField
                    control={formMethods.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("resetPassword.password")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("resetPassword.passwordPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formMethods.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("resetPassword.confirmPassword")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("resetPassword.confirmPasswordPlaceholder")}
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
                    {t("resetPassword.submit")}
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
