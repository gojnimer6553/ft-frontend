import FormBase from "@/components/common/FormBase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { account } from "@/lib/appwrite";
import { availableLanguages } from "@/lib/tolgee";
import { useTolgee, useTranslate } from "@tolgee/react";
import type { Models } from "appwrite";
import { toast } from "sonner";

export default function LanguageSelect() {
  const { t } = useTranslate();
  const tolgee = useTolgee(["language"]);
  const changeLanguage = (language: string) => {
    tolgee.changeLanguage(language);
    account
      .updatePrefs({ language } as Models.Preferences)
      .then(() => toast.success(t("settings.languageUpdated")));
  };
  return (
    <FormBase label={t("settings.language")}> 
      <Select value={tolgee.getLanguage()} onValueChange={changeLanguage}>
        <SelectTrigger size="default" className="w-full">
          <SelectValue placeholder={t("tolgee.changeLanguage")} />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormBase>
  );
}
