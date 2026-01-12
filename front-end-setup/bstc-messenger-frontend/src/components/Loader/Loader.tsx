import "./Loader.css";
import { LoaderProps } from "./Loader.types";
export const Loader = ({ size = "medium" }: LoaderProps) => {
  return (
    <div
      className={`loader loader-${size}`}
      role="status"
      aria-label="Loading"
    />
  );
};
