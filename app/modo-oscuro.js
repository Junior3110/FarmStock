document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar botón
  const btnModo = document.querySelector(".night-mode");

  if (!btnModo) {
    console.error("❌ No se encontró el botón .night-mode en el DOM");
    return;
  }

  // Al hacer click, alternar dark-mode
  btnModo.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("modo", "oscuro");
      btnModo.textContent = "☀️ Modo claro";
    } else {
      localStorage.setItem("modo", "claro");
      btnModo.textContent = "🌙 Modo noche";
    }
  });

  // Al cargar la página, aplicar preferencia guardada
  const modo = localStorage.getItem("modo");
  if (modo === "oscuro") {
    document.body.classList.add("dark-mode");
    btnModo.textContent = "☀️ Modo claro";
  } else {
    btnModo.textContent = "🌙 Modo noche";
  }
});
