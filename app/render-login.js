// render-login.js
const API_URL = "http://localhost:8080/usuario/login";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const documento = document.getElementById("documento").value;
    const tipoDoc = document.getElementById("tipo-doc").value;
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;

    const datosLogin = {
      numeroDocumento: documento,
      tipoDocumento: tipoDoc,
      contrasena: password,
      cargo: rol
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosLogin)
      });

      if (response.ok) {
        const mensaje = await response.text();
        alert(mensaje);
        localStorage.setItem("documento", documento);
        localStorage.setItem("rol", rol);
        window.location.href = "index.html";
      } else {
        let errorMsg;
        try {
          errorMsg = await response.json();
        } catch {
          errorMsg = await response.text();
        }
        console.error("Error en login:", errorMsg);
        alert("Error al iniciar sesión ❌: " + JSON.stringify(errorMsg, null, 2));
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor ⚠");
    }
  });

  // Limpiar localStorage al cargar
  localStorage.removeItem('documento');
  localStorage.removeItem('rol');
  document.getElementById("documento").focus();
});
