// URL del backend Spring Boot (ajusta si llamas desde puerto diferente)
const API_BASE = 'http://localhost:3000/aprendices';

// Helpers
function escapeHtml(s) { if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

const tablaBody = document.querySelector('#tablaAprendices tbody');
const btnExport = document.getElementById('btnExport');
const btnOpenNuevo = document.getElementById('btnOpenNuevo');
const btnFilter = document.getElementById('btnFilter');
const btnClearFilter = document.getElementById('btnClearFilter');
const selectFilterField = document.getElementById('filter_field');
const inputFilterValue = document.getElementById('filter_value');

// Modal elementos (nuevo aprendiz)
const modalNuevo = document.getElementById('modalNuevoAprendiz');
const formNuevo = document.getElementById('formNuevoAprendiz');
const closeNuevo = document.getElementById('closeNuevoApr');

// Modal elementos (editar)
const modalBackdrop = document.getElementById('modalAprendiz');
const modalForm = document.getElementById('formModalAprendiz');
const modalClose = document.getElementById('closeModalApr');
const modalCancel = document.getElementById('cancelModalApr');

// -------- API Calls --------

// Listar aprendices
async function fetchAprendices() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Error al obtener aprendices');
  return await res.json();
}

// Crear uno nuevo
async function crearAprendiz(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  // Devuelve body JSON aún si hay error con status 400
  let body;
  try { body = await res.json(); } catch(_) { body = await res.text(); }
  if (!res.ok) throw new Error(body && body.message ? body.message : body);
  return body;
}

// Buscar por documento
async function buscarPorDocumento(tipo, numero) {
  // /aprendices/buscar?tipoDocumento=XX&numeroDocumento=YY
  const res = await fetch(`${API_BASE}/buscar?tipoDocumento=${encodeURIComponent(tipo)}&numeroDocumento=${encodeURIComponent(numero)}`);
  let body;
  try { body = await res.json(); } catch(_) { body = await res.text(); }
  if (!res.ok) throw new Error(body && body.message ? body.message : body);
  return body;
}

// Buscar por ficha
async function buscarPorFicha(numeroFicha) {
  // /aprendices/buscarPorFicha?numeroFicha=...
  const res = await fetch(`${API_BASE}/buscarPorFicha?numeroFicha=${encodeURIComponent(numeroFicha)}`);
  let body;
  try { body = await res.json(); } catch(_) { body = await res.text(); }
  if (!res.ok) throw new Error(body && body.message ? body.message : body);
  return body;
}

// Actualizar
async function actualizarAprendiz(id, datos) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(datos)
  });
  let body;
  try { body = await res.json(); } catch(_) { body = await res.text(); }
  if (!res.ok) throw new Error(body && body.message ? body.message : body);
  return body;
}

// Eliminar
async function eliminarAprendiz(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    let msg = "No se pudo eliminar";
    try { msg = await res.text(); } catch (_) {}
    throw new Error(msg);
  }
  return true;
}

// -------- Render y lógica UI --------

async function renderTable(filter = {}) {
  let aprendices = [];
  try {
    aprendices = await fetchAprendices();
  } catch(e) {
    tablaBody.innerHTML = `<tr><td colspan="5" style="padding:14px;color:var(--muted);">Error cargando aprendices: ${e.message}</td></tr>`;
    return;
  }

  let filtered = aprendices;
  if (filter.field && filter.value && filter.value.trim() !== '') {
    // Si es nro documento o ficha, filtro según corresponda
    if (filter.field === 'numero_documento') {
      filtered = aprendices.filter(a => String(a.numeroDocumento||'').toLowerCase().includes(filter.value.toLowerCase()));
    } else if (filter.field === 'numero_ficha') {
      filtered = aprendices.filter(a => String(a.numeroFicha||'').toLowerCase().includes(filter.value.toLowerCase()));
    }
  }

  tablaBody.innerHTML = '';
  if (!Array.isArray(filtered) || filtered.length === 0) {
    const tr = document.createElement('tr');
    if (filter && filter.field && filter.value && filter.value.trim() !== '') {
      const fieldLabel = (filter.field === 'numero_documento') ? 'número de documento' :
                         (filter.field === 'numero_ficha') ? 'número de ficha' : filter.field;
      tr.innerHTML = `<td colspan="5" style="padding:14px;color:var(--muted);">No se encontró ningún aprendiz con ${fieldLabel} «${escapeHtml(filter.value)}».</td>`;
    } else {
      tr.innerHTML = '<td colspan="5" style="padding:14px;color:var(--muted);">No hay aprendices registrados.</td>';
    }
    tablaBody.appendChild(tr);
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(item.nombre)}</td>
      <td>${escapeHtml(item.tipoDocumento)}</td>
      <td>${escapeHtml(item.numeroDocumento)}</td>
      <td>${escapeHtml(item.numeroFicha)}</td>
      <td class="actions">
        <button class="btn-edit" data-id="${item.idAprendiz}">Editar</button>
        <button class="btn-delete" data-id="${item.idAprendiz}">Eliminar</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });
}

