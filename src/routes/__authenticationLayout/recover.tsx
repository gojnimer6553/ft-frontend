import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { account } from "@/lib/appwrite";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/__authenticationLayout/recover")({
  component: RecoverPage,
});

function RecoverPage() {
  const { t } = useTranslate();
  const navigate = useNavigate({ from: "/recover" });
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "reset">("email");

  const emailSchema = z.object({
    email: z
      .string()
      .nonempty({ message: t("validation.required") })
      .refine((val) => z.email().safeParse(val).success, {
        message: t("validation.invalidEmail"),
      }),
  });

  type EmailFormValues = z.infer<typeof emailSchema>;

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const { mutate: sendCode, isPending: sending } = useMutation({
    mutationFn: (data: EmailFormValues) =>
      account.createRecovery(data.email, `${window.location.origin}/recover`),
    onSuccess: (res) => {
      setUserId(res.userId);
      setStep("reset");
      toast.success(t("recover.emailSent"));
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetSchema = z
    .object({
      code: z.string().min(1, { message: t("validation.required") }),
      password: z
        .string()
        .nonempty({ message: t("validation.required") })
        .min(8, { message: t("validation.passwordMin", { count: 8 }) }),
      confirmPassword: z
        .string()
        .nonempty({ message: t("validation.required") })
        .min(8, { message: t("validation.passwordMin", { count: 8 }) }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("recover.passwordMismatch"),
    });

  type ResetFormValues = z.infer<typeof resetSchema>;

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  const { mutate: resetPassword, isPending: resetting } = useMutation({
    mutationFn: (data: ResetFormValues) =>
      account.updateRecovery(userId!, data.code, data.password),
    onSuccess: () => {
      toast.success(t("recover.success"));
      navigate({ to: "/login" });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="grid rounded-lg bg-background md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t("recover.title")}</h1>
              </div>
              {step === "email" && (
                <Form {...emailForm}>
                  <form
                    onSubmit={emailForm.handleSubmit((values) => sendCode(values))}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("login.email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("login.email-placeholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      loading={sending ? `${t("feedback.loading")}...` : undefined}
                    >
                      {t("recover.sendCode")}
                    </Button>
                  </form>
                </Form>
              )}
              {step === "reset" && (
                <Form {...resetForm}>
                  <form
                    onSubmit={resetForm.handleSubmit((values) => resetPassword(values))}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      control={resetForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("recover.code")}</FormLabel>
                          <FormControl>
                            <InputOTP
                              maxLength={6}
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <InputOTPGroup>
                                {Array.from({ length: 6 }).map((_, i) => (
                                  <InputOTPSlot key={i} index={i} />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("recover.newPassword")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t("recover.newPassword")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("recover.confirmPassword")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t("recover.confirmPassword")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      loading={
                        resetting ? `${t("feedback.loading")}...` : undefined
                      }
                    >
                      {t("recover.submit")}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
          <div className="relative hidden bg-background md:flex md:items-center md:justify-center">
            <img
              src="/assets/mascot/mascot_worried_face.png"
              alt={t("recover.title")}
              className="w-60 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoverPage;

