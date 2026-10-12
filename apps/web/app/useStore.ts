"use client";
import { useCallback, useEffect, useState } from "react";
import { emptyState, loadState, saveState, toDateKey, type AppState } from "@norric/utils";

export function useStore() {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);
  useEffect(() => { setState(loadState()); setReady(true); }, []);
  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => { const next = fn(prev); saveState(next); return next; });
  }, []);
  return { state, ready, update, today: toDateKey(new Date()) };
}
