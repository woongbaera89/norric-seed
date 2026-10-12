"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { HOURS, MINUTES, parseTime, toTime } from "./time.js";

const ROW = 44;

type WheelProps = { label: string; items: string[]; index: number; onChange: (i: number) => void; autoFocus?: boolean };

function Wheel({ label, items, index, onChange, autoFocus }: WheelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const el = ref.current;
    if (el && Math.round(el.scrollTop / ROW) !== index) el.scrollTo({ top: index * ROW });
  }, [index]);
  useEffect(() => { if (autoFocus) ref.current?.focus({ preventScroll: true }); }, [autoFocus]);
  const onScroll = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ROW)));
      if (i !== index) onChange(i);
    }, 80);
  };
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = Math.max(0, Math.min(items.length - 1, index + d));
    onChange(i);
    ref.current?.scrollTo({ top: i * ROW, behavior: "smooth" });
  };
  return (
    <div ref={ref} className="nr-wheel" role="listbox" tabIndex={0} aria-label={label}
      aria-activedescendant={`${label}-${index}`} onScroll={onScroll} onKeyDown={onKey}>
      {items.map((t, i) => (
        <div key={t} id={`${label}-${i}`} role="option" aria-selected={i === index}
          className="nr-wheel__item" data-dist={Math.min(Math.abs(i - index), 2)}
          onClick={() => { onChange(i); ref.current?.scrollTo({ top: i * ROW, behavior: "smooth" }); }}>{t}</div>
      ))}
    </div>
  );
}

export type TimePickerProps = {
  open: boolean;
  value: string; // "HH:MM"
  title?: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
};

export function TimePicker({ open, value, title = "알림 시간", onCancel, onConfirm }: TimePickerProps) {
  const [p, setP] = useState(() => parseTime(value));
  useEffect(() => { if (open) setP(parseTime(value)); }, [open, value]);
  if (!open) return null;
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onCancel(); } };
  return (
    <div className="nr-sheet-root" onKeyDown={onKey}>
      <div className="nr-sheet-backdrop" onClick={onCancel} aria-hidden />
      <div className="nr-sheet" role="dialog" aria-modal="true" aria-labelledby="nr-tp-title">
        <div className="nr-sheet__handle" aria-hidden />
        <div className="nr-sheet__header">
          <h2 id="nr-tp-title" className="nr-sheet__title">{title}</h2>
          <p className="nr-sheet__desc">5분 단위로 설정할 수 있어요</p>
        </div>
        <div className="nr-wheels">
          <div className="nr-wheels__sel" aria-hidden />
          <Wheel label="오전/오후" items={["오전", "오후"]} index={p.ampm} onChange={(i) => setP((s) => ({ ...s, ampm: i as 0 | 1 }))} autoFocus />
          <Wheel label="시" items={HOURS.map(String)} index={p.hour - 1} onChange={(i) => setP((s) => ({ ...s, hour: i + 1 }))} />
          <span className="nr-wheels__colon" aria-hidden>:</span>
          <Wheel label="분" items={MINUTES.map((m) => String(m).padStart(2, "0"))} index={p.minute / 5} onChange={(i) => setP((s) => ({ ...s, minute: i * 5 }))} />
        </div>
        <div className="nr-sheet__actions">
          <button type="button" className="nr-btn nr-btn--ghost" onClick={onCancel}>취소</button>
          <button type="button" className="nr-btn nr-btn--primary" onClick={() => onConfirm(toTime(p))}>완료</button>
        </div>
      </div>
    </div>
  );
}
