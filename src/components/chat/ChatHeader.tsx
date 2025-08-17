import { useTranslate } from "@tolgee/react";

export function ChatHeader() {
  const { t } = useTranslate();
  return <h2 className="text-lg font-medium">{t("chat.title")}</h2>;
}
