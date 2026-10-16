import { useEffect } from "react";

/**
 * Content renders after the document loads, so the browser can miss a
 * `#section` in the URL when arriving from another page. Scroll to it once.
 */
export function useScrollToHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id)
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, []);
}
