import { app, BrowserWindow } from 'electron';
import { createMenu } from './menu';

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            preload: __dirname + '/preload.js' // Si tu preload se llama preload.js
        }
    });

    mainWindow.loadFile('src/login.html'); // Si tu HTML está en src
}

app.whenReady().then(() => {
    createMainWindow();
    createMenu();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});