/* modal-utils.js
   Helper pequeño para abrir/cerrar modales de forma accesible:
   - Guarda el elemento que tenía focus antes de abrir.
   - Sitúa focus en el primer control del modal.
   - Al cerrar restaura focus al disparador.
   - Evita el warning "aria-hidden on an element because its descendant retained focus".
   Uso: window.modalUtils.openModal(backdropElement) / closeModal(backdropElement)
   También añade delegación automática para atributos data-open-modal / data-close-modal.
*/
(function () {
  function isFocusable(el) {
    if (!el) return false;
    return el.matches('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
  }

  function findFirstFocusable(container) {
    if (!container) return null;
    return container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  }

  function openModal(backdrop) {
    if (!backdrop) return;
    // store previous focused element
    try { backdrop._previouslyFocused = document.activeElement; } catch (e) { backdrop._previouslyFocused = null; }
    // show
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    // focus first focusable
    var first = findFirstFocusable(backdrop);
    if (first) {
      try { first.focus(); } catch (e) {}
    } else {
      // if no focusable, set focus to backdrop to keep keyboard capture
      try { backdrop.focus(); } catch (e) {}
    }
  }

  function closeModal(backdrop) {
    if (!backdrop) return;
    // If the active element is inside the backdrop, blur it BEFORE hiding to avoid aria-hidden focus warning
    try {
      var active = document.activeElement;
      if (active && backdrop.contains(active)) {
        // try to restore focus to the opener first
        if (backdrop._previouslyFocused && typeof backdrop._previouslyFocused.focus === 'function') {
          backdrop._previouslyFocused.focus();
        } else {
          // otherwise blur the active element so hidden element doesn't keep focus
          try { active.blur(); } catch (e) {}
        }
      }
    } catch (e) {}
    // hide
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    // cleanup stored ref
    try { delete backdrop._previouslyFocused; } catch (e) {}
  }

  // Auto-delegate clicks for data-open-modal / data-close-modal
  document.addEventListener('click', function (ev) {
    var openBtn = ev.target.closest('[data-open-modal]');
    if (openBtn) {
      ev.preventDefault();
      var id = openBtn.getAttribute('data-open-modal');
      var bd = document.getElementById(id);
      if (bd) openModal(bd);
      return;
    }
    var closeBtn = ev.target.closest('[data-close-modal]');
    if (closeBtn) {
      ev.preventDefault();
      var idc = closeBtn.getAttribute('data-close-modal');
      var bd2 = idc ? document.getElementById(idc) : ev.target.closest('.modal-backdrop') || ev.target.closest('.modal-backdrop-ap');
      if (bd2) closeModal(bd2);
      return;
    }
    // clicking on backdrop itself should close
    if (ev.target.classList && (ev.target.classList.contains('modal-backdrop') || ev.target.classList.contains('modal-backdrop-ap'))) {
      closeModal(ev.target);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      document.querySelectorAll('.modal-backdrop.open, .modal-backdrop-ap.open').forEach(function (bd) {
        closeModal(bd);
      });
    }
  });

  // expose API
  window.modalUtils = {
    openModal: openModal,
    closeModal: closeModal
  };
})();

/* modal-utils.js
   Helper que:
   - Evita el warning "aria-hidden on an element because its descendant retained focus"
   - Gestiona focus al abrir y cerrar modales
   - Observa cambios en backdrops existentes (no necesitas modificar los listeners existentes)
   - Provee API opcional window.modalUtils.openModal / closeModal

   Guardar en: ../JS/modal-utils.js
   Incluir en tus HTML justo antes de los demás scripts al final del body:
     <script src="../JS/modal-utils.js"></script>
     <script src="../modo-oscuro.js"></script>
     <script src="../render-window.js"></script>
*/

(function () {
  'use strict';

  // Util: ¿es focusable?
  function isFocusable(el) {
    if (!el || el.nodeType !== 1) return false;
    try {
      return !!(el.matches('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])') && !el.hasAttribute('disabled'));
    } catch (e) {
      return false;
    }
  }

  function findFirstFocusable(container) {
    if (!container) return null;
    return container.querySelector('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
  }

  // Guarda una pila de modales abiertos para manejo de ESC y restore focus
  var openStack = [];

  function markBackdrop(bd) {
    if (!bd) return;
    // asegúrate de que pueda recibir focus si no hay controles dentro
    if (!bd.hasAttribute('tabindex')) bd.setAttribute('tabindex', '-1');
    if (!bd.hasAttribute('role')) bd.setAttribute('role', 'dialog');
    if (!bd.hasAttribute('aria-hidden')) bd.setAttribute('aria-hidden', 'true');
  }

  function doOpen(bd, options) {
    if (!bd) return;
    // si ya está abierto, no duplicar
    if (bd.classList.contains('open') || bd.getAttribute('aria-hidden') === 'false') {
      return;
    }

    // almacenar foco previo
    bd.__prevActive = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
    // mostrar
    bd.classList.add('open');
    bd.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // focus al primer control o al backdrop si no hay
    var first = findFirstFocusable(bd);
    if (first) {
      try { first.focus(); } catch(e) {}
    } else {
      try { bd.focus(); } catch(e) {}
    }

    // push a stack
    openStack.push(bd);
  }

  function doClose(bd) {
    if (!bd) return;
    // if not open, return
    if (!bd.classList.contains('open') && bd.getAttribute('aria-hidden') !== 'false') return;

    // Si hay un elemento con foco dentro del modal, restaurarlo antes de ocultar (evita warning)
    try {
      var active = document.activeElement;
      if (active && bd.contains(active)) {
        // restore to opener if exists
        if (bd.__prevActive && typeof bd.__prevActive.focus === 'function') {
          bd.__prevActive.focus();
        } else {
          try { active.blur(); } catch(e) {}
        }
      }
    } catch (e) {
      // ignore
    }

    // hide
    bd.classList.remove('open');
    bd.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // remove from openStack if present (last occurrence)
    for (var i = openStack.length - 1; i >= 0; i--) {
      if (openStack[i] === bd) { openStack.splice(i, 1); break; }
    }

    // cleanup stored refs
    try { delete bd.__prevActive; } catch(e) {}
  }

  // MutationObserver: observa cuando otros scripts añaden/remueven la clase 'open' o cambian aria-hidden
  function observeBackdrop(bd) {
    if (!bd || bd.__observing) return;
    bd.__observing = true;

    markBackdrop(bd);

    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type === 'attributes') {
          if (m.attributeName === 'class') {
            var isOpen = bd.classList.contains('open');
            var ariaHidden = bd.getAttribute('aria-hidden') === 'false';
            if (isOpen || ariaHidden) {
              // si fue abierto por otro script, asegurar comportamiento accesible
              doOpen(bd);
            } else {
              // cerrado
              doClose(bd);
            }
          }
          if (m.attributeName === 'aria-hidden') {
            var val = bd.getAttribute('aria-hidden');
            if (val === 'false') doOpen(bd);
            else doClose(bd);
          }
        }
      });
    });

    mo.observe(bd, { attributes: true, attributeFilter: ['class', 'aria-hidden'] });
    // si ya estaba abierto en el momento de registrar
    if (bd.classList.contains('open') || bd.getAttribute('aria-hidden') === 'false') {
      doOpen(bd);
    }
  }

  // Inicializa: busca todos los backdrops existentes y los observa
  function initAll() {
    var list = document.querySelectorAll('.modal-backdrop, .modal-backdrop-ap');
    list.forEach(function (bd) { observeBackdrop(bd); });
  }

  // Delegate: cerrar con ESC la capa superior
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      if (openStack.length > 0) {
        // cierra el último abierto
        var top = openStack[openStack.length - 1];
        try {
          // intenta cerrar removiendo la clase y dejando que el observer se encargue de restaurar focus
          if (top) {
            // preferimos llamar doClose para asegurar restauración de focus
            doClose(top);
          }
        } catch (e) {}
      }
    }
  });

  // Cierre al hacer click en backdrop (pero no dentro del modal box)
  document.addEventListener('click', function (ev) {
    var bd = ev.target;
    if (!bd) return;
    if (bd.classList && (bd.classList.contains('modal-backdrop') || bd.classList.contains('modal-backdrop-ap'))) {
      // intentamos cerrar (si existe handler propio seguirá funcionando)
      doClose(bd);
    }
  });

  // Exponer API público
  window.modalUtils = {
    openModal: function (backdropElement) { observeBackdrop(backdropElement); doOpen(backdropElement); },
    closeModal: function (backdropElement) { observeBackdrop(backdropElement); doClose(backdropElement); },
    observeBackdrop: observeBackdrop,
    initAll: initAll
  };

  // Iniciar al cargar DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(); });
  } else {
    initAll();
  }

  // También observar el DOM para que si se añaden backdrops dinámicamente, los registremos
  var bodyObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.classList && (n.classList.contains('modal-backdrop') || n.classList.contains('modal-backdrop-ap'))) {
            observeBackdrop(n);
          } else {
            // También buscar descendientes
            var subs = n.querySelectorAll && n.querySelectorAll('.modal-backdrop, .modal-backdrop-ap');
            if (subs && subs.length) subs.forEach(function (s) { observeBackdrop(s); });
          }
        });
      }
    });
  });
  bodyObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });

})();