"use client";
import { useEffect, useState } from "react";
import { dayStatus, monthGrid, monthRate, overallStreak, parseDateKey } from "@norric/utils";
import { useStore } from "../useStore";
import { track } from "../../lib/analytics";
import { AppTabBar } from "../AppTabBar";

export default function History() {
  const { state, ready, today } = useStore();
  const t = parseDateKey(today);
  const [ym, setYm] = useState({ y: t.getFullYear(), m: t.getMonth() + 1 });
  const shift = (n: number) => setYm(({ y, m }) => { const d = new Date(y, m - 1 + n, 1); return { y: d.getFullYear(), m: d.getMonth() + 1 }; });
  useEffect(() => {
    if (ready) track("history_viewed", { current_streak: overallStreak(state, today), month_rate: monthRate(state, t.getFullYear(), t.getMonth() + 1, today) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  const nav = { background: "none", border: 0, fontSize: 20, cursor: "pointer", padding: "0 8px" };
  return (
    <main className="app">
      <h1 className="title" style={{ marginBottom: 24 }}>기록</h1>
      <div style={{ display: "flex", gap: 12 }}>
        <div className="stat"><b style={{ color: "var(--color-streak)" }}>🔥 {ready ? overallStreak(state, today) : 0}일</b><div className="date">현재 연속</div></div>
        <div className="stat"><b style={{ color: "var(--color-primary)" }}>{ready ? monthRate(state, t.getFullYear(), t.getMonth() + 1, today) : 0}%</b><div className="date">이번 달 달성률</div></div>
      </div>
      <section className="cal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button style={nav} onClick={() => shift(-1)} aria-label="이전 달">‹</button>
          <b style={{ font: "var(--text-heading)", fontWeight: 700 }}>{ym.y}년 {ym.m}월</b>
          <button style={nav} onClick={() => shift(1)} aria-label="다음 달">›</button>
        </div>
        <div className="cal-grid">
          {[..."일월화수목금토"].map((w) => <div key={w} className="date">{w}</div>)}
          {monthGrid(ym.y, ym.m).flat().map((k, i) => {
            if (!k) return <div key={i} />;
            const s = ready && k <= today ? dayStatus(state, k) : "off";
            return <div key={k} className="cal-day" data-s={s} aria-current={k === today ? "date" : undefined}
              style={k === today && s === "off" ? { outline: "1.5px solid var(--color-primary)" } : undefined}>{parseDateKey(k).getDate()}</div>;
          })}
        </div>
      </section>
      <div className="legend">
        <span style={{ color: "var(--color-success)" }}><i className="dot" style={{ background: "var(--color-success)" }} />모두 완료</span>
        <span style={{ color: "var(--color-primary)" }}><i className="dot" style={{ background: "var(--color-primary)" }} />일부 완료</span>
        <span style={{ color: "var(--color-text-secondary)" }}><i className="dot" style={{ background: "var(--color-primary-soft)" }} />미완료</span>
      </div>
      <AppTabBar active="history" />
    </main>
  );
}
