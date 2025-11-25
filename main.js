const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");

let win;

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: Math.min(1280, width),
    height: Math.min(900, height),
    show: false,
    frame: false, // ⚠️ muy importante → quita los botones nativos
    titleBarStyle: "hidden", // 👈 también oculta la barra de título
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });


    // 👇 Página inicial (puedes cambiarla si lo deseas)
    win.loadFile(path.join(__dirname, "app/HTML/login.html"));

    win.once("ready-to-show", () => {
        win.show();
        win.focus();
    });

    win.center();
    // win.webContents.openDevTools(); // opcional
}

app.whenReady().then(createWindow);

// 🔹 Navegación
ipcMain.on("ir-a-registro", () =>
    win.loadFile(path.join(__dirname, "app/HTML/registro-persona.html"))
);
ipcMain.on("ir-a-login", () =>
    win.loadFile(path.join(__dirname, "app/HTML/login.html"))
);
ipcMain.on("ir-a-inventario", () =>
    win.loadFile(path.join(__dirname, "app/HTML/indexInventario.html"))
);
ipcMain.on("ir-a-estats", () =>
    win.loadFile(path.join(__dirname, "app/HTML/estats.html"))
);

// 🔹 Control de ventana
ipcMain.on("window-minimize", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) window.minimize();
});

ipcMain.on("window-maximize", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    }
});

ipcMain.on("window-close", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) window.close();
});