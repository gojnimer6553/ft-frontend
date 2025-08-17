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
import { OtpCredenza } from "./otp-credenza";

export function UpdateEmailForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });
  const form = useForm<{ email: string; password: string }>({
    resolver: zodResolver(schema),
    defaultValues: { email: session?.email ?? "", password: "" },
  });
  useEffect(() => {
    form.reset({ email: session?.email ?? "", password: "" });
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

  const [otpOpen, setOtpOpen] = useState(false);
  const [pending, setPending] = useState<{ email: string; password: string }>();

  function handleSubmit(values: { email: string; password: string }) {
    setPending(values);
    setOtpOpen(true);
  }

  function confirmOtp() {
    if (pending) {
      mutation.mutate(pending);
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
      <OtpCredenza
        open={otpOpen}
        onOpenChange={setOtpOpen}
        onConfirm={() => {
          setOtpOpen(false);
          confirmOtp();
        }}
      />
    </div>
  );
}
