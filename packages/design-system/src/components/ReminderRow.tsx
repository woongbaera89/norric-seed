import type { ReactNode } from "react";
import { formatTime } from "./time.js";

export type ReminderRowProps = {
  value: string | null; // "HH:MM" or null when off
  onOpen: () => void;
  toggle: ReactNode;
  offLabel?: string;
};

export function ReminderRow({ value, onOpen, toggle, offLabel = "알림 없음" }: ReminderRowProps) {
  return (
    <div className="nr-reminder">
      {value ? (
        <button type="button" className="nr-time-chip" onClick={onOpen} aria-haspopup="dialog" aria-label={`알림 시간 ${formatTime(value)}, 변경하기`}>
          {formatTime(value)} <span aria-hidden>›</span>
        </button>
      ) : <span className="nr-reminder__off">{offLabel}</span>}
      {toggle}
    </div>
  );
}
