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

export function UpdatePhoneForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { t } = useTranslate();
  const schema = z.object({ phone: z.string().min(1) });
  const form = useForm<{ phone: string }>({
    resolver: zodResolver(schema),
    defaultValues: { phone: session?.phone ?? "" },
  });
  useEffect(() => {
    form.reset({ phone: session?.phone ?? "" });
  }, [session]);

  const mutation = useMutation({
    mutationFn: ({ phone, password }: { phone: string; password: string }) =>
      account.updatePhone(phone, password),
    onSuccess: () => {
      toast.success(t("settings.updatePhone.success"));
      form.reset({ phone: "" });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string>();

  function handleSubmit(values: { phone: string }) {
    setPendingPhone(values.phone);
    setPasswordOpen(true);
  }

  function confirmPassword(password: string) {
    if (pendingPhone) {
      mutation.mutate({ phone: pendingPhone, password });
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">{t("settings.updatePhone.title")}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.updatePhone.phone")}</FormLabel>
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
