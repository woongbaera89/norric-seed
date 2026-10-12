import type { ButtonHTMLAttributes } from "react";
import { IconClose } from "./icons.js";

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon?: "close";
  "aria-label": string;
};

/** 24px icon inside a 44×44 hit area. Hover/pressed = primary-soft circle. */
export function IconButton({ icon = "close", className = "", type = "button", ...rest }: IconButtonProps) {
  return (
    <button type={type} className={`nr-icon-btn ${className}`.trim()} {...rest}>
      {icon === "close" && <IconClose />}
    </button>
  );
}
