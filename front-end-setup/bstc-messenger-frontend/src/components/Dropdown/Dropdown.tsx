import "./Dropdown.css";
import { DropdownProps } from "./Dropdown.types";

export const Dropdown = ({
  label,
  options,
  selected,
  disabled = false,
  onChange,
}: DropdownProps) => {
  return (
    <div className="dropdown-wrapper">
      {label && (
  <label htmlFor="dropdown-select" className="dropdown-label">
    {label}
  </label>
)}


      <select
        id="dropdown-select"
        className="dropdown-select"
        value={selected}
        disabled={disabled}
        aria-disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      >

        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
