const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: Math.min(1320, width),
    height: Math.min(900, height),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'app/HTML/estats.html'));

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  win.center();
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);


ipcMain.on('ir-a-registro', () => {
  win.loadFile(path.join(__dirname, 'app/HTML/registro-persona.html'));
});
ipcMain.on('ir-a-login', () => {
  win.loadFile(path.join(__dirname, 'app/HTML/login.html'));
});
ipcMain.on('ir-a-inventario', () => {
  win.loadFile(path.join(__dirname, 'app/HTML/indexInventario.html'));
});
ipcMain.on('ir-a-estats', () => {
  win.loadFile(path.join(__dirname, 'app/HTML/estats.html'));
});
