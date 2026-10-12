"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadState } from "@norric/utils";
import { supabase } from "../../../lib/supabase";
import { migrateLocal } from "../../../lib/sync";
import { identify, track } from "../../../lib/analytics";

/** Magic-link landing: session is read from the URL, local data is copied to the account. */
export default function AuthCallback() {
  const r = useRouter();
  const [msg, setMsg] = useState("로그인하는 중…");
  useEffect(() => {
    const db = supabase();
    let done = false;
    const finish = async () => {
      const { data } = await db.auth.getSession();
      if (!data.session || done) return; done = true;
      try {
        const moved = await migrateLocal(db, loadState());
        identify(data.session.user.id, data.session.user.email);
        track("login_completed", { migrated_habits: moved });
      } catch (e) { console.error("migration failed", e); }
      r.replace("/settings");
    };
    const { data: sub } = db.auth.onAuthStateChange((e) => { if (e === "SIGNED_IN") void finish(); });
    void finish();
    const t = setTimeout(() => { if (!done) setMsg("링크가 만료됐거나 이미 사용됐어요. 다시 시도해 주세요."); }, 8000);
    return () => { sub.subscription.unsubscribe(); clearTimeout(t); };
  }, [r]);
  return <main className="app" style={{ justifyContent: "center", textAlign: "center" }}><p className="date">{msg}</p></main>;
}
