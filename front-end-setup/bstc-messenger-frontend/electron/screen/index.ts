import { BrowserWindowConstructorOptions, screen } from 'electron';
import { DialogBoxType } from '../../shared/types';

interface AppDisplaySettings {
  maximizeWindow: boolean; // Custom property to indicate if the window should be maximized on creation
}

const AppDisplaySettings: AppDisplaySettings = {
  maximizeWindow: false,           // Maximize window on creation
};

const DefaultWindowSettings: BrowserWindowConstructorOptions = {
  autoHideMenuBar: false,          // Hide menu bar unless Alt is pressed
  transparent: false,             // Do not use transparent window
  width: 1200,                    // Default width
  height: 800,                    // Default height
  minWidth: 900,                  // Prevent making it too small
  minHeight: 600,
  resizable: true,                // Allow user to resize (recommended)
  frame: true,                    // Set false if you want frameless window
  titleBarStyle: 'default',       // or 'hidden' / 'hiddenInset' on macOS
};

const PageNotFoundPopupSettings: BrowserWindowConstructorOptions = {
  width: 600,
  height: 200,
  title: 'Pop-Up Window',
  frame: false,
  resizable: false,
};

const AlertWindowSettings: BrowserWindowConstructorOptions = {
  width: 400,
  height: 150,
  title: 'Alert Window',
  frame: false,
  resizable: false,
};

const SnipperWindowSettings: BrowserWindowConstructorOptions = {
  title: 'Screenshot Window',
  width: 1280,
  height: 720,
  frame: false,
  resizable: true,
  fullscreen: true,
  modal: false,
  parent: undefined
};

const DialogSettings: Record<DialogBoxType, BrowserWindowConstructorOptions> = {
  'pagenotfound': PageNotFoundPopupSettings,
  'alert': AlertWindowSettings,
  'snipper': SnipperWindowSettings
};

export { DefaultWindowSettings, AppDisplaySettings, PageNotFoundPopupSettings, DialogSettings };