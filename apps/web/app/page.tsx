import Link from "next/link";
export default function Home() {
  return <main style={{ padding: 24 }}><h1 style={{ font: "var(--text-title)" }}>Norric Seed</h1><Link href="/design-system">디자인 시스템 보기 →</Link></main>;
}
