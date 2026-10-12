import { IconCalendar, IconCircleCheck, IconSliders } from "./icons.js";
export type TabKey = "today" | "history" | "settings";
const TABS = [
  { key: "today", label: "오늘", Icon: IconCircleCheck },
  { key: "history", label: "기록", Icon: IconCalendar },
  { key: "settings", label: "설정", Icon: IconSliders },
] as const;
export function TabBar({ active, onChange }: { active: TabKey; onChange?: (k: TabKey) => void }) {
  return (
    <nav className="nr-tabbar">
      {TABS.map(({ key, label, Icon }) => (
        <button key={key} type="button" className="nr-tab" aria-current={active === key ? "page" : undefined} onClick={() => onChange?.(key)}>
          <Icon /><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
