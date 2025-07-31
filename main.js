const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: Math.min(1320, width),
    height: Math.min(900, height),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, 'app', 'registro-salida.html'));
  win.center();
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
