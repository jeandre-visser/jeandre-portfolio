import { lazy, Suspense } from "react";
import App from "./App";

// The /work page carries its own animated renders, so the home page does not load them.
const WorkPage = lazy(() =>
  import("./WorkPage").then((module) => ({ default: module.WorkPage })),
);

// Pages are separate documents, so routing only needs to read the path once.
// public/_redirects sends every path to index.html on Netlify.
export function Router() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/work" || path.startsWith("/work/")) {
    return (
      <Suspense fallback={null}>
        <WorkPage />
      </Suspense>
    );
  }
  return <App />;
}
