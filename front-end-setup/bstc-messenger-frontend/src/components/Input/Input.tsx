import "./Input.css";
import { InputProps } from "./Input.types";

export const Input = ({
  label,
  placeholder,
  value,
  type = "text",
  disabled = false,
  error = false,
  onChange,
}: InputProps) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-disabled={disabled}
        aria-invalid={error}
        className={`input-field ${error ? "input-error" : ""}`}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};
