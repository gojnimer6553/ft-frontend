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
import { useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const EmailAndPasswordForm = () => {
  const { t } = useTranslate();

  const formSchema = z.object({
    email: z
      .string()
      .nonempty({ message: t("validation.required") })
      .refine((val) => z.email().safeParse(val).success, {
        message: t("validation.invalidEmail"),
      }),
    password: z
      .string()
      .nonempty({ message: t("validation.required") })
      .min(8, {
        message: t("validation.passwordMin", { count: 8 }),
      }),
  });

  type IFormValues = z.infer<typeof formSchema>;

  const redirectParams = useSearch({
    from: "/__authenticationLayout",
    select: (s) => s.redirect,
  });
  const navigate = useNavigate({
    from: "/login",
  });
  const formMethods = useForm<IFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: (data: IFormValues) =>
      account.createEmailPasswordSession(data.email, data.password),
    onSuccess: () =>
      navigate({
        to: redirectParams ?? "/",
      }),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Form {...formMethods}>
      <form
        className="grid gap-6"
        onSubmit={formMethods.handleSubmit((values) => mutate(values))}
      >
        <div className="grid gap-3">
          <FormField
            control={formMethods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("login.email-placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3">
          <FormField
            control={formMethods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.password")}</FormLabel>
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
        </div>
        <div className="text-right text-sm">
          <Link
            to="/recover"
            search={{ userId: undefined, secret: undefined }}
            className="underline underline-offset-4"
          >
            {t("login.forgotPassword")}
          </Link>
        </div>
        <Button
          loading={isPending ? `${t("feedback.loading")}...` : undefined}
          type="submit"
          className="w-full"
        >
          {t("login.login")}
        </Button>
      </form>
    </Form>
  );
};

export default EmailAndPasswordForm;
