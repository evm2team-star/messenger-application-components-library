import "./Checkbox.css";
import { CheckboxProps } from "./Checkbox.types";

export const Checkbox = ({
  label,
  checked = false,
  disabled = false,
  onChange,
}: CheckboxProps) => {
  return (
    <label className="checkbox-wrapper">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-disabled={disabled}
        className="checkbox-input"
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="checkbox-label">{label}</span>
    </label>
  );
};
