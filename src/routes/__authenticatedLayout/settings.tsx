import FormBase from "@/components/form-base";
import PromptPassword, {
  type PromptPasswordRefProps,
} from "@/components/prompt-password";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSession from "@/hooks/queries/user";
import { account } from "@/lib/appwrite";
import { availableLanguages } from "@/lib/tolgee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  useTolgee,
  useTranslate,
  type DefaultParamType,
  type TFnType,
  type TranslationKey,
} from "@tolgee/react";
import type { Models } from "appwrite";
import { useEffect, useRef } from "react";
import { useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const Route = createFileRoute("/__authenticatedLayout/settings")({
  component: RouteComponent,
  onLeave: () => {
    toast.dismiss("settings-save-alert");
  },
});

const settingsSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(5).max(100).optional(),
});

interface UpdateMethod {
  needPasswordConfirmation?: boolean;
  fn: (...props: any[]) => Promise<any>;
}

const updateMethods: Record<string, UpdateMethod> = {
  name: { fn: (...props: [string]) => account.updateName(...props) },
  phone: {
    fn: (...props: [string, string]) => account.updatePhone(...props),
    needPasswordConfirmation: true,
  },
};

const objectToArray = (obj: Record<string, unknown>) => {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
};

const mutationFn =
  (
    promptPasswordRef: React.RefObject<PromptPasswordRefProps | null>,
    t: TFnType<DefaultParamType, string, TranslationKey>
  ) =>
  async (props: {
    values: z.infer<typeof settingsSchema>;
    dirtyFields: Record<string, boolean>;
  }) => {
    const updates = objectToArray(props.dirtyFields).map((fieldName) => ({
      ...updateMethods[fieldName.key],
      newValue: props.values[fieldName.key as keyof typeof props.values],
    }));
    const needPasswordConfirmation = updates.some(
      (update) => update.needPasswordConfirmation
    );
    const generatePromise = (password: string = "") =>
      Promise.all(
        updates.map(({ fn, newValue }) => {
          return (fn as Function)(newValue, password);
        })
      );
    if (needPasswordConfirmation) {
      return new Promise((resolve, reject) => {
        promptPasswordRef.current?.prompt(
          generatePromise,
          resolve,
          undefined,
          () => reject(new Error(t("settings.interactionCancelled")))
        );
      });
    }
    return generatePromise();
  };

const LanguageSelect = () => {
  const { t } = useTranslate();
  const tolgee = useTolgee(["language"]);
  const changeLanguage = (language: string) => {
    tolgee.changeLanguage(language);
    account
      .updatePrefs({ language } as Models.Preferences)
      .then(() => toast.success(t("settings.languageUpdated")));
  };
  return (
    <Select value={tolgee.getLanguage()} onValueChange={changeLanguage}>
      <SelectTrigger size="default" className="w-full">
        <SelectValue placeholder={t("tolgee.changeLanguage")} />
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem value={lang}>{lang}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
function RouteComponent() {
  const submitRef = useRef<HTMLButtonElement>(null);
  const promptPasswordRef = useRef<PromptPasswordRefProps>(null);
  const { t } = useTranslate();
  const { data: sessionData } = useSession();
  const session = sessionData as Models.User<Models.Preferences>;

  const showSaveToast = () =>
    toast("You have unsaved changes", {
      id: "settings-save-alert",
      duration: Infinity,
      action: { label: "Apply", onClick: () => submitRef.current?.click() },
      position: "bottom-center",
    });

  const { mutate, isPending } = useMutation({
    mutationFn: (params: {
      values: z.infer<typeof settingsSchema>;
      dirtyFields: Record<string, boolean>;
    }) => {
      const mutationPromise = mutationFn(promptPasswordRef, t)(params);
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
    <>
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
    </>
  );
}
