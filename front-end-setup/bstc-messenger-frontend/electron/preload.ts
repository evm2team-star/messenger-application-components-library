import { ipcRenderer, contextBridge } from 'electron'
import { DialogBoxType } from '../shared/types'
import { get } from 'http'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),
  getLocalIP: () => ipcRenderer.invoke('get-local-ip'),
  openDialog: (dialogType: DialogBoxType, message?: string) => ipcRenderer.invoke('open-dialog', dialogType, message),
  getScreenshot: () => ipcRenderer.invoke('get-screenshot'),
  saveImage: (imageURL: string) => ipcRenderer.invoke('save-image', imageURL),
  copyToClipboard: (imageURL: string) => ipcRenderer.invoke('copy-to-clipboard', imageURL),
})
