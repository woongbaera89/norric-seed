import type { ButtonHTMLAttributes } from "react";
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" };
export function Button({ variant = "primary", className = "", ...rest }: ButtonProps) {
  return <button className={`nr-btn nr-btn--${variant} ${className}`.trim()} {...rest} />;
}
