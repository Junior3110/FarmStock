// Seleccionar botón
const btnModo = document.querySelector(".night-mode");

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
window.addEventListener("load", () => {
  const modo = localStorage.getItem("modo");
  if (modo === "oscuro") {
    document.body.classList.add("dark-mode");
    btnModo.textContent = "☀️ Modo claro";
  } else {
    btnModo.textContent = "🌙 Modo noche";
  }
});
