const { contextBridge, ipcRenderer } = require('electron');
export {}; // force module scope so `ipcRenderer` doesn't collide with other preload scripts

contextBridge.exposeInMainWorld('udpDestinationApi', {
    getCurrent: () => ipcRenderer.invoke('udpDestination:get'),
    save: (host: string, port: number) => ipcRenderer.send('udpDestination:save', { host, port }),
    cancel: () => ipcRenderer.send('udpDestination:cancel'),
});
