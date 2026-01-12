export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: "text" | "password" | "email";
  disabled?: boolean;
  error?: boolean;
  onChange?: (value: string) => void;
}
