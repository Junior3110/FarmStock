window.addEventListener("DOMContentLoaded", () => {
    const minimizeBtn = document.getElementById("minimize");
    const maximizeBtn = document.getElementById("maximize");
    const closeBtn = document.getElementById("close");

    // Detecta si estamos en el entorno donde window.api está expuesto (por ejemplo Electron preload)
    const hasApi = window.api && typeof window.api.minimize === "function" &&
        typeof window.api.maximize === "function" &&
        typeof window.api.close === "function";

    if (minimizeBtn) {
        if (hasApi) {
            minimizeBtn.addEventListener("click", () => window.api.minimize());
        } else {
            // Fallback: no es posible minimizar en navegador normal; damos feedback al usuario
            minimizeBtn.addEventListener("click", () => {
                console.warn("Minimizar no disponible en este entorno.");
                try { window.blur(); } catch (e) { /* ignore */ }
                alert("La función de minimizar no está disponible en este entorno.");
            });
        }
    }

    if (maximizeBtn) {
        if (hasApi) {
            maximizeBtn.addEventListener("click", () => window.api.maximize());
        } else {
            // Fallback: usar pantalla completa como reemplazo razonable
            maximizeBtn.addEventListener("click", async() => {
                try {
                    if (!document.fullscreenElement) {
                        await document.documentElement.requestFullscreen();
                    } else {
                        await document.exitFullscreen();
                    }
                } catch (e) {
                    console.warn("No se pudo alternar pantalla completa:", e);
                    alert("Maximizar no está disponible en este navegador.");
                }
            });
        }
    }

    if (closeBtn) {
        if (hasApi) {
            closeBtn.addEventListener("click", () => window.api.close());
        } else {
            // Fallback: intentar cerrar la ventana (solo funciona si fue abierta por script) o avisar al usuario
            closeBtn.addEventListener("click", () => {
                try {
                    window.close();
                    // Si window.close no funciona (p. ej. pestaña no abierta por script), mostramos mensaje
                    setTimeout(() => {
                        if (!window.closed) {
                            alert("No se puede cerrar la ventana desde este navegador. Cierre la pestaña manualmente.");
                        }
                    }, 200);
                } catch (e) {
                    alert("Cerrar no está disponible en este entorno.");
                }
            });
        }
    }
});