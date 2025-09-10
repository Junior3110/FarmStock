const API_URL = "http://localhost:8080/usuario";

// Crear usuario
document.getElementById("submit").addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: nombre }),
  });

  const usuario = await response.json();
  alert("Usuario creado: " + JSON.stringify(usuario));
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
