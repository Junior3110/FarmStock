const { app, BrowserWindow, screen, ipcMain, dialog } = require("electron");
const path = require("path");
// const { spawn, exec } = require("child_process"); // ❌ Ya no se necesita

let win;

// Suprimir errores de caché de GPU en Windows (solo afectan permisos de disco, no la funcionalidad)
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-features', 'GPUShaderCache');
// let backendProcess = null; // ❌ Deshabilitado: Backend se gestiona externamente

// ❌ DESHABILITADO: Backend se gestiona externamente
// Función para matar procesos en el puerto 8080
/*
function killProcessOnPort(port) {
    return new Promise((resolve) => {
        if (process.platform === 'win32') {
            exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                if (stdout) {
                    const lines = stdout.split('\n');
                    const pids = new Set();
                    
                    lines.forEach(line => {
                        const match = line.match(/LISTENING\s+(\d+)/);
                        if (match) {
                            pids.add(match[1]);
                        }
                    });
                    
                    pids.forEach(pid => {
                        console.log(`Matando proceso en puerto ${port}, PID: ${pid}`);
                        exec(`taskkill /F /PID ${pid}`, (err) => {
                            if (err) console.error(`Error matando PID ${pid}:`, err.message);
                        });
                    });
                }
                resolve();
            });
        } else {
            exec(`lsof -ti:${port} | xargs kill -9`, () => resolve());
        }
    });
}
*/

// ❌ DESHABILITADO: Backend se gestiona externamente
// Función para detener el backend
/*
async function stopBackend() {
    console.log('🛑 Deteniendo backend...');
    
    if (backendProcess) {
        try {
            // Intentar cerrar gracefully
            if (process.platform === 'win32') {
                spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t']);
            } else {
                backendProcess.kill('SIGTERM');
            }
            backendProcess = null;
        } catch (error) {
            console.error('Error al cerrar backend:', error);
        }
    }
    
    // Asegurar que el puerto 8080 quede libre
    await killProcessOnPort(8080);
    console.log('✅ Backend detenido');
}
*/

// ❌ DESHABILITADO: Backend se gestiona externamente
// Función para iniciar el backend Spring Boot
/*
function startBackend() {
    return new Promise((resolve, reject) => {
        let javaPath = 'java';
        // Ruta en desarrollo
        const jarPath = path.join(__dirname, '../backend_farmStock/target/FarmStock-0.0.1-SNAPSHOT.jar');

        console.log('Iniciando backend desde:', jarPath);

        // Iniciar el proceso Java
        backendProcess = spawn(javaPath, ['-jar', jarPath], {
            cwd: path.dirname(jarPath),
            stdio: 'pipe'
        });

        backendProcess.stdout.on('data', (data) => {
            console.log(`Backend: ${data}`);
            // Detectar cuando el servidor está listo
            if (data.toString().includes('Started FarmStockApplication')) {
                console.log('✅ Backend iniciado correctamente');
                resolve();
            }
        });

        backendProcess.stderr.on('data', (data) => {
            console.error(`Backend Error: ${data}`);
        });

        backendProcess.on('error', (error) => {
            console.error('Error al iniciar backend:', error);
            reject(error);
        });

        backendProcess.on('close', (code) => {
            console.log(`Backend cerrado con código: ${code}`);
            backendProcess = null;
        });

        backendProcess.on('exit', (code) => {
            console.log(`Backend salió con código: ${code}`);
            backendProcess = null;
        });

        // Timeout de 30 segundos para que el backend inicie
        setTimeout(() => {
            if (backendProcess) {
                console.log('⚠️ Backend tardando en iniciar, continuando de todos modos...');
                resolve();
            }
        }, 30000);
    });
}
*/

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


    // 👇 Página inicial
    win.loadFile(path.join(__dirname, "app/HTML/indexInventario.html"));

    win.once("ready-to-show", () => {
        win.show();
        win.focus();
    });

    win.center();
    // win.webContents.openDevTools(); // opcional
}

let backendProcess = null;

