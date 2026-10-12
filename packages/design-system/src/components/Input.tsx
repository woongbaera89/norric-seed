import { useId, type InputHTMLAttributes } from "react";
export type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string };
export function Input({ label, id, className = "", ...rest }: InputProps) {
  const auto = useId(); const inputId = id ?? auto;
  return (
    <div className="nr-field">
      {label && <label className="nr-field__label" htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={`nr-input ${className}`.trim()} {...rest} />
    </div>
  );
}
