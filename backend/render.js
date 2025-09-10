const API_URL = "http://localhost:8080/usuario";

document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Datos del formulario
  const form = e.target;
  const datos = new FormData(form);
  const usuario = Object.fromEntries(datos);

  // Validar contraseñas
  if (usuario.contrasena !== usuario.confirm_password) {
    alert("Las contraseñas no coinciden ❌");
    return;
  }
  delete usuario.confirm_password; // No enviar confirmación al backend

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
      const error = await response.text();
      alert("Error en el registro ❌: " + error);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("No se pudo conectar con el servidor ⚠️");
  }
});


// Listar usuarios
document.getElementById("btnListar")?.addEventListener("click", async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al listar usuarios");

    const usuarios = await response.json();
    const lista = document.getElementById("listaUsuarios");
    lista.innerHTML = "";

    usuarios.forEach(u => {
      const li = document.createElement("li");
      li.textContent = `ID: ${u.id} - Nombre: ${u.nombres} ${u.apellidos}`;
      lista.appendChild(li);
    });
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// Eliminar usuario
document.getElementById("btnEliminar")?.addEventListener("click", async () => {
  const id = document.getElementById("usuarioId").value;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Usuario eliminado con éxito 🗑️");
    } else {
      throw new Error("No se pudo eliminar el usuario");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
});
