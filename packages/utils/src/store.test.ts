import { describe, expect, it } from "vitest";
import { addHabit, dayStatus, emptyState, habitStreak, isScheduled, loadState, monthGrid, monthRate, overallStreak, parseState, progress, saveState, startWithWater, toggleDone, type AppState } from "./store";

const T = "2026-10-12"; // Monday
const base = () => {
  let s = startWithWater(emptyState(), "2026-10-01");
  s = addHabit(s, { id: "walk", name: " 30분 걷기 ", emoji: "🏃", repeat: "weekdays", days: [], reminder: "08:00" }, "2026-10-01");
  return s;
};

describe("store", () => {
  it("startWithWater creates water habit and marks onboarded", () => {
    const s = startWithWater(emptyState(), T);
    expect(s.onboarded).toBe(true);
    expect(s.habits[0]).toMatchObject({ name: "물 2L 마시기", emoji: "💧", repeat: "daily", createdAt: T });
  });
  it("trims names and rejects empty", () => {
    expect(base().habits[1].name).toBe("30분 걷기");
    expect(() => addHabit(emptyState(), { name: "  ", emoji: "x", repeat: "daily", days: [], reminder: null })).toThrow();
  });
  it("schedules by repeat rule and creation date", () => {
    const [w, walk] = base().habits;
    expect(isScheduled(walk, "2026-10-11")).toBe(false); // Sunday
    expect(isScheduled(walk, T)).toBe(true);
    expect(isScheduled(w, "2026-09-30")).toBe(false);
    const sat = addHabit(emptyState(), { name: "c", emoji: "x", repeat: "custom", days: [6], reminder: null }, "2026-10-01").habits[0];
    expect(isScheduled(sat, "2026-10-10")).toBe(true);
    expect(isScheduled(sat, "2026-10-09")).toBe(false);
  });
  it("toggleDone is immutable and reversible", () => {
    const s = base(); const id = s.habits[0].id;
    const a = toggleDone(s, id, T);
    expect(s.logs[id]).toBeUndefined();
    expect(a.logs[id]).toEqual([T]);
    expect(toggleDone(a, id, T).logs[id]).toEqual([]);
  });
  it("progress and dayStatus", () => {
    let s = base(); const id = s.habits[0].id;
    expect(progress(s, T)).toEqual({ done: 0, total: 2, ratio: 0 });
    expect(dayStatus(s, T)).toBe("none");
    s = toggleDone(s, id, T);
    expect(progress(s, T).ratio).toBe(0.5);
    expect(dayStatus(s, T)).toBe("some");
    s = toggleDone(s, "walk", T);
    expect(dayStatus(s, T)).toBe("all");
    expect(dayStatus(s, "2026-09-01")).toBe("off");
  });
  it("habitStreak skips unscheduled days", () => {
    let s = base();
    for (const d of ["2026-10-08", "2026-10-09", T]) s = toggleDone(s, "walk", d); // Thu, Fri, Mon
    expect(habitStreak(s, s.habits[1], T)).toBe(3);
    expect(habitStreak(toggleDone(s, "walk", T), s.habits[1], T)).toBe(2); // today pending
  });
  it("overallStreak counts fully completed days", () => {
    let s = startWithWater(emptyState(), "2026-10-01"); const id = s.habits[0].id;
    for (const d of ["2026-10-09", "2026-10-10", "2026-10-11"]) s = toggleDone(s, id, d);
    expect(overallStreak(s, T)).toBe(3);
    expect(overallStreak(toggleDone(s, id, T), T)).toBe(4);
  });
  it("monthRate counts only up to today", () => {
    let s = startWithWater(emptyState(), "2026-10-11"); const id = s.habits[0].id;
    s = toggleDone(s, id, "2026-10-11");
    expect(monthRate(s, 2026, 10, T)).toBe(50);
    expect(monthRate(emptyState(), 2026, 10, T)).toBe(0);
  });
  it("monthGrid pads to Sunday-first weeks", () => {
    const g = monthGrid(2026, 10);
    expect(g[0].slice(0, 5)).toEqual([null, null, null, null, "2026-10-01"]);
    expect(g.flat().filter(Boolean)).toHaveLength(31);
    expect(g.every((w) => w.length === 7)).toBe(true);
  });
  it("persists via storage and survives bad data", () => {
    const mem = new Map<string, string>();
    const st = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    const s = base(); saveState(s, st);
    expect(loadState(st)).toEqual(s);
    expect(parseState("{bad")).toEqual(emptyState());
    expect(parseState(JSON.stringify({ version: 2 }))).toEqual(emptyState() as AppState);
  });
});
