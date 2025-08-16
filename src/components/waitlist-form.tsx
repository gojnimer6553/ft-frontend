import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "@tolgee/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { functions } from "@/lib/appwrite";
import { ExecutionMethod } from "appwrite";

interface WaitlistFormProps {
  className?: string;
  onSubmitted?: () => void;
}

export function WaitlistForm({ className, onSubmitted }: WaitlistFormProps) {
  const { t } = useTranslate();

  const formSchema = z.object({
    email: z
      .string()
      .nonempty({ message: t("validation.required") })
      .email({ message: t("validation.invalidEmail") }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await functions.createExecution(
        "689feffd0007270a4aa1",
        JSON.stringify(values),
        false,
        "/waitlist",
        ExecutionMethod.POST
      );
      toast.success(t("waitlist.success"));
      formMethods.reset();
      onSubmitted?.();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Form {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-4", className)}
      >
        <FormField
          control={formMethods.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("waitlist.emailPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {t("waitlist.submit")}
        </Button>
      </form>
    </Form>
  );
}

