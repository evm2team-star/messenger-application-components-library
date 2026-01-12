import { ButtonProps } from "./Button.types";
import "./Button.css";


export const Button = ({
  label,
  onClick,
  disabled = false,
  variant = "primary",
}: ButtonProps) => {
  return (
    <button
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
    className={`btn btn-${variant}`}
  >
    {label}
  </button>
  );
};
