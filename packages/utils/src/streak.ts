import { addDays, toDateKey } from "./date.js";

/**
 * Current streak: consecutive completed days ending today,
 * or ending yesterday if today is not done yet (streak still alive).
 */
export function currentStreak(completed: Iterable<string>, today: string = toDateKey(new Date())): number {
  const set = new Set(completed);
  let cursor = set.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (set.has(cursor)) { n++; cursor = addDays(cursor, -1); }
  return n;
}

/** Longest run of consecutive completed days. */
export function longestStreak(completed: Iterable<string>): number {
  const keys = [...new Set(completed)].sort();
  let best = 0, run = 0, prev: string | null = null;
  for (const k of keys) {
    run = prev && addDays(prev, 1) === k ? run + 1 : 1;
    best = Math.max(best, run); prev = k;
  }
  return best;
}
