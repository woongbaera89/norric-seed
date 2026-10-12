"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@norric/design-system";
import { startWithWater } from "@norric/utils";
import { useStore } from "./useStore";

export default function Intro() {
  const { state, ready, update } = useStore();
  const r = useRouter();
  useEffect(() => { if (ready && state.onboarded) r.replace("/today"); }, [ready, state.onboarded, r]);
  if (!ready || state.onboarded) return null;
  return (
    <main className="app" style={{ textAlign: "center", paddingBottom: 32 }}>
      <svg width="224" height="224" viewBox="0 0 224 224" style={{ margin: "64px auto 40px" }} aria-hidden>
        <circle cx="112" cy="112" r="112" fill="var(--color-primary-soft)" />
        <circle cx="44" cy="68" r="6" fill="var(--color-success)" />
        <path d="M70 62h84l-10 120a10 10 0 0 1-10 9H90a10 10 0 0 1-10-9z" fill="#fff" stroke="var(--color-primary)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M74 108c14-8 24 6 38 0s24-8 38 0l-6 72a10 10 0 0 1-10 9H90a10 10 0 0 1-10-9z" fill="var(--color-primary)" />
        <path d="M93 128v38" stroke="#fff" strokeWidth="4" strokeLinecap="round" /><circle cx="126" cy="140" r="5" fill="none" stroke="#fff" strokeWidth="3" /><circle cx="116" cy="160" r="3" fill="#fff" />
        <path d="M168 26c-10 16-18 26-18 36a18 18 0 0 0 36 0c0-10-8-20-18-36z" fill="var(--color-primary)" stroke="#fff" strokeWidth="4" />
      </svg>
      <span style={{ alignSelf: "center", font: "var(--text-micro)", fontWeight: 700, color: "var(--color-primary)", background: "var(--color-primary-soft)", padding: "4px 12px", borderRadius: 999 }}>첫 습관 추천</span>
      <h1 style={{ font: "var(--text-display)", fontSize: 28, margin: "16px 0 12px" }}>물 마시기 습관부터<br />만들어볼까요?</h1>
      <p style={{ color: "var(--color-text-secondary)", margin: 0, fontSize: 15 }}>하루 물 2L, 가장 쉬운 첫 걸음이에요.<br />체크 한 번이면 오늘 목표 달성!</p>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <Button onClick={() => { update((s) => startWithWater(s)); r.push("/today"); }}>물 마시기로 시작하기</Button>
        <Link href="/habits/new" style={{ color: "var(--color-text-secondary)", font: "var(--text-body)", fontSize: 15, textDecoration: "none" }}>다른 습관 고를게요</Link>
      </div>
    </main>
  );
}
