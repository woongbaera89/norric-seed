import { useId, type InputHTMLAttributes } from "react";
export type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string };
/** TextField (Figma 15-119): label, 52px field, hint or error message below. */
export function Input({ label, hint, error, id, className = "", ...rest }: InputProps) {
  const auto = useId(); const inputId = id ?? auto; const msgId = `${inputId}-msg`;
  const msg = error || hint;
  return (
    <div className={`nr-field${error ? " nr-field--error" : ""}`}>
      {label && <label className="nr-field__label" htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={`nr-input ${className}`.trim()} aria-invalid={error ? true : undefined} aria-describedby={msg ? msgId : undefined} {...rest} />
      {msg && <p id={msgId} className="nr-field__msg" role={error ? "alert" : undefined}>{msg}</p>}
    </div>
  );
}
