import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { AlertCircleIcon } from "lucide-react";
import React, { useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import FormBase from "@/components/common/FormBase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PromptPasswordRefProps {
  prompt: (
    action: (password: string) => unknown | Promise<unknown>,
    success?: (actionData: unknown) => void,
    error?: (error: Error, close: () => void) => void,
    interactionClose?: () => void
  ) => void;
}

type PromptPasswordRef = React.Ref<PromptPasswordRefProps>;

export default function PromptPassword(props: { ref: PromptPasswordRef }) {
  const { t } = useTranslate();

  const formSchema = z.object({
    password: z
      .string()
      .min(8, {
        error: t("validation.passwordMin", { count: 8 }),
      })
      .nonempty({ message: t("validation.required") }),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [promptConfig, setPromptConfig] = useState<
    | {
        action: (password: string) => unknown | Promise<unknown>;
        success: ((actionData: unknown) => void) | undefined;
        error: ((error: Error, close: () => void) => void) | undefined;
        interactionClose?: () => void;
      }
    | undefined
  >();

  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "" },
  });

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: async (data: { password: string }) => {
      return await promptConfig?.action(data.password);
    },
    onSuccess: (actionData) => {
      if (promptConfig?.success) {
        promptConfig.success(actionData);
      }
      setIsOpen(false);
    },
    onError: (error: any) => {
      formMethods.reset();
      promptConfig?.error?.(error, () => setIsOpen(false));
    },
  });

  useImperativeHandle(props.ref, () => ({
    prompt: (action, success, error, interactionClose) => {
      setPromptConfig({
        action,
        success,
        error,
        interactionClose,
      });
      setIsOpen(true);
    },
  }));

  return (
    <Credenza
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          formMethods.reset();
          setPromptConfig(undefined);
          reset();
          promptConfig?.interactionClose?.();
        }
        setIsOpen(open);
      }}
    >
      <CredenzaContent>
        <Form {...formMethods}>
          <form
            className="contents"
            onSubmit={formMethods.handleSubmit((data) => mutate(data))}
          >
            <CredenzaHeader>
              <CredenzaTitle>{t("promptPassword.title")}</CredenzaTitle>
              <CredenzaDescription className="text-destructive">
                {t("promptPassword.description")}
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody className="pb-4 flex flex-col gap-4">
              <FormBase>
                <FormField
                  control={formMethods.control}
                  name="password"
                  render={({ field }) => (
                    <FormBase>
                      <Input
                        placeholder={t("register.password-placeholder")}
                        disabled={isPending}
                        type="password"
                        {...field}
                      />
                    </FormBase>
                  )}
                />
              </FormBase>
              {isError && error.type === "user_invalid_credentials" && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>{t(`validation.error`)}</AlertTitle>
                  <AlertDescription>
                    {t(`appwrite.errors.${error.type}.description`)}
                  </AlertDescription>
                </Alert>
              )}
            </CredenzaBody>
            <CredenzaFooter className="justify-end">
              <Button
                type="submit"
                className="ml-2"
                disabled={isPending}
                loading={isPending}
              >
                {t("promptPassword.submit")}
              </Button>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}

export type { PromptPasswordRef, PromptPasswordRefProps };
