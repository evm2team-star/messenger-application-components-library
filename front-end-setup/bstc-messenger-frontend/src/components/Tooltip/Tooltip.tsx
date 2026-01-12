import "./Tooltip.css";
import { TooltipProps } from "./Tooltip.types";

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <span className="tooltip-wrapper">
      <span
        className="tooltip-trigger"
        tabIndex={0}
        aria-describedby="tooltip-content"
      >
        {children}
      </span>

      <span
        className="tooltip-content"
        role="tooltip"
        id="tooltip-content"
      >
        {content}
      </span>
    </span>
  );
};
