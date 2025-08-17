import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import useSession from "@/hooks/queries/user";
import { toast } from "sonner";
import { useTolgee, useTranslate } from "@tolgee/react";

export function UpdatePreferencesForm({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const tolgee = useTolgee(["language"]);
  const { t } = useTranslate();
  const schema = z.object({
    language: z.string().min(1),
    newsletter: z.boolean().optional(),
  });
  const form = useForm<{ language: string; newsletter?: boolean }>({
    resolver: zodResolver(schema),
    defaultValues: {
      language: (session?.prefs as any)?.language ?? tolgee.getLanguage(),
      newsletter: (session?.prefs as any)?.newsletter ?? false,
    },
  });
  useEffect(() => {
    form.reset({
      language: (session?.prefs as any)?.language ?? tolgee.getLanguage(),
      newsletter: (session?.prefs as any)?.newsletter ?? false,
    });
  }, [session, tolgee]);

  const mutation = useMutation({
    mutationFn: ({ language, newsletter }: { language: string; newsletter?: boolean }) =>
      account.updatePrefs({ language, newsletter }),
    onSuccess: (_, values) => {
      tolgee.changeLanguage(values.language);
      queryClient.setQueryData(["session"], (old: any) => ({
        ...old,
        prefs: { ...(old?.prefs ?? {}), language: values.language, newsletter: values.newsletter },
      }));
      toast.success(t("settings.preferences.success"));
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className={`space-y-4 rounded-lg border p-4 ${className ?? ""}`}>
      <h2 className="text-lg font-semibold">{t("settings.preferences.title")}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.preferences.language")}</FormLabel>
                <FormControl>
                  <select {...field} className="w-full rounded border px-2 py-1">
                    <option value="en">{t("settings.preferences.english")}</option>
                    <option value="pt-BR">{t("settings.preferences.portuguese")}</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newsletter"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </FormControl>
                <FormLabel className="!mt-0">{t("settings.preferences.newsletter")}</FormLabel>
              </FormItem>
            )}
          />
          <Button type="submit" loading={mutation.status === "pending"}>
            {t("settings.save")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
