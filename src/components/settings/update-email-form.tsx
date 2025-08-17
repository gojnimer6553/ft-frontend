import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { account } from "@/lib/appwrite";
import useSession from "@/hooks/queries/user";
import { toast } from "sonner";
import { PasswordCredenza } from "./password-credenza";
import { useTranslate } from "@tolgee/react";

export function UpdateEmailForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { t } = useTranslate();
  const schema = z.object({ email: z.string().email() });
  const form = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    defaultValues: { email: session?.email ?? "" },
  });
  useEffect(() => {
    form.reset({ email: session?.email ?? "" });
  }, [session]);

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      account.updateEmail(email, password),
    onSuccess: (_, values) => {
      queryClient.setQueryData(["session"], (old: any) => ({ ...old, email: values.email }));
      toast.success(t("settings.updateEmail.success"));
    },
    onError: (err: any) => toast.error(err.message),
  });

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>();

  function handleSubmit(values: { email: string }) {
    setPendingEmail(values.email);
    setPasswordOpen(true);
  }

  function confirmPassword(password: string) {
    if (pendingEmail) {
      mutation.mutate({ email: pendingEmail, password });
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">{t("settings.updateEmail.title")}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.updateEmail.email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={mutation.status === "pending"}
                    onBlur={() => {
                      field.onBlur();
                      form.handleSubmit(handleSubmit)();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <PasswordCredenza
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        onConfirm={(password) => {
          setPasswordOpen(false);
          confirmPassword(password);
        }}
      />
    </div>
  );
}
