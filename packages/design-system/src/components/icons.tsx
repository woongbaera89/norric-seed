import type { SVGProps } from "react";
const base: SVGProps<SVGSVGElement> = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
export const IconCircleCheck = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>);
export const IconCalendar = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>);
export const IconSliders = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></svg>);
export const IconCheck = (p: SVGProps<SVGSVGElement>) => (<svg {...base} width={16} height={16} strokeWidth={2.25} {...p}><path d="m5 12 4.5 4.5L19 7" /></svg>);
export const IconClose = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
