import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import { toast } from "sonner";
import { OtpCredenza } from "./otp-credenza";

export function UpdatePasswordForm() {
  const schema = z.object({
    oldPassword: z.string().min(1),
    password: z.string().min(8),
  });
  const form = useForm<{ oldPassword: string; password: string }>({
    resolver: zodResolver(schema),
    defaultValues: { oldPassword: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: ({ password, oldPassword }: { password: string; oldPassword: string }) =>
      account.updatePassword(password, oldPassword),
    onSuccess: () => {
      toast.success("Password updated");
      form.reset();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const [otpOpen, setOtpOpen] = useState(false);
  const [pending, setPending] = useState<{ oldPassword: string; password: string }>();

  function handleSubmit(values: { oldPassword: string; password: string }) {
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
      <h2 className="text-lg font-semibold">Update Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
                <FormLabel>New Password</FormLabel>
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
