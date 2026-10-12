import { addDays, parseDateKey, toDateKey } from "./date.js";

export type Repeat = "daily" | "weekdays" | "weekends" | "custom";
export interface Habit { id: string; name: string; emoji: string; repeat: Repeat; days: number[]; reminder: string | null; createdAt: string }
export interface AppState { version: 1; onboarded: boolean; habits: Habit[]; logs: Record<string, string[]> }
export type DayStatus = "all" | "some" | "none" | "off";

export const emptyState = (): AppState => ({ version: 1, onboarded: false, habits: [], logs: {} });
export const STORAGE_KEY = "norric-seed:v1";

/** Days of week (0=Sun) a habit is scheduled on. */
export function scheduledDays(h: Pick<Habit, "repeat" | "days">): number[] {
  switch (h.repeat) {
    case "daily": return [0, 1, 2, 3, 4, 5, 6];
    case "weekdays": return [1, 2, 3, 4, 5];
    case "weekends": return [0, 6];
    case "custom": return [...h.days].sort();
  }
}
export function isScheduled(h: Habit, key: string): boolean {
  return key >= h.createdAt && scheduledDays(h).includes(parseDateKey(key).getDay());
}
export function isDone(s: AppState, habitId: string, key: string): boolean {
  return (s.logs[habitId] ?? []).includes(key);
}

let seq = 0;
export function addHabit(s: AppState, input: Omit<Habit, "id" | "createdAt"> & { id?: string }, today = toDateKey(new Date())): AppState {
  const id = input.id ?? `h_${Date.now().toString(36)}_${(seq++).toString(36)}`;
  const habit: Habit = { ...input, id, name: input.name.trim(), createdAt: today };
  if (!habit.name) throw new Error("habit name required");
  return { ...s, onboarded: true, habits: [...s.habits, habit] };
}
export function toggleDone(s: AppState, habitId: string, key: string): AppState {
  const cur = s.logs[habitId] ?? [];
  const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key].sort();
  return { ...s, logs: { ...s.logs, [habitId]: next } };
}
export const WATER_HABIT = { name: "물 2L 마시기", emoji: "💧", repeat: "daily", days: [], reminder: null } as const satisfies Omit<Habit, "id" | "createdAt">;
export function startWithWater(s: AppState, today?: string): AppState {
  return addHabit(s, { ...WATER_HABIT, days: [] }, today);
}

export function progress(s: AppState, key: string): { done: number; total: number; ratio: number } {
  const hs = s.habits.filter((h) => isScheduled(h, key));
  const done = hs.filter((h) => isDone(s, h.id, key)).length;
  return { done, total: hs.length, ratio: hs.length ? done / hs.length : 0 };
}
export function dayStatus(s: AppState, key: string): DayStatus {
  const p = progress(s, key);
  if (p.total === 0) return "off";
  return p.done === p.total ? "all" : p.done > 0 ? "some" : "none";
}
/** Per-habit streak over its scheduled days (unscheduled days don't break it). */
export function habitStreak(s: AppState, h: Habit, today: string): number {
  let cursor = today, n = 0;
  if (isScheduled(h, today) && !isDone(s, h.id, today)) cursor = addDays(today, -1);
  for (let i = 0; i < 3660 && cursor >= h.createdAt; i++, cursor = addDays(cursor, -1)) {
    if (!isScheduled(h, cursor)) continue;
    if (!isDone(s, h.id, cursor)) break;
    n++;
  }
  return n;
}
/** Overall streak: consecutive scheduled days where every habit was done (today may be pending). */
export function overallStreak(s: AppState, today: string): number {
  let cursor = dayStatus(s, today) === "all" ? today : addDays(today, -1), n = 0;
  for (let i = 0; i < 3660; i++, cursor = addDays(cursor, -1)) {
    const st = dayStatus(s, cursor);
    if (st === "off") { if (!s.habits.some((h) => cursor >= h.createdAt)) break; continue; }
    if (st !== "all") break;
    n++;
  }
  return n;
}
/** Completion rate for a month, counting scheduled habit-days up to today. month is 1-12. */
export function monthRate(s: AppState, year: number, month: number, today: string): number {
  let done = 0, total = 0;
  for (let d = new Date(year, month - 1, 1); d.getMonth() === month - 1; d.setDate(d.getDate() + 1)) {
    const key = toDateKey(d);
    if (key > today) break;
    const p = progress(s, key); done += p.done; total += p.total;
  }
  return total ? Math.round((done / total) * 100) : 0;
}
/** Calendar weeks (Sunday first), null for padding cells. */
export function monthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month - 1, 1), days = new Date(year, month, 0).getDate();
  const cells: (string | null)[] = Array(first.getDay()).fill(null);
  for (let i = 1; i <= days; i++) cells.push(toDateKey(new Date(year, month - 1, i)));
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}

export function parseState(raw: string | null): AppState {
  if (!raw) return emptyState();
  try { const v = JSON.parse(raw); return v && v.version === 1 && Array.isArray(v.habits) ? { ...emptyState(), ...v } : emptyState(); }
  catch { return emptyState(); }
}
export function loadState(storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage): AppState {
  return parseState(storage?.getItem(STORAGE_KEY) ?? null);
}
export function saveState(s: AppState, storage: Pick<Storage, "setItem"> | undefined = globalThis.localStorage): void {
  storage?.setItem(STORAGE_KEY, JSON.stringify(s));
}
