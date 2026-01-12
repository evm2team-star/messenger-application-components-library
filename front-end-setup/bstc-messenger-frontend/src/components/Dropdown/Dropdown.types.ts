export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  selected?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}
