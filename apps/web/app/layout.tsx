import "./globals.css";
import type { ReactNode } from "react";
import { PostHogProvider } from "./PostHogProvider";
export const metadata = { title: "Norric Seed" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body><PostHogProvider>{children}</PostHogProvider></body></html>;
}
