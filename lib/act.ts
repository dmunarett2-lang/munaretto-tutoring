import type { ActTest } from "./types";

/**
 * ACT composite = stored value, or the rounded average of English, Math, and
 * Reading. Science is tracked but intentionally NOT part of the composite.
 */
export function composite(t: ActTest): number | null {
  if (t.composite != null) return t.composite;
  const core = [t.english, t.math, t.reading];
  if (core.every((x) => x != null)) {
    return Math.round((core as number[]).reduce((a, b) => a + b, 0) / 3);
  }
  return null;
}

/** Format a 'YYYY-MM-DD' date without timezone drift. */
export function formatTestDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
