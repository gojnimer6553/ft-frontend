import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import reportWebVitals from "./reportWebVitals.ts";
import "./styles.css";

import {
  BackendFetch,
  DevTools,
  FormatSimple,
  LanguageDetector,
  LanguageStorage,
  Tolgee,
  TolgeeProvider,
} from "@tolgee/react";
import FullPageLoader from "./components/FullPageLoader.tsx";

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .use(LanguageStorage())
  .use(LanguageDetector())
  .use(
    BackendFetch({
      prefix:
        "https://minio-cow0w00w0go4080kcggk4gos.guilhermekarine.com/tolgee-cdn-bucket-main/24d986b640d147718e690a282a6da482",
    })
  )
  .init({
    defaultLanguage: "pt-BR",
    availableLanguages: ["en", "pt-BR"],
    // for development
    apiUrl: import.meta.env.VITE_APP_TOLGEE_API_URL,
    apiKey: import.meta.env.VITE_APP_TOLGEE_API_KEY,
  });

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    session: undefined,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultViewTransition: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TolgeeProvider tolgee={tolgee} fallback={<FullPageLoader />}>
        <RouterProvider router={router} />
      </TolgeeProvider>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((...props) => {
  console.log(...props);
  console.log(tolgee);
});
