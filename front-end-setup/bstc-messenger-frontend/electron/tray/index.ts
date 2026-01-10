import { Tray, Menu, BrowserWindow, nativeImage, nativeTheme } from 'electron' // Merged imports
import path from 'node:path'


function createTray(mainWindow: BrowserWindow | null, show: () => void, quit: () => void) : Tray | null {
  if(mainWindow === null) return null;

  const iconPath = nativeTheme.shouldUseDarkColors 
    ? path.join(process.env.VITE_PUBLIC, 'system-tray-icon-white.png')
    : path.join(process.env.VITE_PUBLIC, 'system-tray-icon.png')
  const icon = nativeImage.createFromPath(iconPath)

  const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show App', 
      click: () => mainWindow ? mainWindow.show() : show()
    },
    { 
      label: 'Quit', 
      click: () => quit() 
    },
  ])

  tray.setToolTip('BSTC Messenger')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => mainWindow?.isVisible() ? mainWindow.hide() : mainWindow?.show())
  return tray
}

export { createTray };