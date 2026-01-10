// main/index.js (excerpt)
import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { DialogBoxType } from '../../shared/types';
import { DialogSettings } from '../screen';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createDialogWindow(mainWindow: BrowserWindow | null, dialogType: DialogBoxType, message?: string): BrowserWindow | null {
  if(null === mainWindow)
    return null;
  
  const popupWindow = new BrowserWindow({
    parent: mainWindow, // Ties to main window
    modal: true, // If true, blocks main window until closed
    show: false, // Show after ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    ...DialogSettings[dialogType],
  });

  // Load a React route or HTML for the pop-up
  if (process.env.NODE_ENV === 'development') {
    // console.log(`${process.env.VITE_DEV_SERVER_URL}${dialogType}`+ ((message!==undefined) ?`?message=${encodeURIComponent(message || '')}`:''));
    popupWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}${dialogType}`+ ((message!==undefined) ?`?message=${encodeURIComponent(message || '')}`:'')); // Vite route for dialog
  } else {
    popupWindow.loadFile(path.join(__dirname, '../renderer/dist/popup.html'));
  }
  
  popupWindow.on('closed', () => {
    mainWindow.show();
  });

  popupWindow.once('ready-to-show', () => {
    
    popupWindow?.show();
  });

  

  return popupWindow;
}

export { createDialogWindow };