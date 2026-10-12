import posthog from "posthog-js";

// Public client key (safe to ship). Override via env per environment.
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_CW22rZPPsbtGKJLtDPjApsRoXQPPBR5HBVRrsH392h9H";
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export type AnalyticsEvents = {
  intro_viewed: Record<string, never>;
  intro_start_clicked: { habit: "water" };
  intro_other_habit_clicked: Record<string, never>;
  habit_created: { icon: string; repeat: string; reminder: boolean; reminder_time?: string | null };
  habit_checked: { habit_id: string; streak: number };
  habit_unchecked: { habit_id: string };
  history_viewed: { current_streak: number; month_rate: number };
  magic_link_sent: Record<string, never>;
  login_completed: { migrated_habits: number };
  logout: Record<string, never>;
};

/** Analytics off in tests, when explicitly disabled, or under automation (headless screenshots). */
export function analyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV === "test" || process.env.NEXT_PUBLIC_POSTHOG_DISABLED === "1") return false;
  if (navigator.webdriver) return false;
  return Boolean(POSTHOG_KEY);
}

let started = false;
export function initAnalytics() {
  if (started || !analyticsEnabled()) return;
  started = true;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: "2025-05-24", // SPA pageviews via history_change + pageleave
    capture_pageview: "history_change",
    capture_exceptions: true, // error tracking: window.onerror + unhandledrejection
    person_profiles: "identified_only",
  });
}

export function track<E extends keyof AnalyticsEvents>(event: E, props?: AnalyticsEvents[E]) {
  initAnalytics(); // child effects may run before the provider's
  if (!started) return;
  posthog.capture(event, props);
}

export function captureError(error: unknown, extra?: Record<string, unknown>) {
  initAnalytics();
  if (!started) return;
  posthog.captureException(error, extra);
}

export function identify(id: string, email?: string) {
  initAnalytics();
  if (!started) return;
  posthog.identify(id, email ? { email } : undefined);
}

export function reset() {
  if (started) posthog.reset();
}
