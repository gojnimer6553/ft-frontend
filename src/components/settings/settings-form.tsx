import FormBase from "@/components/form-base";
import PromptPassword, { type PromptPasswordRefProps } from "@/components/prompt-password";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useSession from "@/hooks/queries/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import type { Models } from "appwrite";
import { useEffect, useRef } from "react";
import { useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import LanguageSelect from "./language-select";
import { createMutationFn } from "./utils/mutation";

const settingsSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(5).max(100).optional(),
});

export function SettingsForm() {
  const submitRef = useRef<HTMLButtonElement>(null);
  const promptPasswordRef = useRef<PromptPasswordRefProps>(null);
  const { t } = useTranslate();
  const { data: sessionData } = useSession();
  const session = sessionData as Models.User<Models.Preferences>;

  const showSaveToast = () =>
    toast(t("settings.unsavedChanges"), {
      id: "settings-save-alert",
      duration: Infinity,
      action: { label: t("settings.apply"), onClick: () => submitRef.current?.click() },
      position: "bottom-center",
    });

  const { mutate, isPending } = useMutation({
    mutationFn: (params: {
      values: z.infer<typeof settingsSchema>;
      dirtyFields: Record<string, boolean>;
    }) => {
      const mutationPromise = createMutationFn(promptPasswordRef, t)(params);
      toast.promise(mutationPromise, {
        loading: t("settings.updating"),
        success: t("settings.updateSuccess"),
        error: (err) => err.message || t("settings.updateError"),
      });
      return mutationPromise;
    },
    onSuccess: (_data, context) => {
      formMethods.reset(context.values, { keepValues: true });
    },
    onError: () => {
      if (isDirty) showSaveToast();
    },
  });

  const formMethods = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: session.name,
      phone: session.phone || "",
    },
    disabled: isPending,
  });
  const { dirtyFields, isDirty } = useFormState({
    control: formMethods.control,
  });

  useEffect(() => {
    if (isDirty) showSaveToast();
    else toast.dismiss("settings-save-alert");
  }, [isDirty]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.description")}</p>
      </div>
      <Form {...formMethods}>
        <form
          className="contents"
          onSubmit={formMethods.handleSubmit((values) =>
            mutate({
              values,
              dirtyFields,
            })
          )}
        >
          <Card>
            <CardContent className="flex flex-col gap-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormBase label={t("settings.name")}>
                    <Input {...field} />
                  </FormBase>
                )}
              />
              <FormField
                name="phone"
                render={({ field }) => (
                  <FormBase label={t("settings.phone")}>
                    <Input {...field} />
                  </FormBase>
                )}
              />
              <LanguageSelect />
            </CardContent>
          </Card>
          <Button
            disabled={!isDirty}
            ref={submitRef}
            type="submit"
            className="hidden"
          />
        </form>
      </Form>
      <PromptPassword ref={promptPasswordRef} />
    </div>
  );
}
