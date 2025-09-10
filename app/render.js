const API_URL = "http://localhost:8080/usuario";

document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const datos = new FormData(form);
  const usuario = Object.fromEntries(datos);

  // Validar contraseñas
  if (usuario.contrasena !== usuario.confirm_password) {
    alert("Las contraseñas no coinciden ❌");
    return;
  }
  delete usuario.confirm_password;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    if (response.ok) {
      alert("Usuario registrado con éxito 🚀");
      form.reset();
      window.location.href = "../HTML/login.html";
    } else {
      let errorMsg;
      try {
        errorMsg = await response.json();
      } catch {
        errorMsg = await response.text();
      }
      console.error("Error en el registro:", errorMsg);
      alert("Error en el registro ❌: " + JSON.stringify(errorMsg, null, 2));
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("No se pudo conectar con el servidor ⚠");
  }
});