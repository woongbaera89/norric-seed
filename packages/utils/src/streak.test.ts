import { describe, expect, it } from "vitest";
import { currentStreak, longestStreak } from "./streak";
import { addDays } from "./date";

describe("currentStreak", () => {
  it("is 0 with no records", () => expect(currentStreak([], "2026-10-12")).toBe(0));
  it("counts consecutive days ending today", () =>
    expect(currentStreak(["2026-10-10", "2026-10-11", "2026-10-12"], "2026-10-12")).toBe(3));
  it("stays alive if today not yet done", () =>
    expect(currentStreak(["2026-10-10", "2026-10-11"], "2026-10-12")).toBe(2));
  it("breaks on a gap", () =>
    expect(currentStreak(["2026-10-08", "2026-10-10", "2026-10-12"], "2026-10-12")).toBe(1));
  it("is 0 when last done two days ago", () => expect(currentStreak(["2026-10-10"], "2026-10-12")).toBe(0));
  it("crosses month boundaries and ignores duplicates", () =>
    expect(currentStreak(["2026-09-30", "2026-10-01", "2026-10-01"], "2026-10-01")).toBe(2));
});

describe("longestStreak", () => {
  it("finds the longest run", () =>
    expect(longestStreak(["2026-10-01", "2026-10-02", "2026-10-05", "2026-10-06", "2026-10-07"])).toBe(3));
  it("handles unsorted + year boundary", () =>
    expect(longestStreak(["2027-01-01", "2026-12-31", "2026-12-30"])).toBe(3));
});

describe("addDays", () => {
  it("handles leap day", () => expect(addDays("2028-02-28", 1)).toBe("2028-02-29"));
});
