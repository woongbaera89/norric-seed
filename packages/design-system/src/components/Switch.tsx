import type { ButtonHTMLAttributes } from "react";

export type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  "aria-label": string;
};

/** On = primary token, off = border token. */
export function Switch({ checked, onChange, className = "", type = "button", ...rest }: SwitchProps) {
  return <button type={type} role="switch" aria-checked={checked} className={`nr-switch ${className}`.trim()} onClick={() => onChange(!checked)} {...rest} />;
}
