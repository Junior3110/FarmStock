const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: Math.min(1320, width),
    height: Math.min(900, height),
    show: false,
   webPreferences: {
  preload: path.join(__dirname, 'preload.js')
}

  });

  win.loadFile(path.join(__dirname, 'app/HTMl', 'login.html'));

  win.once('ready-to-show', () => {
    win.show();
    win.focus(); // Esto asegura que puedas escribir inmediatamente
  });

  win.center();
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
