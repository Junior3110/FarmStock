// JS/render.js
// Validación visual para formulario de registro (solo popovers por campo, no tarjeta resumen).
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const form = document.getElementById('registroForm');
  if (!form) return;

  const globalErrorContainer = document.getElementById('form-global-error') || null;

  // --- Helpers UI (no cambian estilos globales) ---
  function clearInlineErrors() {
    // remove inline error text containers if any
    form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    // remove input highlight
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    // remove popovers
    document.querySelectorAll('.field-error-card').forEach(el => el.remove());
    if (globalErrorContainer) globalErrorContainer.textContent = '';
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function createFieldPopover(inputEl, message) {
    if (!inputEl) return;
    // remove existing popover for this input
    if (inputEl._errorCard && inputEl._errorCard.parentNode) {
      inputEl._errorCard.parentNode.removeChild(inputEl._errorCard);
      inputEl._errorCard = null;
    }

    const pop = document.createElement('div');
    pop.className = 'field-error-card';
    pop.setAttribute('role', 'status');
    pop.setAttribute('aria-live', 'polite');
    // minimal inline styles for popover placement (we don't change panel CSS)
    pop.style.position = 'absolute';
    pop.style.zIndex = 15000;
    pop.style.minWidth = '180px';
    pop.style.maxWidth = '320px';
    pop.style.background = getComputedStyle(document.body).getPropertyValue('--surface') || '#fff';
    pop.style.border = '1px solid rgba(0,0,0,0.06)';
    pop.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    pop.style.padding = '10px';
    pop.style.borderRadius = '10px';
    pop.style.fontSize = '13px';
    pop.style.color = getComputedStyle(document.body).getPropertyValue('--text') || '#111';

    pop.innerHTML = '<strong style="color:var(--danger);display:block;margin-bottom:6px;">Error</strong>' +
                    '<div style="color:var(--muted);font-size:13px;">' + escapeHtml(message) + '</div>';

    document.body.appendChild(pop);

    // position the popover relative to the input
    const rect = inputEl.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();

    // try place to the right, else below
    const rightSpace = window.innerWidth - rect.right;
    let top, left;
    if (rightSpace > popRect.width + 20) {
      top = rect.top + window.scrollY + (rect.height - popRect.height) / 2;
      left = rect.right + 10 + window.scrollX;
    } else {
      // place below
      top = rect.bottom + 8 + window.scrollY;
      left = rect.left + window.scrollX;
    }

    // clamp to viewport
    if (left + popRect.width > window.scrollX + window.innerWidth - 12) {
      left = window.scrollX + window.innerWidth - popRect.width - 12;
    }
    if (top < window.scrollY + 8) top = window.scrollY + 8;

    pop.style.left = left + 'px';
    pop.style.top = top + 'px';

    // store reference to remove later
    inputEl._errorCard = pop;

    // close popover when clicking outside or when input receives input
    function onDocClick(ev) {
      if (!pop.contains(ev.target) && ev.target !== inputEl) {
        removePopover();
      }
    }
    function onInput() {
      removePopover();
    }
    function removePopover() {
      if (inputEl._errorCard && inputEl._errorCard.parentNode) {
        inputEl._errorCard.parentNode.removeChild(inputEl._errorCard);
      }
      inputEl._errorCard = null;
      inputEl.removeEventListener('input', onInput);
      document.removeEventListener('click', onDocClick);
    }

    setTimeout(() => { // delay to avoid immediate close when clicking the control
      document.addEventListener('click', onDocClick);
      inputEl.addEventListener('input', onInput);
    }, 50);
  }

  // --- Validation logic (mirrors backend rules in Usuario.java) ---
  function validatePayload(payload) {
    const errors = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    if (!payload.nombres || !nameRegex.test(payload.nombres.trim())) {
      errors.nombres = 'El nombre solo puede contener letras y espacios.';
    }
    if (!payload.apellidos || !nameRegex.test(payload.apellidos.trim())) {
      errors.apellidos = 'El apellido solo puede contener letras y espacios.';
    }
    const tipoAllowed = ['CC', 'TI', 'PPT'];
    if (!payload.tipoDocumento || tipoAllowed.indexOf(payload.tipoDocumento) === -1) {
      errors.tipoDocumento = 'Tipo de documento inválido. Debe ser CC, TI o PPT.';
    }
    if (!payload.numeroDocumento || !/^[0-9]+$/.test(payload.numeroDocumento)) {
      errors.numeroDocumento = 'El número de documento debe contener solo dígitos.';
    }
    if (!payload.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.correo)) {
      errors.correo = 'Correo inválido.';
    }
    if (payload.telefono && !/^[0-9]{7,15}$/.test(payload.telefono)) {
      errors.telefono = 'El teléfono debe contener entre 7 y 15 dígitos (solo números).';
    }
    const cargoAllowed = ['instructor', 'aprendiz', 'administrador'];
    if (!payload.cargo || cargoAllowed.indexOf(payload.cargo) === -1) {
      errors.cargo = 'Cargo inválido. Opciones: instructor, aprendiz, administrador.';
    }
    const pwdRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!¿?*.,:;_\-]).{8,}$/;
    if (!payload.contrasena || !pwdRegex.test(payload.contrasena)) {
      errors.contrasena = 'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y carácter especial.';
    }
    return errors;
  }

  // --- Submit handler ---
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearInlineErrors();
    if (globalErrorContainer) globalErrorContainer.textContent = '';

    const payload = {
      nombres: (document.getElementById('nombres') || {}).value || '',
      apellidos: (document.getElementById('apellidos') || {}).value || '',
      correo: (document.getElementById('correo') || {}).value || '',
      telefono: (document.getElementById('telefono') || {}).value || '',
      numeroDocumento: (document.getElementById('numeroDocumento') || {}).value || '',
      tipoDocumento: (document.getElementById('tipoDocumento') || {}).value || '',
      cargo: (document.getElementById('cargo') || {}).value || '',
      contrasena: (document.getElementById('contrasena') || {}).value || ''
    };

    const confirmPassword = (document.getElementById('confirm_password') || {}).value || '';

    const fieldErrors = validatePayload(payload);
    if (payload.contrasena !== confirmPassword) {
      fieldErrors.confirm_password = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      // Show per-field popovers + highlight inputs. No summary card.
      Object.keys(fieldErrors).forEach(field => {
        // find element by id or by data-field fallback
        let input = document.getElementById(field);
        if (!input) {
          input = form.querySelector(`[name="${field}"]`) || form.querySelector(`[data-field="${field}"]`);
        }
        if (input) {
          input.classList.add('input-error');
          createFieldPopover(input, fieldErrors[field]);
          // also set the small inline text area if exists (doesn't change layout)
          const errArea = document.getElementById('err-' + field);
          if (errArea) errArea.textContent = fieldErrors[field];
        } else {
          // If input not found (confirm_password), set global text
          if (globalErrorContainer) globalErrorContainer.textContent = fieldErrors[field];
        }
      });
      return;
    }

    // passed frontend validation -> call backend (prefer FSApiClient if available)
    try {
      if (window.FSApiClient && typeof window.FSApiClient.crearUsuario === 'function') {
        await window.FSApiClient.crearUsuario(payload);
      } else {
        // fallback: direct fetch to backend
        const res = await fetch('/usuario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const text = await res.text().catch(()=>'');
          let body = null;
          try { body = text ? JSON.parse(text) : null; } catch(e) { body = text; }
          const err = new Error((body && (body.message || body.error)) || ('HTTP ' + res.status));
          if (res.status === 400 && body && body.fieldErrors) {
            err.fieldErrors = body.fieldErrors;
          }
          throw err;
        }
      }

      // success
      alert('Registro completado con éxito.');
      form.reset();
      window.location.href = 'login.html';
    } catch (err) {
      console.error('Error al crear usuario:', err);
      // If backend validation provided fieldErrors, show them as per-field popovers
      if (err && err.fieldErrors) {
        const fe = err.fieldErrors;
        Object.keys(fe).forEach(field => {
          let input = document.getElementById(field);
          if (!input) {
            input = form.querySelector(`[name="${field}"]`) || form.querySelector(`[data-field="${field}"]`);
          }
          if (input) {
            input.classList.add('input-error');
            createFieldPopover(input, fe[field]);
            const errArea = document.getElementById('err-' + field);
            if (errArea) errArea.textContent = fe[field];
          } else {
            if (globalErrorContainer) globalErrorContainer.textContent = fe[field];
          }
        });
        return;
      }
      // generic error fallback
      if (globalErrorContainer) globalErrorContainer.textContent = (err && err.message) ? err.message : 'Error al registrar';
      alert('Error al registrar: ' + ((err && err.message) ? err.message : 'error'));
    }
  });

});