import { IconCheck } from "./icons.js";
export type HabitItemProps = { name: string; emoji?: string; meta?: string; checked?: boolean; streak?: number; onToggle?: () => void };
export function HabitItem({ name, emoji = "💧", meta, checked = false, streak = 0, onToggle }: HabitItemProps) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} onClick={onToggle} className={`nr-habit${checked ? " nr-habit--checked" : ""}`}>
      <span className="nr-habit__emoji">{emoji}</span>
      <span className="nr-habit__body"><span className="nr-habit__name">{name}</span>{meta && <span className="nr-habit__meta">{meta}</span>}</span>
      {streak > 0 && <span className="nr-habit__streak">🔥 {streak}일</span>}
      <span className="nr-habit__check">{checked && <IconCheck />}</span>
    </button>
  );
}
