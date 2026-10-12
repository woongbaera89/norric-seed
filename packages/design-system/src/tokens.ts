export const color = {
  bg: "#F7F7F5", surface: "#FFFFFF", textPrimary: "#16181D", textSecondary: "#6B7280",
  border: "#E5E7EB", primary: "#3B5BFD", primarySoft: "#E8EDFF", success: "#22B07D", streak: "#FF7A45",
} as const;
export const typography = {
  display: { size: 32, weight: 700, lineHeight: 1.3 },
  title: { size: 22, weight: 700, lineHeight: 1.35 },
  heading: { size: 18, weight: 500, lineHeight: 1.4 },
  body: { size: 16, weight: 400, lineHeight: 1.5 },
  caption: { size: 13, weight: 400, lineHeight: 1.45 },
  micro: { size: 11, weight: 500, lineHeight: 1.4 },
} as const;
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 20, full: 9999 } as const;
export const fontFamily = `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif`;
export const tokens = { color, typography, space, radius, fontFamily } as const;
