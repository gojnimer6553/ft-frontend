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
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { ID } from "appwrite";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const RegisterEmailAndPasswordForm = () => {
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
    from: "/register",
  });
  const formMethods = useForm<IFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: IFormValues) => {
      await account.create(ID.unique(), data.email, data.password);
      return account.createEmailPasswordSession(data.email, data.password);
    },
    onSuccess: () =>
      navigate({
        to: redirectParams ?? "/",
      }),
    onError: (err: any) => {
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
                <FormLabel>{t("register.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("register.email-placeholder")}
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
                <FormLabel>{t("register.password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("register.password-placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          loading={isPending ? `${t("feedback.loading")}...` : undefined}
          type="submit"
          className="w-full"
        >
          {t("register.signUp")}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterEmailAndPasswordForm;
