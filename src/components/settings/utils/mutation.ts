import type { PromptPasswordRefProps } from "@/components/prompt-password";
import { account } from "@/lib/appwrite";
import { objectToArray } from "@/lib/utils";
import {
  type DefaultParamType,
  type TFnType,
  type TranslationKey,
} from "@tolgee/react";
import type { RefObject } from "react";
import { toast } from "sonner";

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

const createMutationFn =
  (
    promptPasswordRef: RefObject<PromptPasswordRefProps | null>,
    t: TFnType<DefaultParamType, string, TranslationKey>,
    toastId: string
  ) =>
  async (props: {
    values: Record<string, any>;
    dirtyFields: Record<string, boolean>;
  }) => {
    const updates = objectToArray(props.dirtyFields).map((fieldName) => ({
      ...updateMethods[fieldName.key],
      newValue: props.values[fieldName.key],
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
      toast.dismiss(toastId);
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

export { createMutationFn };
