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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Campo obrigatório" })
    .refine((val) => z.email().safeParse(val).success, {
      message: "Email inválido",
    }),
  password: z
    .string()
    .nonempty({
      error: "Campo obrigatório",
    })
    .min(8, {
      error: "Mínimo de 8 caractéres",
    }),
});

type IFormValues = z.infer<typeof formSchema>;

const EmailAndPasswordForm = () => {
  const { t } = useTranslate();
  const redirectParams = useSearch({
    strict: false,
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
        <Button
          loading={isPending ? "Carregando..." : undefined}
          type="submit"
          className="w-full"
        >
          Login
        </Button>
      </form>
    </Form>
  );
};

export default EmailAndPasswordForm;
