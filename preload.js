import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  scanMovies: (folderPath) => ipcRenderer.invoke('movies:scan', folderPath),
  playMovie: (moviePath) => ipcRenderer.invoke('movie:play', moviePath)
})
