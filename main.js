const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");

let win;
let backendProcess = null;

// Función para matar procesos en el puerto 8080
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

// Función para detener el backend
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

// Función para iniciar el backend Spring Boot
function startBackend() {
    return new Promise((resolve, reject) => {
        const isDev = !app.isPackaged;
        let javaPath = 'java';
        let jarPath;

        if (isDev) {
            // Ruta en desarrollo (ajústala según tu estructura)
            jarPath = path.join(__dirname, '../backend_farmStock/target/FarmStock-0.0.1-SNAPSHOT.jar');
        } else {
            // Ruta en producción (dentro de resources)
            jarPath = path.join(process.resourcesPath, 'backend', 'FarmStock-0.0.1-SNAPSHOT.jar');
        }

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

app.whenReady().then(async () => {
    console.log('🚀 Iniciando FarmStock...');
    
    // Limpiar puerto 8080 por si quedó algún proceso previo
    await killProcessOnPort(8080);
    
    try {
        // Iniciar el backend primero
        await startBackend();
        console.log('✅ Backend listo');
        
        // Luego crear la ventana
        createWindow();
    } catch (error) {
        console.error('❌ Error al iniciar backend:', error);
        // Crear ventana de todos modos (podrías mostrar un mensaje de error)
        createWindow();
    }
});

// Cerrar el backend cuando se cierre la aplicación
app.on('before-quit', async (event) => {
    event.preventDefault();
    await stopBackend();
    app.exit(0);
});

app.on('window-all-closed', async () => {
    await stopBackend();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Asegurar limpieza al salir
app.on('will-quit', async () => {
    await stopBackend();
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