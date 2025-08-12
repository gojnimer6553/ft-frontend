/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_PUBLIC_ENDPOINT: string;
  readonly VITE_APP_TOLGEE_API_URL: string;
  readonly VITE_APP_TOLGEE_API_KEY: string;
  readonly VITE_TRANSLATION_BUCKET_URL: string;
  readonly VITE_TRANSLATION_DELIVERY_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
