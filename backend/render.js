const API_URL = "http://localhost:8080/usuario";

document.getElementById("formRegistro").addEventListener("submit", async (e) => {
    e.preventDefault(); // evita que se recargue la página

    // Tomar los valores de cada campo
    const usuario = {
        nombres: document.getElementById("nombres").value,
        apellidos: document.getElementById("apellidos").value,
        correo: document.getElementById("correo").value,
        telefono: document.getElementById("telefono").value,
        cargo: document.getElementById("cargo").value,
        tipoDocumento: document.getElementById("tipoDocumento").value,
        numeroDocumento: document.getElementById("numeroDocumento").value,
        ficha: document.getElementById("ficha").value,
        programaFormacion: document.getElementById("programaFormacion").value,
        contrasena: document.getElementById("contrasena").value
    };

    try {
        const response = await fetch("http://localhost:8080/usuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            alert("Usuario registrado con éxito 🚀");
            document.getElementById("formRegistro").reset();
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
document.getElementById("btnListar").addEventListener("click", async () => {
  const response = await fetch(API_URL);
  const usuarios = await response.json();

  const lista = document.getElementById("listaUsuarios");
  lista.innerHTML = ""; // limpiar antes
  usuarios.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `ID: ${u.id} - Nombre: ${u.nombre}`;
    lista.appendChild(li);
  });
});

// Eliminar usuario
document.getElementById("btnEliminar").addEventListener("click", async () => {
  const id = document.getElementById("usuarioId").value;

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const usuarioEliminado = await response.json();
    alert("Usuario eliminado: " + JSON.stringify(usuarioEliminado));
  } else {
    alert("Error al eliminar usuario");
  }
});
