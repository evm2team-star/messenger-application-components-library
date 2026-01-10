import "./styles.css";
import { SettingsIcon } from "../../assets/icons";

interface SideNavProps {
  handleUserSettings: () => void;
}

const SideNav = ({handleUserSettings} : SideNavProps) => {
  return (
    <div className="sidenav">
      <h2 className="sidenav-title">M</h2>

      <nav className="sidenav-links">
        <a href="#dashboard">D</a>
        <a href="#projects">P</a>
        <button onClick={handleUserSettings}>
          <SettingsIcon style={{height: '2rem', width: '2rem'}} stroke={"currentcolor"}/>
        </button>
        <a href="#profile">P</a>
      </nav>
    </div>
  );
};

export default SideNav;
