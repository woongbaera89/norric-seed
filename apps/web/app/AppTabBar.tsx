"use client";
import { useRouter } from "next/navigation";
import { TabBar, type TabKey } from "@norric/design-system";
const PATH: Record<TabKey, string> = { today: "/today", history: "/history", settings: "/settings" };
export function AppTabBar({ active }: { active: TabKey }) {
  const r = useRouter();
  return <div className="app-tabbar"><TabBar active={active} onChange={(k) => r.push(PATH[k])} /></div>;
}
