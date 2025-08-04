const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: Math.min(1320, width),
    height: Math.min(900, height),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // Solo así puedes usar `require` en el HTML
    }
  });

  win.loadFile(path.join(__dirname, 'app/HTML/login.html'));
  win.center();
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Escucha el mensaje desde el renderer
ipcMain.on('abrir-login', () => {
  win.loadFile(path.join(__dirname, 'app/HTML/registro-persona.html'));
});
