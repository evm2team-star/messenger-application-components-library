export interface MenuItem {
  label: string;
  onClick: () => void;
}

export interface MenuProps {
  items: MenuItem[];
}
