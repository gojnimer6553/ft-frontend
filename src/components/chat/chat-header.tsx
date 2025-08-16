import { useTranslate } from "@tolgee/react";

export function ChatHeader() {
  const { t } = useTranslate();
  return (
    <div className="w-full max-w-2xl border-b px-4 py-3">
      <h2 className="text-lg font-semibold">{t("chat.title")}</h2>
    </div>
  );
}
