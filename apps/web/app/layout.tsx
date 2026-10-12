import "./globals.css";
import type { ReactNode } from "react";
export const metadata = { title: "Norric Seed" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
