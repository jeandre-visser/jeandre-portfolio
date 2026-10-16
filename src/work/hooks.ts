import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * Steps through `durations` (ms) in order while `isActive`, then wraps.
 * Pass a module-level array so the timer is not reset on every render.
 */
export function useSequence(durations: readonly number[], isActive: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const id = window.setTimeout(
      () => setIndex((current) => (current + 1) % durations.length),
      durations[index],
    );
    return () => window.clearTimeout(id);
  }, [durations, index, isActive]);

  return [index, setIndex] as const;
}
