// JS/render-login.js (debuggable, evita "demo" fallback y fuerza comportamiento claro)
// Reemplaza el render-login.js actual por este. Carga FSApiClient.js antes de este script si quieres usarlo.

document.addEventListener("DOMContentLoaded", () => {
  'use strict';

  const form = document.getElementById('loginForm');
  if (!form) return;

  const API = window.FSApiClient || null;

  // Ensure a visible global error container (doesn't change layout)
  let globalError = document.getElementById('login-global-error');
  if (!globalError) {
    globalError = document.createElement('div');
    globalError.id = 'login-global-error';
    globalError.style.color = 'var(--danger)';
    globalError.style.marginTop = '8px';
    form.parentNode.insertBefore(globalError, form.nextSibling);
  }

  function clearErrors() {
    form.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    form.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
    document.querySelectorAll('.field-error-card').forEach(c => c.remove());
    globalError.textContent = '';
    console.debug('Login: cleared visual errors');
  }

  function createFieldPopover(inputEl, message) {
    if (!inputEl) return;
    if (inputEl._err && inputEl._err.parentNode) inputEl._err.parentNode.removeChild(inputEl._err);
    const pop = document.createElement('div');
    pop.className = 'field-error-card';
    pop.setAttribute('role','status');
    pop.setAttribute('aria-live','polite');
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
                    '<div style="color:var(--muted);font-size:13px;">' + String(message) + '</div>';
    document.body.appendChild(pop);
    const rect = inputEl.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();
    const rightSpace = window.innerWidth - rect.right;
    let top, left;
    if (rightSpace > popRect.width + 20) {
      top = rect.top + window.scrollY + (rect.height - popRect.height) / 2;
      left = rect.right + 10 + window.scrollX;
    } else {
      top = rect.bottom + 8 + window.scrollY;
      left = rect.left + window.scrollX;
    }
    if (left + popRect.width > window.scrollX + window.innerWidth - 12) {
      left = window.scrollX + window.innerWidth - popRect.width - 12;
    }
    if (top < window.scrollY + 8) top = window.scrollY + 8;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    inputEl._err = pop;
    function onDocClick(ev) {
      if (!pop.contains(ev.target) && ev.target !== inputEl) remove();
    }
    function onInput() { remove(); }
    function remove() {
      if (inputEl._err && inputEl._err.parentNode) inputEl._err.parentNode.removeChild(inputEl._err);
      inputEl._err = null;
      inputEl.removeEventListener('input', onInput);
      document.removeEventListener('click', onDocClick);
    }
    setTimeout(() => {
      document.addEventListener('click', onDocClick);
      inputEl.addEventListener('input', onInput);
    }, 50);
  }

  function validate(values) {
    const errors = {};
    if (!values.numeroDocumento || !/^[0-9]+$/.test(values.numeroDocumento)) {
      errors.numeroDocumento = 'Número de documento obligatorio y sólo dígitos.';
    }
    if (!values.password || values.password.length === 0) {
      errors.password = 'Contraseña obligatoria.';
    }
    if (values.tipoDocumento && ['CC','TI','PPT'].indexOf(values.tipoDocumento) === -1) {
      errors.tipoDocumento = 'Tipo de documento inválido.';
    }
    if (values.cargo && ['instructor','celador','administrador'].indexOf(values.cargo) === -1) {
      errors.cargo = 'Cargo inválido.';
    }
    return errors;
  }

  async function pingBackend() {
    // quick availability check; prefer FSApiClient.isBackendAvailable if present
    try {
      if (API && typeof API.isBackendAvailable === 'function') {
        const ok = await API.isBackendAvailable();
        console.debug('Login: backend ping via FSApiClient:', ok);
        return ok;
      }
      // fallback ping to /herramienta/hoy
      const res = await fetch('http://localhost:8080/herramienta/hoy', { method: 'GET' });
      return res.ok;
    } catch (e) {
      console.debug('Login: backend ping failed', e);
      return false;
    }
  }

  async function doLoginWithAPI(payload) {
    // Prefer API.login
    if (API && typeof API.login === 'function') {
      return API.login(payload);
    }
    // fallback
    const url = (window.location.origin || '') + '/usuario/login';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text().catch(()=>'');
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch(e) { body = text; }
    if (!res.ok) {
      const err = new Error((body && (body.message || body.error)) || ('HTTP ' + res.status));
      if (res.status === 400 && body && body.fieldErrors) err.fieldErrors = body.fieldErrors;
      throw err;
    }
    return body;
  }

  form.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    clearErrors();
    globalError.textContent = '';

    const numeroDocumento = (document.getElementById('documento') || {}).value || '';
    const tipoDocumento = (document.getElementById('tipoDocumentoLogin') || {}).value || '';
    const contrasena = (document.getElementById('password') || {}).value || '';
    const cargo = (document.getElementById('rol') || {}).value || '';

    const vals = {
      numeroDocumento: numeroDocumento.trim(),
      tipoDocumento: tipoDocumento.trim(),
      password: contrasena,
      cargo: (cargo || '').trim()
    };

    const fieldErrors = validate(vals);
    if (Object.keys(fieldErrors).length > 0) {
      Object.keys(fieldErrors).forEach(field => {
        let inputEl = null;
        if (field === 'password') inputEl = document.getElementById('password');
        else if (field === 'numeroDocumento') inputEl = document.getElementById('documento');
        else if (field === 'tipoDocumento') inputEl = document.getElementById('tipoDocumentoLogin');
        else if (field === 'cargo') inputEl = document.getElementById('rol');
        if (inputEl) {
          inputEl.classList.add('input-error');
          createFieldPopover(inputEl, fieldErrors[field]);
        } else {
          globalError.textContent = fieldErrors[field];
        }
      });
      return;
    }

    // Check backend availability before attempting login
    const backendAvailable = await pingBackend();
    if (!backendAvailable) {
      // show explicit message and do NOT perform offline success. Let user know backend is down.
      const docEl = document.getElementById('documento');
      if (docEl) {
        docEl.classList.add('input-error');
        createFieldPopover(docEl, 'No se puede conectar con el servidor (backend apagado o CORS). Comprueba que el backend en http://localhost:8080 esté corriendo.');
      } else {
        globalError.textContent = 'No se puede conectar con el servidor (backend apagado).';
      }
      console.warn('Login aborted: backend not available');
      return;
    }

    // call backend
    try {
      const payload = {
        numeroDocumento: vals.numeroDocumento,
        tipoDocumento: vals.tipoDocumento || 'CC',
        contrasena: vals.password,
        cargo: vals.cargo || ''
      };

      const result = await doLoginWithAPI(payload);
      console.debug('Login result (raw):', result);

      // success: store session info
      localStorage.setItem('documento', vals.numeroDocumento);
      localStorage.setItem('rol', vals.cargo || '');
      
      // Store user info from login response
      if (result) {
        console.log('Respuesta completa del login:', JSON.stringify(result));
        
        // Intentar extraer datos del usuario de diferentes estructuras posibles
        let userData = null;
        
        if (result.usuario) {
          userData = result.usuario;
        } else if (result.data && result.data.usuario) {
          userData = result.data.usuario;
        } else if (result.nombres) {
          userData = result;
        }
        
        if (userData && userData.nombres) {
          localStorage.setItem('fs_usuario_actual', JSON.stringify({
            idUsuario: userData.idUsuario || userData.id || null,
            nombres: userData.nombres,
            apellidos: userData.apellidos || '',
            correo: userData.correo || userData.email || '',
            telefono: userData.telefono || '',
            numeroDocumento: vals.numeroDocumento,
            tipoDocumento: vals.tipoDocumento || 'CC',
            cargo: vals.cargo || userData.cargo || ''
          }));
          console.log('✅ Usuario guardado con nombre:', userData.nombres);
        } else {
          // Si el backend no devuelve el usuario, hacer una petición adicional
          console.warn('Login no devolvió datos del usuario, intentando buscar...');
          try {
            const userRes = await fetch(`http://localhost:8080/usuario/documento/${vals.numeroDocumento}`);
            if (userRes.ok) {
              const user = await userRes.json();
              localStorage.setItem('fs_usuario_actual', JSON.stringify({
                idUsuario: user.idUsuario,
                nombres: user.nombres,
                apellidos: user.apellidos,
                correo: user.correo,
                telefono: user.telefono,
                numeroDocumento: user.numeroDocumento,
                tipoDocumento: user.tipoDocumento,
                cargo: user.cargo
              }));
              console.log('✅ Usuario obtenido del endpoint /documento:', user.nombres);
            }
          } catch (e) {
            console.error('❌ No se pudo obtener datos del usuario:', e);
            // Guardar datos mínimos
            localStorage.setItem('fs_usuario_actual', JSON.stringify({
              nombres: 'Usuario',
              numeroDocumento: vals.numeroDocumento,
              cargo: vals.cargo || ''
            }));
          }
        }
      }
      
      // Redirigir según rol
      const usuario = JSON.parse(localStorage.getItem('fs_usuario_actual'));
      if (usuario && usuario.cargo === 'celador') {
        window.location.replace('equipos-computos.html');
      } else {
        window.location.replace('index.html');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err && err.fieldErrors) {
        const fe = err.fieldErrors;
        Object.keys(fe).forEach(f => {
          let inputEl = null;
          if (f === 'numeroDocumento') inputEl = document.getElementById('documento');
          if (f === 'contrasena' || f === 'password') inputEl = document.getElementById('password');
          if (inputEl) { inputEl.classList.add('input-error'); createFieldPopover(inputEl, fe[f]); }
          else { globalError.textContent = fe[f] || err.message || 'Error al iniciar sesión'; }
        });
        return;
      }
      const pwdEl = document.getElementById('password');
      const msg = (err && err.message) ? err.message : 'Credenciales inválidas';
      if (pwdEl) {
        pwdEl.classList.add('input-error');
        createFieldPopover(pwdEl, msg);
      } else {
        globalError.textContent = msg;
      }
    }
  });

});