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

export function UpdateNameForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const schema = z.object({ name: z.string().min(1) });
  const form = useForm<{ name: string }>({
    resolver: zodResolver(schema),
    defaultValues: { name: session?.name ?? "" },
  });
  useEffect(() => {
    form.reset({ name: session?.name ?? "" });
  }, [session]);

  const mutation = useMutation({
    mutationFn: ({ name }: { name: string }) => account.updateName(name),
    onSuccess: (_, values) => {
      queryClient.setQueryData(["session"], (old: any) => ({ ...old, name: values.name }));
      toast.success("Name updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const [otpOpen, setOtpOpen] = useState(false);
  const [pending, setPending] = useState<{ name: string }>();

  function handleSubmit(values: { name: string }) {
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
      <h2 className="text-lg font-semibold">Update Name</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
