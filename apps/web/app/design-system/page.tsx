"use client";
import { useState } from "react";
import { Button, HabitItem, Input, TabBar, color, typography, space, radius, type TabKey } from "@norric/design-system";
import { currentStreak } from "@norric/utils";

const S = { section: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 } as const, h: { font: "var(--text-heading)", margin: 0 } };
const days = ["2026-10-09", "2026-10-10", "2026-10-11"];

export default function DesignSystemPage() {
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<TabKey>("today");
  const streak = currentStreak(checked ? [...days, "2026-10-12"] : days, "2026-10-12");
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <main style={{ padding: 24 }}>
        <h1 style={{ font: "var(--text-display)", margin: "0 0 24px" }}>Design System</h1>
        <section style={S.section}><h2 style={S.h}>Color</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {Object.entries(color).map(([k, v]) => (
              <div key={k} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ background: v, height: 44, borderBottom: "1px solid var(--color-border)" }} />
                <div style={{ padding: 8, font: "var(--text-micro)" }}>{k}<br /><span style={{ color: "var(--color-text-secondary)" }}>{v}</span></div>
              </div>))}
          </div></section>
        <section style={S.section}><h2 style={S.h}>Typography</h2>
          {Object.entries(typography).map(([k, t]) => (
            <div key={k} style={{ fontSize: t.size, fontWeight: t.weight, lineHeight: t.lineHeight }}>{k} {t.size}/{t.weight} 물 마시기</div>))}
        </section>
        <section style={S.section}><h2 style={S.h}>Spacing & Radius</h2>
          <div style={{ display: "flex", alignItems: "end", gap: 12 }}>{Object.values(space).map((v) => (
            <div key={v} style={{ textAlign: "center", font: "var(--text-micro)" }}><div style={{ width: v, height: v, background: "var(--color-primary)" }} />{v}</div>))}</div>
          <div style={{ display: "flex", gap: 12 }}>{Object.entries(radius).map(([k, v]) => (
            <div key={k} style={{ textAlign: "center", font: "var(--text-micro)" }}><div style={{ width: 48, height: 48, borderRadius: v, background: "var(--color-primary-soft)", border: "1.5px solid var(--color-primary)" }} />{k}</div>))}</div>
        </section>
        <section style={S.section}><h2 style={S.h}>Button</h2>
          <Button>물 마시기로 시작하기</Button><Button variant="secondary">다른 습관 고를게요</Button></section>
        <section style={S.section}><h2 style={S.h}>Input</h2><Input label="습관 이름" placeholder="예: 물 2L 마시기" /></section>
        <section style={S.section}><h2 style={S.h}>HabitItem (tap to toggle)</h2>
          <HabitItem name="물 마시기" meta="하루 8잔" checked={checked} streak={streak} onToggle={() => setChecked((c) => !c)} />
          <HabitItem name="스트레칭" emoji="🧘" meta="10분" checked streak={5} />
          <HabitItem name="독서" emoji="📖" meta="20쪽" /></section>
        <section style={S.section}><h2 style={S.h}>TabBar</h2><div style={{ margin: "0 -24px" }}><TabBar active={tab} onChange={setTab} /></div></section>
      </main>
    </div>
  );
}
