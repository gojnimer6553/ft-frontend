import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { account } from "@/lib/appwrite";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslate } from "@tolgee/react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/__authenticationLayout/recover")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    userId: search.userId as string | undefined,
    secret: search.secret as string | undefined,
  }),
});

function RouteComponent() {
  const { userId, secret } = Route.useSearch();
  return userId && secret ? (
    <ResetPasswordForm userId={userId} secret={secret} />
  ) : (
    <RequestForm />
  );
}

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6">{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RequestForm() {
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
      account.createRecovery(data.email, `${window.location.origin}/recover`),
    onSuccess: () => {
      toast.success(t("recover.emailSent"));
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("recover.title")}</h1>
        </div>
        <Form {...formMethods}>
          <form
            className="grid gap-4"
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
              loading={isPending ? `${t("feedback.loading")}...` : undefined}
              type="submit"
              className="w-full"
            >
              {t("recover.send")}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm">
          <Link to="/login" className="underline underline-offset-4">
            {t("register.login")}
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}

function ResetPasswordForm({
  userId,
  secret,
}: {
  userId: string;
  secret: string;
}) {
  const { t } = useTranslate();
  const navigate = useNavigate({ from: "/recover" });

  const formSchema = z
    .object({
      password: z
        .string()
        .nonempty({ message: t("validation.required") })
        .min(8, { message: t("validation.passwordMin", { count: 8 }) }),
      confirmPassword: z
        .string()
        .nonempty({ message: t("validation.required") }),
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
    onSuccess: () => {
      navigate({ to: "/password-changed" });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("recover.title")}</h1>
        </div>
        <Form {...formMethods}>
          <form
            className="grid gap-4"
            onSubmit={formMethods.handleSubmit((values) => mutate(values))}
          >
            <FormField
              control={formMethods.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("recover.newPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("login.password-placeholder")}
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
                  <FormLabel>{t("recover.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("login.password-placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              loading={isPending ? `${t("feedback.loading")}...` : undefined}
              type="submit"
              className="w-full"
            >
              {t("recover.submit")}
            </Button>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
}

export default RouteComponent;
