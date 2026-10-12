"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@norric/design-system";
import { addHabit, type Repeat } from "@norric/utils";
import { useStore } from "../../useStore";
import { track } from "../../../lib/analytics";

const ICONS = ["💧", "🏃", "📖", "🧘", "✍️", "🍎"];
const REPEATS: [Repeat, string][] = [["daily", "매일"], ["weekdays", "평일"], ["weekends", "주말"], ["custom", "직접"]];
const WD = "일월화수목금토";
function fmt(t: string) { const [h, m] = t.split(":").map(Number); return `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${String(m).padStart(2, "0")}`; }

export default function NewHabit() {
  const { update } = useStore();
  const r = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(ICONS[0]);
  const [repeat, setRepeat] = useState<Repeat>("daily");
  const [days, setDays] = useState<number[]>([1, 3, 5]);
  const [remind, setRemind] = useState(true);
  const [time, setTime] = useState("08:00");
  const valid = name.trim().length > 0 && (repeat !== "custom" || days.length > 0);
  const save = () => {
    if (!valid) return;
    update((s) => addHabit(s, { name, emoji, repeat, days: repeat === "custom" ? days : [], reminder: remind ? time : null }));
    track("habit_created", { icon: emoji, repeat, reminder: remind, reminder_time: remind ? time : null });
    r.push("/today");
  };
  return (
    <main className="app" style={{ paddingBottom: 32 }}>
      <header style={{ position: "relative", textAlign: "center", marginBottom: 8 }}>
        <button aria-label="닫기" onClick={() => (history.length > 1 ? r.back() : r.push("/"))} style={{ position: "absolute", left: 0, top: 0, background: "none", border: 0, padding: 0, cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <h1 style={{ font: "var(--text-heading)", fontWeight: 700, margin: 0 }}>새 습관</h1>
      </header>
      <Input label="습관 이름" placeholder="예: 책 10페이지 읽기" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <div className="label">아이콘</div>
      <div className="chips" style={{ gap: 10 }}>{ICONS.map((i) => <button key={i} className="icon-opt" aria-pressed={emoji === i} onClick={() => setEmoji(i)}>{i}</button>)}</div>
      <div className="label">반복</div>
      <div className="chips">{REPEATS.map(([k, l]) => <button key={k} className="chip" aria-pressed={repeat === k} onClick={() => setRepeat(k)}>{l}</button>)}</div>
      {repeat === "custom" && <div className="chips" style={{ marginTop: 8 }}>{[...WD].map((w, i) => (
        <button key={w} className="chip" style={{ padding: 0, width: 38 }} aria-pressed={days.includes(i)} onClick={() => setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))}>{w}</button>))}</div>}
      <div className="label">알림</div>
      <div className="row">
        {remind ? <label style={{ position: "relative" }}>{fmt(time)}<input type="time" value={time} onChange={(e) => e.target.value && setTime(e.target.value)} aria-label="알림 시간" style={{ position: "absolute", inset: 0, opacity: 0 }} /></label>
          : <span style={{ color: "var(--color-text-secondary)" }}>알림 없음</span>}
        <button className="switch" role="switch" aria-checked={remind} aria-label="알림 켜기" onClick={() => setRemind((v) => !v)} />
      </div>
      <div style={{ marginTop: "auto", paddingTop: 32 }}><Button disabled={!valid} onClick={save}>저장하기</Button></div>
    </main>
  );
}
