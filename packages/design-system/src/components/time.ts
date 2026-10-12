/** "HH:MM" (24h) <-> parts used by the picker. Storage format stays "HH:MM". */
export type TimeParts = { ampm: 0 | 1; hour: number; minute: number };
export const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
export const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
export function parseTime(v: string): TimeParts {
  const [h = 8, m = 0] = v.split(":").map(Number);
  return { ampm: h < 12 ? 0 : 1, hour: h % 12 || 12, minute: Math.floor(m / 5) * 5 };
}
export function toTime({ ampm, hour, minute }: TimeParts): string {
  const h = (hour % 12) + (ampm ? 12 : 0);
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
export function formatTime(v: string): string {
  const [h = 0, m = 0] = v.split(":").map(Number);
  return `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${String(m).padStart(2, "0")}`;
}
