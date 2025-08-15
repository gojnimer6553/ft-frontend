import {
  BackendFetch,
  DevTools,
  FormatSimple,
  LanguageDetector,
  LanguageStorage,
  Tolgee,
  TolgeeProvider,
} from "@tolgee/react";
const {
  VITE_APP_TOLGEE_API_URL: tolgeeApiUrl,
  VITE_APP_TOLGEE_API_KEY: tolgeeApiKey,
  VITE_TRANSLATION_BUCKET_URL: translationBucketUrl,
  VITE_TRANSLATION_DELIVERY_ID: translationBucketDeliveryId,
} = import.meta.env;

export default Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .use(LanguageStorage())
  .use(LanguageDetector())
  .use(
    BackendFetch({
      prefix: `${translationBucketUrl}/${translationBucketDeliveryId}`,
    })
  )
  .init({
    defaultLanguage: "pt-BR",
    availableLanguages: ["en", "pt-BR"],
    // for development
    apiUrl: tolgeeApiUrl,
    apiKey: tolgeeApiKey,
  });

export { TolgeeProvider };
