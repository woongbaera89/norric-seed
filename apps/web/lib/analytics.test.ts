import { describe, expect, it, vi } from "vitest";
vi.mock("posthog-js", () => ({ default: { init: vi.fn(), capture: vi.fn(), captureException: vi.fn() } }));
import posthog from "posthog-js";
import { analyticsEnabled, captureError, initAnalytics, track } from "./analytics";

describe("analytics", () => {
  it("is disabled under test and never calls PostHog", () => {
    expect(analyticsEnabled()).toBe(false);
    initAnalytics();
    track("intro_start_clicked", { habit: "water" });
    captureError(new Error("x"));
    expect(posthog.init).not.toHaveBeenCalled();
    expect(posthog.capture).not.toHaveBeenCalled();
    expect(posthog.captureException).not.toHaveBeenCalled();
  });
});
