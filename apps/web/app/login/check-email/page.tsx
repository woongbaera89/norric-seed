"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, IconButton } from "@norric/design-system";
import { sendMagicLink } from "../../../lib/auth";

const WAIT = 60;

/** 04-1 메일 확인 (Figma 15-163). */
function CheckEmail() {
  const r = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const [left, setLeft] = useState(WAIT);
  useEffect(() => { if (left <= 0) return; const t = setTimeout(() => setLeft(left - 1), 1000); return () => clearTimeout(t); }, [left]);
  const mm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return (
    <main className="app auth mail">
      <div className="auth__nav"><IconButton aria-label="닫기" onClick={() => r.push("/settings")} /></div>
      <section className="mail__body">
        <div className="mail__badge" aria-hidden>✉️</div>
        <h1 className="mail__title">메일을 확인해 주세요</h1>
        <p className="mail__to"><b>{email}</b><br />으로 로그인 링크를 보냈어요.</p>
        <p className="mail__small">처음이면 가입이, 이미 계정이 있으면 로그인이 완료돼요. 링크는 1시간 동안 쓸 수 있고, 메일이 안 보이면 스팸함도 확인해 주세요.</p>
      </section>
      <div className="auth__actions">
        <Button onClick={() => { window.location.href = "mailto:"; }}>메일 앱 열기</Button>
        <Button variant="soft" disabled={left > 0} onClick={async () => { if (!(await sendMagicLink(email))) setLeft(WAIT); }}>
          {left > 0 ? `다시 보내기 (${mm})` : "다시 보내기"}
        </Button>
        <Button variant="text" onClick={() => r.replace("/login")}>다른 이메일 쓰기</Button>
      </div>
    </main>
  );
}
export default function Page() { return <Suspense><CheckEmail /></Suspense>; }
