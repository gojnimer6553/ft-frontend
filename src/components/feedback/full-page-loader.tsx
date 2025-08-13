import { useTranslate } from "@tolgee/react";

export default function FullPageLoader() {
  const { t } = useTranslate();
  return (
    <div className="flex items-center flex-col justify-center w-dvw h-dvh px-6 gap-4">
      <img
        className="size-96 object-scale-down rounded-full animate-pulse"
        src="/assets/main-logo.png"
      />
      {
        <p className="font-mono text-2xl animate-pulse">
          {t("feedback.loading")} ...
        </p>
      }
    </div>
  );
}
