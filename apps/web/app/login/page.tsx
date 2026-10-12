"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, IconButton, Input } from "@norric/design-system";
import { sendMagicLink } from "../../lib/auth";
import { track } from "../../lib/analytics";
import { CloudSyncHero } from "./CloudSyncHero";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 04 로그인 (Figma 15-135). One flow for sign-up and login: magic link only, never forced. */
export default function Login() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const close = () => (history.length > 1 ? r.back() : r.push("/settings"));
  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = email.trim();
    if (!EMAIL.test(v)) { setError("이메일 주소를 다시 확인해 주세요"); return; }
    setBusy(true); setError(undefined);
    const err = await sendMagicLink(v);
    setBusy(false);
    if (err) { setError(err.status === 429 ? "잠시 후 다시 시도해 주세요" : "메일을 보내지 못했어요. 다시 시도해 주세요"); return; }
    track("magic_link_sent", {});
    r.push(`/login/check-email?email=${encodeURIComponent(v)}`);
  }
  return (
    <main className="app auth">
      <div className="auth__nav"><IconButton aria-label="닫기" onClick={close} /></div>
      <CloudSyncHero />
      <span className="auth__hint">회원가입 · 로그인 한 번에</span>
      <h1 className="auth__title">기록을 어디서든<br />이어가요</h1>
      <p className="auth__desc">처음이라면 이메일만 입력하면 바로 가입돼요.<br />비밀번호는 필요 없어요.</p>
      <form id="login" onSubmit={submit} noValidate>
        <Input label="이메일" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => { setEmail(e.target.value); setError(undefined); }}
          hint="로그인 링크를 보내드려요" error={error} />
      </form>
      <p className="auth__note"><span>💾</span><span>지금 이 기기에 있는 습관과 기록은 로그인하면 계정으로 옮겨져요.</span></p>
      <div className="auth__actions">
        <Button type="submit" form="login" disabled={busy}>{busy ? "보내는 중…" : "이메일로 시작하기"}</Button>
        <Button variant="text" type="button" onClick={close}>로그인 없이 계속하기</Button>
      </div>
    </main>
  );
}
