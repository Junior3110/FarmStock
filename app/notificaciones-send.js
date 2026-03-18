// send-notificacion.js (mejorado: muestra body del servidor y logs)
const API_BASE = 'http://localhost:3000'; // ajusta si tu backend está en otra URL/puerto

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formReporte');
  const filesInput = document.getElementById('rep_files');
  const attachPreview = document.getElementById('attachPreview');
  const sendStatus = document.getElementById('sendStatus');

  function renderPreview() {
    attachPreview.innerHTML = '';
    if (!filesInput.files || filesInput.files.length === 0) return;
    Array.from(filesInput.files).forEach(f => {
      const item = document.createElement('div');
      item.className = 'attach-item';
      item.textContent = f.name + ' (' + Math.round(f.size/1024) + ' KB)';
      attachPreview.appendChild(item);
    });
  }
  filesInput?.addEventListener('change', renderPreview);

  function showToast(message, type = 'success', timeout = 6000) {
    const toast = document.createElement('div');
    toast.className = `fs-toast fs-toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    const icon = document.createElement('span'); icon.className='fs-toast__icon'; icon.innerHTML = type === 'success' ? '✔' : '✖';
    const text = document.createElement('div'); text.className='fs-toast__text'; text.textContent = message;
    const closeBtn = document.createElement('button'); closeBtn.className='fs-toast__close'; closeBtn.innerHTML='×';
    closeBtn.addEventListener('click', ()=>{ toast.classList.add('fs-toast--hide'); setTimeout(()=>toast.remove(),300); });
    toast.appendChild(icon); toast.appendChild(text); toast.appendChild(closeBtn);
    document.body.appendChild(toast);
    requestAnimationFrame(()=>toast.classList.add('fs-toast--show'));
    if (timeout>0) setTimeout(()=>{ toast.classList.add('fs-toast--hide'); setTimeout(()=>toast.remove(),300); }, timeout);
  }

  function setButtonLoading(btn, loading) {
    if (!btn) return;
    if (loading) { btn.dataset.orig = btn.innerHTML; btn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> Enviando...'; btn.disabled = true; }
    else { btn.disabled = false; if (btn.dataset.orig) { btn.innerHTML = btn.dataset.orig; delete btn.dataset.orig; } }
  }

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('btnSend');
    setButtonLoading(btn, true);
    sendStatus.textContent = 'Enviando...';

    const fd = new FormData();
    fd.append('destinatario', document.getElementById('rep_email').value);
    fd.append('asunto', document.getElementById('rep_asunto').value);
    fd.append('descripcion', document.getElementById('rep_descripcion').value);

    if (filesInput && filesInput.files.length > 0) {
      for (let i = 0; i < filesInput.files.length; i++) {
        fd.append('files', filesInput.files[i]);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/notificaciones/resend`, {
        method: 'POST',
        body: fd
      });

      // leer el body aun cuando sea error
      const contentType = res.headers.get('content-type') || '';
      let bodyText = '';
      let jsonBody = null;
      if (contentType.includes('application/json')) {
        jsonBody = await res.json();
        bodyText = jsonBody?.message || jsonBody?.error || JSON.stringify(jsonBody);
      } else {
        bodyText = await res.text();
      }

      console.log('Respuesta del backend:', res.status, bodyText, jsonBody);

      if (!res.ok) {
        // mostrar el detalle devuelto por el servidor
        showToast(bodyText || `Error ${res.status}`, 'error', 9000);
        sendStatus.textContent = 'Error';
      } else {
        showToast(bodyText || 'Correo enviado correctamente', 'success');
        form.reset();
        renderPreview();
        sendStatus.textContent = 'Enviado';
        document.getElementById('cerrar-modal')?.click();
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Error de red: ' + (err.message || err), 'error', 9000);
      sendStatus.textContent = 'Error';
    } finally {
      setButtonLoading(btn, false);
      setTimeout(()=> sendStatus.textContent = '', 3000);
    }
  });
});