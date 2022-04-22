const { contextBridge, ipcRenderer } = require('electron')

console.log("Preload.js executed")

contextBridge.exposeInMainWorld('plazaAPI', {
    send: (channel, payload) => {
        ipcRenderer.invoke(channel, payload)
    },
    listen: (channel, handler)=> {
        ipcRenderer.on(channel, (event, arg)=> handler(event, arg))
    }
})