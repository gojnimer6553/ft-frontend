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

export function UpdatePhoneForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const schema = z.object({
    phone: z.string().min(1),
    password: z.string().min(1),
  });
  const form = useForm<{ phone: string; password: string }>({
    resolver: zodResolver(schema),
    defaultValues: { phone: session?.phone ?? "", password: "" },
  });
  useEffect(() => {
    form.reset({ phone: session?.phone ?? "", password: "" });
  }, [session]);

  const mutation = useMutation({
    mutationFn: ({ phone, password }: { phone: string; password: string }) =>
      account.updatePhone(phone, password),
    onSuccess: () => {
      toast.success("Phone updated");
      form.reset({ phone: "", password: "" });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const [otpOpen, setOtpOpen] = useState(false);
  const [pending, setPending] = useState<{ phone: string; password: string }>();

  function handleSubmit(values: { phone: string; password: string }) {
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
      <h2 className="text-lg font-semibold">Update Phone</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
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
