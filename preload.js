const { contextBridge, ipcRenderer } = require("electron");

// 🔹 Control de ventana
contextBridge.exposeInMainWorld("api", {
    minimize: () => ipcRenderer.send("window-minimize"),
    maximize: () => ipcRenderer.send("window-maximize"),
    close: () => ipcRenderer.send("window-close"),
});

// 🔹 Navegación entre páginas (si la usas)
contextBridge.exposeInMainWorld("navegacion", {
    irARegistro: () => ipcRenderer.send("ir-a-registro"),
    irALogin: () => ipcRenderer.send("ir-a-login"),
    irAInventario: () => ipcRenderer.send("ir-a-inventario"),
    irAEstadisticas: () => ipcRenderer.send("ir-a-estats"),
});