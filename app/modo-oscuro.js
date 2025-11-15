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

  // Attach click handler globally for any toggle element
  document.addEventListener('click', function (ev) {
    const btn = ev.target.closest('.night-mode, #btnModoNoche, [data-mode-toggle]');
    if (btn) {
      ev.preventDefault();
      toggleMode();
    }
  });

  // Optional: expose API for debugging
  window.FS = window.FS || {};
  window.FS.toggleDarkMode = toggleMode;
  window.FS.setDarkMode = function (d) { applyMode(Boolean(d)); localStorage.setItem(STORAGE_KEY, String(Boolean(d))); };
})();