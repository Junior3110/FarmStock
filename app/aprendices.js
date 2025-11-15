// JS/aprendices.js
// Versión completa lista para pegar. Incluye:
// - manejo de foco/aria para modal (mejora accesibilidad)
// - comprobación de id remoto antes de eliminar (evita 500 por ids locales)
// - uso de 'lap-' como id local consistente
// - console.debug para depuración
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const API = window.FSApiClient || null;
  const LS_KEY = 'fs_aprendices_v1';

  // Elements
  const tablaBody = document.querySelector('#tablaAprendices tbody');
  const btnExport = document.getElementById('btnExport');
  const btnOpenNuevo = document.getElementById('btnOpenNuevo');
  const btnFilter = document.getElementById('btnFilter');
  const btnClearFilter = document.getElementById('btnClearFilter');
  const selectFilterField = document.getElementById('filter_field');
  const inputFilterValue = document.getElementById('filter_value');

  const modalNuevo = document.getElementById('modalNuevoAprendiz');
  const formNuevo = document.getElementById('formNuevoAprendiz');
  const closeNuevo = document.getElementById('closeNuevoApr');

  const modalBackdrop = document.getElementById('modalAprendiz');
  const modalForm = document.getElementById('formModalAprendiz');
  const modalClose = document.getElementById('closeModalApr');
  const modalCancel = document.getElementById('cancelModalApr');

  // Helpers
  function escapeHtml(s) { if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function genLocalId() { return 'lap-' + Date.now(); }
  function isRemoteId(id) { return /^\d+$/.test(String(id)); } // acepta solo enteros positivos
  function localLoad() { try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : []; } catch(e){ return []; } }
  function localSave(list) { try { localStorage.setItem(LS_KEY, JSON.stringify(list || [])); } catch(e){} }

  // Accessibility: modal focus handling
  let _previouslyFocused = null;
  function setInertOnMain(inert) {
    const main = document.querySelector('main');
    if (!main) return;
    if ('inert' in main) {
      main.inert = inert;
    } else {
      main.setAttribute('aria-hidden', inert ? 'true' : 'false');
    }
  }

  function openNuevoModal() {
    _previouslyFocused = document.activeElement;
    setInertOnMain(true);
    modalNuevo.classList.add('open');
    modalNuevo.setAttribute('aria-hidden','false');
    const el = document.getElementById('nuevo_ap_nombre');
    if (el) el.focus();
    else {
      const btn = document.getElementById('btnGuardarNuevo') || modalNuevo.querySelector('button');
      if (btn) btn.focus();
    }
  }
  function closeNuevoModal() {
    modalNuevo.classList.remove('open');
    modalNuevo.setAttribute('aria-hidden','true');
    setInertOnMain(false);
    try { formNuevo.reset(); } catch(e){}
    try { if (_previouslyFocused && typeof _previouslyFocused.focus === 'function') _previouslyFocused.focus(); } catch(e){}
  }

  // Obtener y normalizar registros
  async function obtenerAprendices() {
    if (API && typeof API.obtenerAprendices === 'function') {
      try {
        return await API.obtenerAprendices();
      } catch (e) {
        console.warn('obtenerAprendices backend failed, falling back local', e);
        return API.loadLocalAprendices ? API.loadLocalAprendices() : localLoad();
      }
    }
    return localLoad();
  }

  async function renderTable(filter = {}) {
    tablaBody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
    let list = await obtenerAprendices();

    list = (list || []).map(item => {
      return {
        id: item.id || item.idAprendiz || item.numeroDocumento || item.numero_documento || genLocalId(),
        nombre: (item.nombres || item.nombre || item.name || '').trim(),
        tipo_documento: item.tipoDocumento || item.tipo_documento || item.tipo || '',
        numero_documento: item.numeroDocumento || item.numero_documento || item.documento || '',
        numero_ficha: item.ficha || item.numeroFicha || item.numero_ficha || item.numero_ficha || ''
      };
    });

    const filtered = list.filter(it => {
      if (filter && filter.field && filter.value && String(filter.value).trim() !== '') {
        const val = String(filter.value).toLowerCase();
        const key = filter.field === 'numero_ficha' ? 'numero_ficha' : 'numero_documento';
        return String(it[key] || '').toLowerCase().includes(val);
      }
      return true;
    });

    tablaBody.innerHTML = '';
    if (!filtered || filtered.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="5" style="padding:14px;color:var(--muted);">No hay aprendices registrados.</td>`;
      tablaBody.appendChild(tr);
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(item.nombre)}</td>
        <td>${escapeHtml(item.tipo_documento)}</td>
        <td>${escapeHtml(item.numero_documento)}</td>
        <td>${escapeHtml(item.numero_ficha)}</td>
        <td class="actions">
          <button class="btn-edit" data-id="${escapeHtml(item.id)}">Editar</button>
          <button class="btn-delete" data-id="${escapeHtml(item.id)}">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // Wiring modal open/close
  btnOpenNuevo.addEventListener('click', openNuevoModal);
  closeNuevo.addEventListener('click', closeNuevoModal);
  modalNuevo.addEventListener('click', (ev) => { if (ev.target === modalNuevo) closeNuevoModal(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { closeNuevoModal(); closeEditModal(); } });

  // Create nuevo aprendiz (normalized payload + logging)
  formNuevo.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const nombre = (document.getElementById('nuevo_ap_nombre').value || '').trim();
    const tipo = (document.getElementById('nuevo_ap_tipo').value || '').trim();
    const numero = (document.getElementById('nuevo_ap_num').value || '').trim();
    const ficha = (document.getElementById('nuevo_ap_ficha').value || '').trim();
    if (!nombre || !tipo || !numero) { alert('Completa Nombre, Tipo y Número.'); return; }

    const payload = {
      nombres: nombre,
      nombre: nombre,
      tipoDocumento: tipo,
      tipo_documento: tipo,
      numeroDocumento: numero,
      numero_documento: numero,
      ficha: ficha,
      numeroFicha: ficha,
      numero_ficha: ficha,
      correo: '',
      telefono: ''
    };

    console.debug('Intentando enviar payload /aprendiz:', payload);

    try {
      let created;
      if (API && typeof API.crearAprendiz === 'function') {
        created = await API.crearAprendiz(payload);
      } else {
        const res = await fetch('/aprendiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const respText = await res.text().catch(()=>'');
        console.debug('/aprendiz response', res.status, respText);
        if (!res.ok) {
          const parsed = (() => { try { return JSON.parse(respText); } catch(e) { return respText; } })();
          throw new Error('HTTP ' + res.status + ' - ' + (parsed && parsed.message ? parsed.message : JSON.stringify(parsed)));
        }
        created = respText ? (JSON.parse(respText) || payload) : payload;
      }

      // If backend returned an object without _local, assume server saved it
      closeNuevoModal();
      await renderTable();
      alert(created && created._local ? 'Guardado localmente (offline)' : 'Aprendiz registrado correctamente');
    } catch (err) {
      console.error('Error creando aprendiz:', err);
      alert('Error creando aprendiz: ' + ((err && err.message) ? err.message : 'error'));
    }
  });

  // Delegated table actions (edit/delete)
  tablaBody.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains('btn-delete')) {
      if (!confirm('Eliminar aprendiz?')) return;
      try {
        if (!isRemoteId(id)) {
          // id local -> delete only locally
          const list = localLoad().filter(x => String(x.id) !== String(id));
          localSave(list);
        } else {
          // remote id -> call backend
          if (API && typeof API.eliminarAprendiz === 'function') {
            await API.eliminarAprendiz(id);
          } else {
            await fetch('/aprendiz/' + encodeURIComponent(id), { method: 'DELETE' });
          }
        }
        await renderTable();
      } catch (err) {
        console.error('Eliminar error:', err);
        alert('No se pudo eliminar: ' + ((err && err.message) ? err.message : 'error'));
      }
      return;
    }
    if (btn.classList.contains('btn-edit')) {
      try {
        let list = [];
        if (API && typeof API.obtenerAprendices === 'function') {
          list = await API.obtenerAprendices();
        } else {
          list = localLoad();
        }
        const normalized = (list || []).map(it => ({
          id: it.id || it.idAprendiz || it.numeroDocumento || it.numero_documento || genLocalId(),
          nombre: it.nombres || it.nombre || '',
          tipo_documento: it.tipoDocumento || it.tipo_documento || it.tipo || '',
          numero_documento: it.numeroDocumento || it.numero_documento || it.documento || '',
          numero_ficha: it.ficha || it.numeroFicha || it.numero_ficha || ''
        }));
        const rec = normalized.find(x => String(x.id) === String(id) || String(x.numero_documento) === String(id));
        if (!rec) { alert('Registro no encontrado.'); return; }
        openEditModal(rec);
      } catch (err) {
        console.error('Cargar para editar falló', err);
        alert('No se pudo cargar el registro para editar.');
      }
    }
  });

  // Edit modal submit
  if (modalForm) {
    modalForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const id = (document.getElementById('modal_ap_id').value || '').trim();
      const nombre = (document.getElementById('modal_ap_nombre').value || '').trim();
      const tipo = (document.getElementById('modal_ap_tipo').value || '').trim();
      const numero = (document.getElementById('modal_ap_num').value || '').trim();
      const ficha = (document.getElementById('modal_ap_ficha').value || '').trim();
      if (!id || !nombre || !tipo || !numero) { alert('Completa Nombre, Tipo y Número.'); return; }

      const payload = {
        nombres: nombre,
        nombre: nombre,
        tipoDocumento: tipo,
        tipo_documento: tipo,
        numeroDocumento: numero,
        numero_documento: numero,
        ficha: ficha,
        numero_ficha: ficha
      };

      try {
        if (!isRemoteId(id) || String(id).startsWith('lap-')) {
          const list = localLoad();
          const idx = list.findIndex(x => String(x.id) === String(id));
          if (idx >= 0) {
            list[idx] = Object.assign({}, list[idx], payload);
            localSave(list);
          }
        } else {
          if (API && typeof API.actualizarAprendiz === 'function') {
            await API.actualizarAprendiz(id, payload);
          } else {
            const list = localLoad();
            const idx = list.findIndex(x => String(x.id) === String(id) || String(x.numeroDocumento) === String(id));
            if (idx >= 0) {
              list[idx] = Object.assign({}, list[idx], payload);
              localSave(list);
            }
          }
        }
        closeEditModal();
        await renderTable();
        alert('Aprendiz actualizado correctamente.');
      } catch (err) {
        console.error('Actualizar fallo:', err);
        alert('Error actualizando aprendiz: ' + ((err && err.message) ? err.message : 'error'));
      }
    });
  }

  // Export CSV
  btnExport.addEventListener('click', async () => {
    const list = await (API && typeof API.obtenerAprendices === 'function' ? API.obtenerAprendices() : localLoad());
    if (!list || list.length === 0) { alert('No hay registros para exportar.'); return; }
    const rows = [];
    rows.push(['nombre','tipo_documento','numero_documento','numero_ficha'].join(','));
    (list || []).forEach(r => {
      const nombre = r.nombres || r.nombre || '';
      const tipo = r.tipoDocumento || r.tipo_documento || '';
      const num = r.numeroDocumento || r.numero_documento || '';
      const ficha = r.ficha || r.numeroFicha || r.numero_ficha || '';
      rows.push([nombre,tipo,num,ficha].map(v => `"${String(v||'').replace(/"/g,'""')}"`).join(','));
    });
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'aprendices.csv'; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  });

  // Filters
  btnFilter.addEventListener('click', () => {
    const field = selectFilterField.value;
    const value = inputFilterValue.value || '';
    renderTable({ field, value });
  });
  btnClearFilter.addEventListener('click', () => { selectFilterField.value = 'numero_documento'; inputFilterValue.value = ''; renderTable(); });

  // Other wiring
  closeNuevo.addEventListener('click', closeNuevoModal);
  if (modalClose) modalClose.addEventListener('click', closeEditModal);
  if (modalCancel) modalCancel.addEventListener('click', closeEditModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', (ev) => { if (ev.target === modalBackdrop) closeEditModal(); });

  // Initial render
  renderTable();
});