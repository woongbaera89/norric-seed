"use client";
import { useRouter } from "next/navigation";
import { Button } from "@norric/design-system";
import { supabase } from "../../lib/supabase";
import { reset, track } from "../../lib/analytics";
import { AppTabBar } from "../AppTabBar";
import { useAuth } from "../useAuth";

/** 05 설정 (Figma 15-186 logged out / 15-234 logged in). */
export default function Settings() {
  const r = useRouter();
  const session = useAuth();
  const email = session?.user.email ?? "";
  return (
    <main className="app">
      <h1 className="title">설정</h1>
      <p className="set-label">계정</p>
      {session !== undefined && (
        <section className="card">
          <div className="account">
            <div className="account__badge" aria-hidden>{session ? email.charAt(0).toUpperCase() : "☁️"}</div>
            <div style={{ minWidth: 0 }}>
              <div className="account__name">{session ? email : "로그인하지 않았어요"}</div>
              <div className={`account__sub${session ? " account__sub--ok" : ""}`}>{session ? "✓ 동기화됨" : "기록이 이 기기에만 저장돼요"}</div>
            </div>
          </div>
          {session
            ? <Button variant="soft" onClick={async () => { await supabase().auth.signOut(); track("logout", {}); reset(); r.refresh(); }}>로그아웃</Button>
            : <Button onClick={() => r.push("/login")}>가입/로그인하고 기록 백업하기</Button>}
        </section>
      )}
      <p className="set-label">일반</p>
      <section className="list-card">
        <div>알림<span>›</span></div>
        <div>앱 정보<span>v0.1.0 &nbsp;›</span></div>
      </section>
      <AppTabBar active="settings" />
    </main>
  );
}
