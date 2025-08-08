// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('navegacion', {
  irARegistro: () => ipcRenderer.send('ir-a-registro'),
  irALogin: () => ipcRenderer.send('ir-a-login'),
  irAInventario: () => ipcRenderer.send('ir-a-inventario'),
  irAEstadisticas: () => ipcRenderer.send('ir-a-estats'),
});
