"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { emptyState, loadState, saveState, toDateKey, type AppState } from "@norric/utils";
import { supabase } from "../lib/supabase";
import { loadRemote, pushDiff } from "../lib/sync";

/**
 * App data. Logged out: localStorage only. Logged in: Supabase is the source of truth,
 * localStorage is a fast cache so the UI renders instantly.
 */
export function useStore() {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);
  const signedIn = useRef(false);
  useEffect(() => {
    let alive = true;
    setState(loadState());
    const db = supabase();
    db.auth.getSession().then(async ({ data }) => {
      signedIn.current = !!data.session;
      if (data.session) {
        try { const remote = await loadRemote(db); if (alive) { setState(remote); saveState(remote); } }
        catch (e) { console.error("remote load failed", e); }
      }
      if (alive) setReady(true);
    });
    return () => { alive = false; };
  }, []);
  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => {
      const next = fn(prev); saveState(next);
      if (signedIn.current) pushDiff(supabase(), prev, next).catch((e) => console.error("sync failed", e));
      return next;
    });
  }, []);
  return { state, ready, update, today: toDateKey(new Date()) };
}
