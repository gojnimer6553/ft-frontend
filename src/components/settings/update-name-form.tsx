import { useEffect } from "react";
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

  function handleSubmit(values: { name: string }) {
    mutation.mutate(values);
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
    </div>
  );
}
