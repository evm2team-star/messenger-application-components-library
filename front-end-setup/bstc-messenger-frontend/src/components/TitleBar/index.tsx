import "./styles.css";

interface TitleBarProps {
  controls: {
    minimize: boolean;
    maximize: boolean;
    close: boolean;
  }
}

const handleMinimize = () => window.electronAPI.minimize();
const handleMaximize = () => window.electronAPI.maximize();
const handleClose = () => window.close();

const TitleBar = ({controls}: TitleBarProps) => {

  return (
    <div className="title-bar">
      <div className="title-drag-area">
        {/* Simple Text Logo */}
        <div className="app-title-logo">⚡</div>
        <span className="app-title-text">BSTC MESSENGER <span className="version-tag">LOCAL</span></span>
        <div className="connection-status">
          <span className="status-dot-pulse"></span>
          SECURE LAN
        </div>
      </div>
      
      <div className="window-controls">
        {/* MINIMIZE ICON */}
        {controls.minimize && (
        <button className="control-btn min" onClick={handleMinimize} title="Minimize">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5.5H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
        </button>
        )}

        {/* MAXIMIZE ICON */}
        {controls.maximize && (
        <button className="control-btn max" onClick={handleMaximize} title="Maximize">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="1.5" width="8" height="8" stroke="currentColor" strokeWidth="1.2" rx="1"/>
            </svg>
        </button>
        )}
        {/* CLOSE ICON */}
        {controls.close && (
        <button className="control-btn close" onClick={handleClose} title="Close">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L9 9M9 2L2 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
        </button>
        )}
      </div>
    </div>
  );
};

export default TitleBar;