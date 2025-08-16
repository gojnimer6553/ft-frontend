import { useTranslate } from "@tolgee/react";

export function ChatHeader() {
  const { t } = useTranslate();
  return (
    <header className="w-full max-w-2xl py-2">
      <h2 className="text-lg font-medium">{t("chat.title")}</h2>
    </header>
  );
}