// ------------ Modales -------------

function openNuevoModal() {
  modalNuevo.classList.add('open');
  modalNuevo.setAttribute('aria-hidden', 'false');
  document.getElementById('nuevo_ap_nombre').focus();
}
function closeNuevoModal() {
  modalNuevo.classList.remove('open');
  modalNuevo.setAttribute('aria-hidden', 'true');
  formNuevo.reset();
}

btnOpenNuevo.addEventListener('click', openNuevoModal);
closeNuevo.addEventListener('click', closeNuevoModal);
modalNuevo.addEventListener('click', function (ev) { if (ev.target === modalNuevo) closeNuevoModal(); });
document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { closeNuevoModal(); closeEditModal(); } });

// ---- Nuevo aprendiz (form) -----
formNuevo.addEventListener('submit', async function (ev) {
  ev.preventDefault();
  const nombre = document.getElementById('nuevo_ap_nombre').value.trim();
  const tipo = document.getElementById('nuevo_ap_tipo').value;
  const numero = document.getElementById('nuevo_ap_num').value.trim();
  const ficha = document.getElementById('nuevo_ap_ficha').value.trim();
  if (!nombre || !tipo || !numero || !ficha) {
    alert('Completa todos los campos.');
    return;
  }
  try {
    await crearAprendiz({
      nombre,
      tipoDocumento: tipo,
      numeroDocumento: numero,
      numeroFicha: ficha
    });
    closeNuevoModal();
    renderTable();
    alert('Aprendiz guardado.');
  } catch (e) {
    alert('Error: ' + e.message);
  }
});

// Delegar acciones tabla
tablaBody.addEventListener('click', async function (ev) {
  const btn = ev.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.classList.contains('btn-delete')) {
    if (!confirm('Eliminar aprendiz?')) return;
    try {
      await eliminarAprendiz(id);
      renderTable();
      alert('El aprendiz ha sido eliminado.');
    } catch (e) {
      alert('Error: ' + e.message);
    }
    return;
  }
  if (btn.classList.contains('btn-edit')) {
    openEditModal(id);
    return;
  }
});

// Exportar CSV
btnExport.addEventListener('click', async function () {
  let list;
  try {
    list = await fetchAprendices();
  } catch (e) {
    alert('Error al cargar aprendices: ' + e.message);
    return;
  }
  if (!list || list.length === 0) { alert('No hay registros para exportar.'); return; }
  const headers = ['nombre','tipoDocumento','numeroDocumento','numeroFicha'];
  const rows = [headers.join(',')].concat(list.map(r => headers.map(h => `"${(r[h] || '').toString().replace(/"/g,'""')}"`).join(',')));
  const csv = rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'aprendices.csv'; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
});

// ---- Filtros
btnFilter.addEventListener('click', function () {
  const field = selectFilterField.value;
  const value = inputFilterValue.value || '';
  renderTable({ field, value });
});
btnClearFilter.addEventListener('click', function () {
  selectFilterField.value = 'numero_documento';
  inputFilterValue.value = '';
  renderTable();
});

// -------- Editar - modal ---------
function openEditModal(id) {
  fetchAprendices().then(list => {
    const item = list.find(x => (x.idAprendiz && x.idAprendiz.toString()) === id.toString());
    if (!item) { alert('Registro no encontrado.'); return; }
    document.getElementById('modal_ap_id').value = item.idAprendiz;
    document.getElementById('modal_ap_nombre').value = item.nombre;
    document.getElementById('modal_ap_tipo').value = item.tipoDocumento;
    document.getElementById('modal_ap_num').value = item.numeroDocumento;
    document.getElementById('modal_ap_ficha').value = item.numeroFicha;

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.getElementById('modal_ap_nombre').focus();
  });
}

function closeEditModal() {
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  if (modalForm) modalForm.reset();
}
if (modalClose) modalClose.addEventListener('click', closeEditModal);
if (modalCancel) modalCancel.addEventListener('click', closeEditModal);
modalBackdrop.addEventListener('click', function (ev) { if (ev.target === modalBackdrop) closeEditModal(); });

// Guardar edición
if (modalForm) {
  modalForm.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    const id = document.getElementById('modal_ap_id').value;
    const nombre = document.getElementById('modal_ap_nombre').value.trim();
    const tipo = document.getElementById('modal_ap_tipo').value;
    const numero = document.getElementById('modal_ap_num').value.trim();
    const ficha = document.getElementById('modal_ap_ficha').value.trim();
    if (!id || !nombre || !tipo || !numero || !ficha) {
      alert('Completa todos los campos.');
      return;
    }
    try {
      await actualizarAprendiz(id, {
        nombre,
        tipoDocumento: tipo,
        numeroDocumento: numero,
        numeroFicha: ficha
      });
      closeEditModal();
      renderTable();
      alert('Cambios guardados.');
    } catch (e) {
      alert('Error al guardar: '+ e.message);
    }
  });
}

// -------- Inicialización
renderTable();