function killPortAndStartBackend() {
    return new Promise((resolve) => {
        const { exec, spawn } = require('child_process');

        // Matar cualquier proceso que ocupe el puerto 3000 antes de iniciar
        exec('netstat -ano | findstr :3000', (error, stdout) => {
            const pids = new Set();
            if (stdout) {
                stdout.split('\n').forEach(line => {
                    const match = line.match(/LISTENING\s+(\d+)/);
                    if (match) pids.add(match[1]);
                });
            }

            const killPromises = [...pids].map(pid =>
                new Promise(r => exec(`taskkill /F /PID ${pid}`, () => r()))
            );

            Promise.all(killPromises).then(() => {
                if (pids.size > 0) console.log(`🧹 Proceso(s) en puerto 3000 terminados.`);

                const serverPath = path.join(__dirname, 'backend', 'server.js');
                console.log('Iniciando backend Node.js desde:', serverPath);

                // detached: true permite que el proceso hijo sobreviva independientemente
                backendProcess = spawn(process.execPath, [serverPath], {
                    cwd: __dirname,
                    detached: true,
                    stdio: ['ignore', 'pipe', 'pipe'],
                    windowsHide: true
                });

                backendProcess.stdout.on('data', (data) => {
                    const message = data.toString().trim();
                    console.log(`Backend: ${message}`);
                    if (message.includes('Servidor corriendo')) resolve();
                });

                backendProcess.stderr.on('data', (data) => {
                    console.error(`Backend Error: ${data.toString().trim()}`);
                });

                backendProcess.on('error', (err) => {
                    console.error('❌ Error al iniciar el backend:', err);
                    resolve();
                });

                backendProcess.on('close', (code) => {
                    if (code !== null && code !== 0) {
                        console.error(`⚠️ Backend cerrado con código: ${code}`);
                    }
                });

                setTimeout(resolve, 5000);
            });
        });
    });
}

app.whenReady().then(async () => {
    console.log('🚀 Iniciando FarmStock...');
    await killPortAndStartBackend();
    createWindow();
});


// Limpiar backend al cerrar la aplicación
app.on('before-quit', () => {
    if (backendProcess) {
        try {
            const { execSync } = require('child_process');
            execSync(`taskkill /F /PID ${backendProcess.pid} /T`, { windowsHide: true });
        } catch (e) {
            // El proceso ya terminó
        }
        backendProcess = null;
    }
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

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

// 🔹 Generar PDF
ipcMain.on("generar-pdf", async (event, { html, fecha }) => {
    try {
        const fs = require('fs');
        const os = require('os');
        
        // Crear ventana oculta para renderizar el HTML
        const pdfWindow = new BrowserWindow({
            show: false,
            webPreferences: {
                nodeIntegration: false
            }
        });
        
        // Cargar el HTML
        await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
        
        // Esperar a que cargue completamente
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generar nombre del archivo
        const fechaFormato = new Date().toISOString().split('T')[0];
        const nombreArchivo = `Estadisticas_FarmStock_${fechaFormato}.pdf`;
        
        // Mostrar diálogo para guardar
        const { filePath, canceled } = await dialog.showSaveDialog({
            title: 'Guardar Informe PDF',
            defaultPath: path.join(os.homedir(), 'Downloads', nombreArchivo),
            filters: [
                { name: 'PDF', extensions: ['pdf'] }
            ]
        });
        
        if (!canceled && filePath) {
            // Generar el PDF
            const data = await pdfWindow.webContents.printToPDF({
                printBackground: true,
                pageSize: 'A4',
                margins: {
                    top: 0.5,
                    bottom: 0.5,
                    left: 0.5,
                    right: 0.5
                }
            });
            
            // Guardar el archivo
            fs.writeFileSync(filePath, data);
            
            // Cerrar ventana temporal
            pdfWindow.close();
            
            // Notificar éxito
            event.reply('pdf-generado', filePath);
        } else {
            pdfWindow.close();
            event.reply('pdf-generado', null);
        }
    } catch (error) {
        console.error('Error generando PDF:', error);
        event.reply('pdf-generado', null);
    }
});
