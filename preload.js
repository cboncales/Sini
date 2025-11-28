import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('api', {
  // your functions later...
})
