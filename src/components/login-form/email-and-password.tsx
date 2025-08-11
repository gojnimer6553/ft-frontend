import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { account } from "@/lib/appwrite";
import { toast } from "sonner";
import { useNavigate, useSearch } from "@tanstack/react-router";

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
  const redirectParams = useSearch({
    strict: false,
    // @ts-expect-error
    select: (s) => s.redirect,
  }) as any;
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Digite aqui..." {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite aqui..."
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
