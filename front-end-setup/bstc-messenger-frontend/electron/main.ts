import { app, Tray, BrowserWindow, nativeTheme, ipcMain, desktopCapturer, nativeImage, clipboard, dialog, screen, DesktopCapturerSource, WebContents } from 'electron' // Merged imports
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'os';
// import SendNotification from './notification/index.ts'
import { createTray } from './tray/index.ts'
import { createDialogWindow } from './dialog/index.ts';

import { AppDisplaySettings, DefaultWindowSettings } from './screen/index.ts'
import { DialogBoxType } from '../shared/types.ts';
import fs from "fs";

const _require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

// Variable declarations
let mainWindow: BrowserWindow | null = null;
let popUpWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createMainWindow() {
  if(null !== mainWindow)
    return;

  mainWindow = new BrowserWindow({
    title: 'BSTC Messenger',
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false
    },
    ...DefaultWindowSettings,
  })

  if (AppDisplaySettings && AppDisplaySettings.maximizeWindow) {
    mainWindow.maximize()
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  // Prevent window from being closed, hide it instead. Note: This is critical when frame is set to true.
  // mainWindow.on('close', (event: Event) => {
  //   event.preventDefault()
  //   mainWindow?.hide() // Hide instead of close to keep running in tray
  // });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// --- IPC HANDLERS FOR TITLE BAR (CRITICAL) ---
ipcMain.on('minimize-window', (event) => {
  const webContents = event.sender;  // Identifies the source renderer
  const win = BrowserWindow.fromWebContents(webContents);  // Gets the window instance
  win?.minimize()
});

ipcMain.on('maximize-window', (event) => {
  const webContents = event.sender;  // Identifies the source renderer
  const win = BrowserWindow.fromWebContents(webContents);  // Gets the window instance
  if (win?.isMaximized()) win.unmaximize();
  else win?.maximize();
});

ipcMain.handle('get-local-ip', () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      // Skip internal (localhost) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback
});

const getScreenshot = async (webContents: WebContents) : Promise<DesktopCapturerSource[]> => {
  const primaryDisplay = screen.getPrimaryDisplay();

  BrowserWindow.fromWebContents(webContents)?.hide()
  
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width: primaryDisplay.size.width, height: primaryDisplay.size.height },
  });

  return sources;
}

// IPC Handler: Create/Open Pop-Up
ipcMain.handle('open-dialog', async (_event, dialogType: DialogBoxType, message?: string) => {
  // console.log(`Request to open dialog of type: ${dialogType}`);
  popUpWindow = createDialogWindow(mainWindow, dialogType, message);
  popUpWindow?.show();
});

ipcMain.handle("get-screenshot", async (event) => {
  const webContents = event.sender;
  mainWindow?.hide();

  const screenSources = await getScreenshot(event.sender);

  BrowserWindow.fromWebContents(webContents)?.show();
  BrowserWindow.fromWebContents(webContents)?.focus();

  return screenSources[0].thumbnail.toDataURL();
});

ipcMain.handle("save-image", async (_event, imageURL: string) => {
  const { filePath } = await dialog.showSaveDialog({
    title: "Save Screenshot",
    defaultPath: "snip.png",
    filters: [{ name: "PNG Image", extensions: ["png"] }],
  });

  if (!filePath) return false;

  const base64Data = imageURL.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync(filePath, base64Data, "base64");
});

ipcMain.handle("copy-to-clipboard", async (_event, imageURL: string) => {
  const image = nativeImage.createFromDataURL(imageURL);
  clipboard.writeImage(image);
});
// ---------------------------------------------

nativeTheme.on('updated', () => {
  tray?.setImage(nativeTheme.shouldUseDarkColors 
    ? path.join(process.env.VITE_PUBLIC, 'system-tray-icon-white.png')
    : path.join(process.env.VITE_PUBLIC, 'system-tray-icon.png'));
});

// Remove hogged resources before quitting
app.on('before-quit', () => {
  // Destroy all objects and quit the app
  mainWindow?.destroy()
  tray?.destroy()
});

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
  else {
    // Show pop-up window that app already running
    mainWindow?.show()
  }
})

if (process.platform === 'win32') {
  app.setAppUserModelId(app.name);
}

app.whenReady().then(() => {
  // nativeTheme.themeSource = 'system' // 'system' | 'light' | 'dark'
  createMainWindow()
  tray = createTray(mainWindow, () => {
    createMainWindow()
  }, () => app.quit())
})