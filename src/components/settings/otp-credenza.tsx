import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const otpSchema = z.object({ otp: z.string().min(1) });

export function OtpCredenza({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (otp: string) => void;
}) {
  const form = useForm<{ otp: string }>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Confirm Update</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form
              id="otp-form"
              onSubmit={form.handleSubmit(({ otp }) => {
                onConfirm(otp);
                form.reset();
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </CredenzaClose>
          <Button type="submit" form="otp-form">
            Confirm
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
