function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(seccion => {
    seccion.classList.remove('visible');
  });

  const activa = document.getElementById(id);
  if (activa) activa.classList.add('visible');
}
