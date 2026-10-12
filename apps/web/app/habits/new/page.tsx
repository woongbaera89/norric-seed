"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, IconButton, Input, ReminderRow, TimePicker } from "@norric/design-system";
import { addHabit, type Repeat } from "@norric/utils";
import { useStore } from "../../useStore";
import { track } from "../../../lib/analytics";

const ICONS = ["💧", "🏃", "📖", "🧘", "✍️", "🍎"];
const REPEATS: [Repeat, string][] = [["daily", "매일"], ["weekdays", "평일"], ["weekends", "주말"], ["custom", "직접"]];
const WD = "일월화수목금토";

export default function NewHabit() {
  const { update } = useStore();
  const r = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(ICONS[0]);
  const [repeat, setRepeat] = useState<Repeat>("daily");
  const [days, setDays] = useState<number[]>([1, 3, 5]);
  const [remind, setRemind] = useState(true);
  const [time, setTime] = useState("08:00");
  const [picker, setPicker] = useState(false);
  const valid = name.trim().length > 0 && (repeat !== "custom" || days.length > 0);
  const save = () => {
    if (!valid) return;
    update((s) => addHabit(s, { name, emoji, repeat, days: repeat === "custom" ? days : [], reminder: remind ? time : null }));
    track("habit_created", { icon: emoji, repeat, reminder: remind, reminder_time: remind ? time : null });
    r.push("/today");
  };
  return (
    <main className="app" style={{ paddingBottom: 32 }}>
      <header style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center", height: 44, margin: "-10px -10px 8px" }}>
        <IconButton aria-label="닫기" onClick={() => (history.length > 1 ? r.back() : r.push("/"))} />
        <h1 style={{ font: "var(--text-heading)", fontWeight: 700, margin: 0, textAlign: "center" }}>새 습관</h1>
        <span aria-hidden />
      </header>
      <Input label="습관 이름" placeholder="예: 책 10페이지 읽기" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <div className="label">아이콘</div>
      <div className="chips" style={{ gap: 10 }}>{ICONS.map((i) => <button key={i} className="icon-opt" aria-pressed={emoji === i} onClick={() => setEmoji(i)}>{i}</button>)}</div>
      <div className="label">반복</div>
      <div className="chips">{REPEATS.map(([k, l]) => <button key={k} className="chip" aria-pressed={repeat === k} onClick={() => setRepeat(k)}>{l}</button>)}</div>
      {repeat === "custom" && <div className="chips" style={{ marginTop: 8 }}>{[...WD].map((w, i) => (
        <button key={w} className="chip" style={{ padding: 0, width: 38 }} aria-pressed={days.includes(i)} onClick={() => setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))}>{w}</button>))}</div>}
      <div className="label">알림</div>
      <ReminderRow value={remind ? time : null} onOpen={() => setPicker(true)}
        toggle={<button className="switch" role="switch" aria-checked={remind} aria-label="알림 켜기" onClick={() => setRemind((v) => !v)} />} />
      <TimePicker open={picker} value={time} onCancel={() => setPicker(false)} onConfirm={(v) => { setTime(v); setPicker(false); }} />
      <div style={{ marginTop: "auto", paddingTop: 32 }}><Button disabled={!valid} onClick={save}>저장하기</Button></div>
    </main>
  );
}
