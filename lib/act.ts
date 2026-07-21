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

export type Superscore = {
  english: number | null;
  math: number | null;
  reading: number | null;
  science: number | null;
  writing: number | null;
  composite: number | null;
};

/**
 * Superscore = the best score in each section across all tests. Composite is
 * the rounded average of the best English, Math, and Reading (Science excluded).
 */
export function superscore(tests: ActTest[]): Superscore {
  const best = (key: "english" | "math" | "reading" | "science" | "writing") => {
    const vals = tests.map((t) => t[key]).filter((v): v is number => v != null);
    return vals.length ? Math.max(...vals) : null;
  };
  const english = best("english");
  const math = best("math");
  const reading = best("reading");
  const compositeReady = english != null && math != null && reading != null;
  return {
    english,
    math,
    reading,
    science: best("science"),
    writing: best("writing"),
    composite: compositeReady ? Math.round((english + math + reading) / 3) : null,
  };
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
