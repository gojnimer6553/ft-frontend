import { useEffect } from "react";
import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";
import { useTolgee } from "@tolgee/react";
import useSession from "@/hooks/queries/user";

export const languageStore = new Store("pt-BR");

export function useLanguageStore() {
  const { data: session } = useSession();
  const tolgee = useTolgee(["language"]);
  const language = useStore(languageStore);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const lang = (session as any)?.prefs?.language || "pt-BR";
    tolgee.changeLanguage(lang);
    languageStore.setState(lang);
  }, []);

  return language;
}
