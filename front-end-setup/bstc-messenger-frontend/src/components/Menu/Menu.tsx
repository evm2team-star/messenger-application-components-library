import "./Menu.css";
import { MenuProps } from "./Menu.types";

export const Menu = ({ items }: MenuProps) => {
  return (
    <ul className="menu" role="menu">
      {items.map((item, index) => (
        <li
          key={index}
          className="menu-item"
          role="menuitem"
          tabIndex={0}
          onClick={item.onClick}
          onKeyDown={(e) => e.key === "Enter" && item.onClick()}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};
