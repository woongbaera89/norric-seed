"use client";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/** Current session (null = logged out, undefined = still loading). Login is never required. */
export function useAuth() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    const db = supabase();
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return session;
}
