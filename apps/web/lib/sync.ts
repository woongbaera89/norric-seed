import type { SupabaseClient } from "@supabase/supabase-js";
import { emptyState, type AppState, type Habit, type Repeat } from "@norric/utils";

type HabitRow = { id: string; name: string; emoji: string; repeat: Repeat; days: number[]; reminder: string | null; created_at: string };
type CheckRow = { habit_id: string; day: string };

const toRow = (h: Habit): HabitRow => ({ id: h.id, name: h.name, emoji: h.emoji, repeat: h.repeat, days: h.days, reminder: h.reminder, created_at: h.createdAt });
const checksOf = (s: AppState): CheckRow[] => Object.entries(s.logs).flatMap(([habit_id, days]) => days.map((day) => ({ habit_id, day })));

/** Load the signed-in user's data (RLS limits rows to their own). */
export async function loadRemote(db: SupabaseClient): Promise<AppState> {
  const [h, c] = await Promise.all([
    db.from("habits").select("id,name,emoji,repeat,days,reminder,created_at").order("inserted_at"),
    db.from("checks").select("habit_id,day"),
  ]);
  if (h.error) throw h.error; if (c.error) throw c.error;
  const habits: Habit[] = (h.data as HabitRow[]).map((r) => ({ id: r.id, name: r.name, emoji: r.emoji, repeat: r.repeat, days: r.days ?? [], reminder: r.reminder, createdAt: r.created_at }));
  const logs: Record<string, string[]> = {};
  for (const r of c.data as CheckRow[]) (logs[r.habit_id] ??= []).push(r.day);
  for (const k in logs) logs[k]!.sort();
  return { ...emptyState(), onboarded: habits.length > 0, habits, logs };
}

/** Copy this device's local data into the account (idempotent: existing rows are kept). */
export async function migrateLocal(db: SupabaseClient, local: AppState): Promise<number> {
  if (!local.habits.length) return 0;
  const h = await db.from("habits").upsert(local.habits.map(toRow), { onConflict: "user_id,id", ignoreDuplicates: true });
  if (h.error) throw h.error;
  const known = new Set(local.habits.map((x) => x.id));
  const checks = checksOf(local).filter((c) => known.has(c.habit_id));
  if (checks.length) {
    const c = await db.from("checks").upsert(checks, { onConflict: "user_id,habit_id,day", ignoreDuplicates: true });
    if (c.error) throw c.error;
  }
  return local.habits.length;
}

/** Push the difference between two states. */
export async function pushDiff(db: SupabaseClient, prev: AppState, next: AppState): Promise<void> {
  const before = new Map(prev.habits.map((h) => [h.id, JSON.stringify(h)]));
  const changed = next.habits.filter((h) => before.get(h.id) !== JSON.stringify(h));
  if (changed.length) { const r = await db.from("habits").upsert(changed.map(toRow), { onConflict: "user_id,id" }); if (r.error) throw r.error; }
  const key = (c: CheckRow) => `${c.habit_id}|${c.day}`;
  const a = new Set(checksOf(prev).map(key)), b = new Set(checksOf(next).map(key));
  const added = checksOf(next).filter((c) => !a.has(key(c)));
  const removed = checksOf(prev).filter((c) => !b.has(key(c)));
  if (added.length) { const r = await db.from("checks").upsert(added, { onConflict: "user_id,habit_id,day", ignoreDuplicates: true }); if (r.error) throw r.error; }
  for (const c of removed) { const r = await db.from("checks").delete().eq("habit_id", c.habit_id).eq("day", c.day); if (r.error) throw r.error; }
}
