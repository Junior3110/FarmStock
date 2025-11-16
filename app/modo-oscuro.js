// modo-oscuro.js
(function () {
  const STORAGE_KEY = 'fs_dark_mode';
  const body = document.body;

  // Apply mode (true = dark)
  function applyMode(dark) {
    if (dark) body.classList.add('dark-mode');
    else body.classList.remove('dark-mode');

    // Update any visible toggle labels or icons
    document.querySelectorAll('.night-mode, #btnModoNoche, [data-mode-toggle]').forEach(node => {
      // prefer inner span if exists
      const span = node.querySelector('span') || node;
      try {
        if (dark) span.textContent = '🌞 Modo claro';
        else span.textContent = '🌙 Modo noche';
      } catch (e) {
        // ignore
      }
    });
  }

  // Read saved preference (null if not set)
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved === null ? prefersDark : saved === 'true';
  applyMode(initial);

  // Toggle function
  function toggleMode() {
    const isDark = body.classList.contains('dark-mode');
    const newVal = !isDark;
    applyMode(newVal);
    try { localStorage.setItem(STORAGE_KEY, String(newVal)); } catch (e) {}
  }

  // Toggle function for dark mode
  function toggleModoOscuro() {
    const body = document.body;
    const logo = document.querySelector('.logo img');
    
    body.classList.toggle('dark-mode');
    
    // Cambiar imagen del logo según el modo
    if (body.classList.contains('dark-mode')) {
      if (logo) logo.src = '../imagenes/logo_modonoche.png';
      localStorage.setItem('modo-oscuro', 'true');
    } else {
      if (logo) logo.src = '../imagenes/Logo.png';
      localStorage.setItem('modo-oscuro', 'false');
    }
  }

  // Attach click handler globally for any toggle element
  document.addEventListener('click', function (ev) {
    const btn = ev.target.closest('.night-mode, #btnModoNoche, [data-mode-toggle]');
    if (btn) {
      ev.preventDefault();
      toggleMode();
    }
  });

  // Al cargar la página, verificar si modo oscuro estaba activo
  document.addEventListener('DOMContentLoaded', function() {
    const modoOscuroGuardado = localStorage.getItem('modo-oscuro');
    const logo = document.querySelector('.logo img');
    
    if (modoOscuroGuardado === 'true') {
      document.body.classList.add('dark-mode');
      if (logo) logo.src = '../imagenes/logo_modonoche.png';
    } else {
      if (logo) logo.src = '../imagenes/Logo.png';
    }
  });

  // Agregar evento al botón de modo noche
  document.addEventListener('DOMContentLoaded', function() {
    const btnModoNoche = document.getElementById('btnModoNoche');
    if (btnModoNoche) {
      btnModoNoche.addEventListener('click', toggleModoOscuro);
    }
  });

  // Exportar función para uso global
  window.toggleModoOscuro = toggleModoOscuro;

  // Optional: expose API for debugging
  window.FS = window.FS || {};
  window.FS.toggleDarkMode = toggleMode;
  window.FS.setDarkMode = function (d) { applyMode(Boolean(d)); localStorage.setItem(STORAGE_KEY, String(Boolean(d))); };
})();