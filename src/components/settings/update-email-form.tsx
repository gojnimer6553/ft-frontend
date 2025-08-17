import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import useSession from "@/hooks/queries/user";
import { toast } from "sonner";
import { PasswordCredenza } from "./password-credenza";

export function UpdateEmailForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
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
      toast.success("Email updated");
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
      <h2 className="text-lg font-semibold">Update Email</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" loading={mutation.status === "pending"}>
            Save
          </Button>
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
