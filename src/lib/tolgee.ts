import { FormatIcu } from "@tolgee/format-icu";
import {
  BackendFetch,
  DevTools,
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

const availableLanguages = ["en", "pt-BR"];
export default Tolgee()
  .use(DevTools())
  .use(FormatIcu())
  .use(LanguageStorage())
  .use(LanguageDetector())
  .use(
    BackendFetch({
      prefix: `${translationBucketUrl}/${translationBucketDeliveryId}`,
    })
  )
  .init({
    defaultLanguage: "pt-BR",
    availableLanguages,
    // for development
    apiUrl: tolgeeApiUrl,
    apiKey: tolgeeApiKey,
  });

export { availableLanguages, TolgeeProvider };
