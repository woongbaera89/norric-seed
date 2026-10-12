"use client";
import Link from "next/link";
import { HabitItem } from "@norric/design-system";
import { habitStreak, isDone, isScheduled, parseDateKey, progress, toggleDone } from "@norric/utils";
import { useStore } from "../useStore";
import { track } from "../../lib/analytics";
import { AppTabBar } from "../AppTabBar";

const WD = "일월화수목금토";
function message(done: number, total: number) {
  if (total === 0) return "첫 습관을 추가해보세요.";
  if (done === total) return "오늘 목표 달성! 멋져요 🎉";
  if (done === 0) return "가볍게 하나부터 시작해볼까요?";
  return done / total >= 0.5 ? "절반 왔어요. 오늘도 한 걸음!" : "좋은 출발이에요. 계속 가볼까요?";
}

export default function Today() {
  const { state, ready, update, today } = useStore();
  const d = parseDateKey(today);
  const p = progress(state, today);
  const habits = state.habits.filter((h) => isScheduled(h, today));
  return (
    <main className="app">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><p className="date">{d.getMonth() + 1}월 {d.getDate()}일 {WD[d.getDay()]}요일</p><h1 className="title">오늘의 습관</h1></div>
        <Link href="/habits/new" className="fab" aria-label="습관 추가">+</Link>
      </header>
      <section className="card-progress">
        <div style={{ font: "var(--text-title)" }}>오늘 {p.done}/{p.total} 완료</div>
        <div className="bar"><i style={{ width: `${p.ratio * 100}%` }} /></div>
        <div style={{ font: "var(--text-caption)", opacity: 0.9 }}>{message(p.done, p.total)}</div>
      </section>
      <div className="list">
        {ready && habits.map((h) => {
          const streak = habitStreak(state, h, today);
          return <HabitItem key={h.id} name={h.name} emoji={h.emoji} checked={isDone(state, h.id, today)}
            meta={streak ? `🔥 ${streak}일 연속` : "오늘 시작해요"} onToggle={() => {
              const was = isDone(state, h.id, today);
              update((s) => toggleDone(s, h.id, today));
              if (was) track("habit_unchecked", { habit_id: h.id });
              else track("habit_checked", { habit_id: h.id, streak: habitStreak(toggleDone(state, h.id, today), h, today) });
            }} />;
        })}
      </div>
      <AppTabBar active="today" />
    </main>
  );
}
