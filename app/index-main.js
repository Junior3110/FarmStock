/**
 * index-main.js
 * Centraliza la lógica que antes estaba inline en index.html.
 * Usa FSApiClient para todas las llamadas al backend con fallback local.
 *
 * Reemplaza el inline script en index.html.
 */
(function () {
  const LS_KEY = 'fs_local_tools_v1';
  const API = window.FSApiClient;
  const form = document.getElementById('formHerramienta');
  const listaHoy = document.getElementById('listaHoy');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  const modalTitle = document.getElementById('modalTitle');
  const closeModalBtn = document.getElementById('closeModal');
  const fechaInput = document.getElementById('fecha_registro');
  const errorMsg = document.getElementById('errorMsg');

  function showError(msg) {
    if (!errorMsg) return;
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  }
  function hideError() {
    if (!errorMsg) return;
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function nowIsoDate() { return new Date().toISOString().split('T')[0]; }

  // Render list
  function renderToolsListFromArray(herramientas) {
    listaHoy.innerHTML = '';
    if (!Array.isArray(herramientas) || herramientas.length === 0) {
      listaHoy.innerHTML = '<p>No hay registros para hoy.</p>';
      return;
    }

    herramientas.forEach(function (h) {
      var id = h.idHerramienta || h.id || '';
      var nombre = h.nombre || 'Sin nombre';
      var estado = h.estado || '—';
      var tipo = h.tipo || '—';
      var ubicacion = h.ubicacion || '—';
      var fecha = h.fecha_registro || h.fechaRegistro || h.fecha || '—';
      var lote = h.numero_lote || h.numeroLote || h.lote || '—';
      var cantidad = (h.cantidad != null) ? h.cantidad : 0;
      var descripcion = h.descripcion || 'Sin descripción';

      var card = document.createElement('div');
      card.className = 'tarjeta';

      var inner = '<h4>🛠 ' + escapeHtml(nombre) + '</h4>' +
        '<p><strong>Estado:</strong> ' + escapeHtml(estado) + '</p>' +
        '<p><strong>Tipo:</strong> ' + escapeHtml(tipo) + '</p>' +
        '<p><strong>Ubicación:</strong> ' + escapeHtml(ubicacion) + '</p>' +
        '<p><strong>Fecha registro:</strong> ' + escapeHtml(String(fecha)) + '</p>' +
        '<p><strong>Lote:</strong> ' + escapeHtml(lote) + '</p>' +
        '<p><strong>Cantidad:</strong> ' + escapeHtml(String(cantidad)) + '</p>' +
        '<p><strong>Descripción:</strong> ' + escapeHtml(descripcion) + '</p>';

      card.innerHTML = inner;

      var acciones = document.createElement('div');
      acciones.className = 'acciones';

      var btnEdit = document.createElement('button');
      btnEdit.type = 'button';
      btnEdit.className = 'btn-small';
      btnEdit.textContent = 'Editar';
      btnEdit.addEventListener('click', function () {
        openEditLoteModal(id);
      });

      var btnDetails = document.createElement('button');
      btnDetails.type = 'button';
      btnDetails.className = 'btn-small';
      btnDetails.style.background = '#1976d2';
      btnDetails.textContent = 'Ver detalles';
      btnDetails.addEventListener('click', function () {
        openDetallesModal(id, nombre);
      });

      var btnDelete = document.createElement('button');
      btnDelete.type = 'button';
      btnDelete.className = 'btn-small delete';
      btnDelete.textContent = 'Eliminar';
      btnDelete.addEventListener('click', function () {
        eliminarLote(id);
      });

      acciones.appendChild(btnEdit);
      acciones.appendChild(btnDetails);
      acciones.appendChild(btnDelete);

      card.appendChild(acciones);
      if (h._local) {
        var badge = document.createElement('div');
        badge.style.fontSize = '12px';
        badge.style.color = '#555';
        badge.style.marginTop = '6px';
        badge.textContent = 'Guardado localmente (offline)';
        card.appendChild(badge);
      }

      listaHoy.appendChild(card);
    });
  }

  async function obtenerHerramientasHoy() {
    hideError();
    listaHoy.innerHTML = '<p>Cargando...</p>';
    try {
      const herramientas = await API.obtenerHerramientasHoy();
      // Merge with local ones (so offline entries show)
      const local = API.loadLocalTools().filter(t => {
        try { return (t.fecha_registro === nowIsoDate()); } catch (e) { return false; }
      }).map(t => { t._local = true; return t; });

      const ids = new Set(local.map(x => String(x.idHerramienta)));
      const merged = local.concat((herramientas || []).filter(h => !ids.has(String(h.idHerramienta))));
      renderToolsListFromArray(merged);
    } catch (err) {
      console.warn('Error obteniendo hoy (fallback):', err);
      const localAll = API.loadLocalTools().map(t => { t._local = true; return t; });
      renderToolsListFromArray(localAll);
      showError('Backend no disponible. Trabajando en modo local/offline.');
    }
  }

  // form submit
  if (form) {
    form.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      hideError();
      const fd = new FormData(form);
      const data = {};
      fd.forEach(function (v, k) { data[k] = v; });

      if (!data.fecha_registro) data.fecha_registro = nowIsoDate();
      data.cantidad = parseInt(data.cantidad, 10) || 0;

      if (!data.nombre || !data.estado) {
        alert('Por favor completa al menos el nombre y el estado.');
        return;
      }

      try {
        const created = await API.crearHerramienta(data);
        // If local created, it's returned with _local flag
        obtenerHerramientasHoy();
        alert(created._local ? 'Guardado localmente. Backend no disponible.' : '✅ Herramienta registrada en servidor');
        form.reset();
        if (fechaInput) fechaInput.value = nowIsoDate();
      } catch (err) {
        console.error('Error creando herramienta:', err);
        alert('Error al crear herramienta: ' + (err && err.message ? err.message : 'error'));
      }
    });
  }

  // delete
  async function eliminarLote(id) {
    if (!id) { alert('ID inválido'); return; }
    if (!confirm('¿Eliminar registro id ' + id + '?')) return;
    try {
      const success = await API.eliminarHerramienta(id);
      if (success) {
        obtenerHerramientasHoy();
        alert('Registro eliminado');
      } else {
        obtenerHerramientasHoy();
        alert('Eliminado localmente (o fallo remoto).');
      }
    } catch (err) {
      console.warn('DELETE error', err);
      alert('No se pudo eliminar: ' + (err && err.message ? err.message : 'error'));
    }
  }

  // Edit modal reimplemented using API
  function openEditLoteModal(id) {
    if (!id) return;
    hideError();
    modalTitle.textContent = 'Editar registro';
    modalContent.innerHTML = '<p>Cargando...</p>';
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');

    (async function () {
      let found;
      let isLocal = false;
      try {
        // If id local
        if (String(id).startsWith('local-')) {
          found = API.findLocalToolById(id);
          isLocal = true;
        } else {
          // try backend GET /herramienta/{id}
          try {
            const res = await safeFetchWrapper(API_BASE + '/herramienta/' + encodeURIComponent(id));
            found = res ? API.obtenerTodasHerramientas // placeholder to avoid lint error
            : null;
          } catch (e) {
            found = null;
          }
          // instead, try API.obtenerTodasHerramientas and find
          if (!found) {
            const all = await API.obtenerTodasHerramientas();
            found = all.find(h => String(h.idHerramienta) === String(id));
          }
        }
      } catch (e) {
        found = null;
      }

      if (!found) {
        // try local as last resort
        found = API.findLocalToolById(id);
        if (found) isLocal = true;
      }

      if (!found) {
        modalBackdrop.classList.remove('open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        alert('No se encontró el registro');
        return;
      }

      buildEditModalFromFound(found, isLocal);
    })();

    // helper to build the modal and wire saving for both local and remote edits
    function buildEditModalFromFound(found, isLocal) {
      modalContent.innerHTML = '';
      var container = document.createElement('div');

      var html = '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
        '<div style="flex:1;min-width:240px;"><label>Nombre</label><input id="edit_nombre" type="text" value="' + escapeHtml(found.nombre || '') + '" /></div>' +
        '<div style="flex:1;min-width:180px;"><label>Estado</label><select id="edit_estado"><option value="">Seleccionar</option><option value="Disponible">Disponible</option><option value="Mantenimiento">Mantenimiento</option><option value="No_disponible">No disponible</option></select></div>' +
        '<div style="flex:1;min-width:180px;"><label>Tipo</label><select id="edit_tipo"><option value="">Seleccionar</option><option value="Manual">Manual</option><option value="Electrica">Eléctrica</option></select></div>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">' +
        '<div style="flex:1;min-width:180px;"><label>Ubicación</label><select id="edit_ubicacion"><option value="">Seleccionar</option><option value="Bodega">Bodega</option><option value="Taller">Taller</option></select></div>' +
        '<div style="flex:1;min-width:180px;"><label>Fecha registro</label><input id="edit_fecha" type="date" value="' + escapeHtml(String(found.fecha_registro || found.fecha || '')) + '" /></div>' +
        '<div style="flex:1;min-width:180px;"><label>Número lote</label><select id="edit_lote"><option value="">Seleccionar</option><option value="Lote 1">Lote 1</option><option value="Lote 2">Lote 2</option></select></div>' +
        '</div>' +
        '<div style="margin-top:10px;"><label>Cantidad</label><input id="edit_cantidad" type="number" min="0" value="' + escapeHtml(String(found.cantidad || 0)) + '" /></div>' +
        '<div style="margin-top:10px;"><label>Descripción</label><textarea id="edit_descripcion" style="width:100%;">' + escapeHtml(found.descripcion || '') + '</textarea></div>' +
        '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;"><button id="saveEdit" class="btn-small" type="button">Guardar</button><button id="cancelEdit" class="btn-small delete" type="button">Cancelar</button></div>';

      container.innerHTML = html;
      modalContent.appendChild(container);

      try { document.getElementById('edit_estado').value = found.estado || ''; } catch (e) { }
      try { document.getElementById('edit_tipo').value = found.tipo || ''; } catch (e) { }
      try { document.getElementById('edit_ubicacion').value = found.ubicacion || ''; } catch (e) { }
      try { document.getElementById('edit_lote').value = found.numero_lote || found.numeroLote || ''; } catch (e) { }

      document.getElementById('cancelEdit').addEventListener('click', function () {
        closeModal();
      });

      document.getElementById('saveEdit').addEventListener('click', async function () {
        var payload = {
          nombre: (document.getElementById('edit_nombre').value || '').trim(),
          estado: (document.getElementById('edit_estado').value || '').trim(),
          tipo: (document.getElementById('edit_tipo').value || '').trim(),
          ubicacion: (document.getElementById('edit_ubicacion').value || '').trim(),
          fecha_registro: (document.getElementById('edit_fecha').value || ''),
          numero_lote: (document.getElementById('edit_lote').value || ''),
          cantidad: parseInt(document.getElementById('edit_cantidad').value || '0', 10) || 0,
          descripcion: (document.getElementById('edit_descripcion').value || '').trim()
        };

        if (!payload.nombre || !payload.estado) {
          alert('Completa al menos nombre y estado.');
          return;
        }

        if (isLocal || String(found.idHerramienta).startsWith('local-')) {
          // update local
          API.updateLocalToolById(found.idHerramienta, function (old) {
            var updated = Object.assign({}, old, payload);
            if ((old.cantidad || 0) !== (payload.cantidad || 0)) {
              updated.cantidad = payload.cantidad;
              updated.detalles = genDetalleCodes(updated);
            }
            updated._local = true;
            return updated;
          });
          alert('✅ Registro actualizado (local)');
          closeModal();
          obtenerHerramientasHoy();
          return;
        }

        // Remote update via API
        try {
          const updated = await API.actualizarHerramienta(found.idHerramienta, payload);
          alert('✅ Registro actualizado');
          closeModal();
          obtenerHerramientasHoy();
        } catch (err) {
          console.warn('PUT failed, saving locally', err);
          // fallback: create local copy
          const localId = 'local-' + Date.now();
          const localTool = Object.assign({}, payload, { idHerramienta: localId, _local: true });
          localTool.detalles = genDetalleCodes(localTool);
          API.pushLocalTool(localTool);
          alert('No se pudo actualizar en servidor. Se guardó una copia local para sincronizar más tarde.');
          closeModal();
          obtenerHerramientasHoy();
        }
      });
    }
  }

  // details modal
  async function openDetallesModal(herramientaId, nombreLote) {
    if (!herramientaId) return;
    hideError();
    modalTitle.textContent = 'Detalles: ' + (nombreLote || '');
    modalContent.innerHTML = '<p>Cargando detalles...</p>';
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');

    try {
      const detalles = await API.obtenerDetalles(herramientaId);
      renderDetallesList(detalles || [], herramientaId);
    } catch (err) {
      console.warn('DETALLE failed', err);
      const local = API.findLocalToolById(herramientaId);
      if (local) {
        renderDetallesList(local.detalles || [], herramientaId);
      } else {
        modalBackdrop.classList.remove('open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        showError('No se pudieron cargar los detalles: ' + (err && err.message ? err.message : 'error'));
      }
    }

    function renderDetallesList(detalles, herramientaId) {
      modalContent.innerHTML = '';
      if (!Array.isArray(detalles) || detalles.length === 0) {
        modalContent.innerHTML = '<p>No hay detalles.</p>';
        return;
      }
      var listDiv = document.createElement('div');
      listDiv.className = 'modal-list';
      detalles.forEach(function (d, idx) {
        var cont = document.createElement('div');
        cont.className = 'tarjeta';
        var left = document.createElement('div');
        left.style.flex = '1';
        var nombreUnit = (d.herramienta && d.herramienta.nombre) ? d.herramienta.nombre : ('Unidad ' + (idx + 1));
        var h4 = document.createElement('h4');
        h4.textContent = nombreUnit + ' — ' + (d.codigoUnico || '');
        var p1 = document.createElement('p');
        p1.innerHTML = '<strong>Estado:</strong> ' + escapeHtml(d.estado || '-');
        var p2 = document.createElement('p');
        p2.innerHTML = '<strong>Disponible:</strong> ' + (d.disponible ? 'Sí' : 'No') + ' • <strong>Fecha ingreso:</strong> ' + (d.fechaIngreso || '-');
        left.appendChild(h4);
        left.appendChild(p1);
        left.appendChild(p2);

        var right = document.createElement('div');
        right.className = 'actions';
        var btnEdit = document.createElement('button');
        btnEdit.type = 'button';
        btnEdit.className = 'btn-small';
        btnEdit.textContent = 'Editar unidad';
        btnEdit.addEventListener('click', function () {
          var panel = cont.querySelector('.edit-panel');
          if (!panel) {
            panel = buildDetalleEditPanel(d, herramientaId);
            cont.appendChild(panel);
            panel.style.display = 'block';
          } else panel.style.display = (panel.style.display === 'none' ? 'block' : 'none');
        });

        right.appendChild(btnEdit);
        cont.appendChild(left);
        cont.appendChild(right);
        listDiv.appendChild(cont);
      });
      modalContent.appendChild(listDiv);
    }
  }

  // Edit panel builder for detalle (uses API.actualizarDetalle or local fallback)
  function buildDetalleEditPanel(detalle, herramientaId) {
    var panel = document.createElement('div');
    panel.className = 'edit-panel';
    var html = '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      '<div style="min-width:160px;"><label>Estado</label><select class="up_estado"><option value="">Seleccionar</option><option value="Disponible">Disponible</option><option value="Mantenimiento">Mantenimiento</option><option value="No_disponible">No disponible</option></select></div>' +
      '<div style="min-width:160px;"><label>Disponible</label><select class="up_disponible"><option value="true">Sí</option><option value="false">No</option></select></div>' +
      '<div style="min-width:160px;"><label>Fecha ingreso</label><input class="up_fecha" type="date" /></div>' +
      '</div><div style="margin-top:8px;"><label>Descripción (opcional)</label><textarea class="up_descripcion" style="width:100%;"></textarea></div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;"><button class="up_save btn-small" type="button">Guardar</button><button class="up_cancel btn-small delete" type="button">Cancelar</button></div>';
    panel.innerHTML = html;

    try { panel.querySelector('.up_estado').value = detalle.estado || ''; } catch (e) { }
    try { panel.querySelector('.up_disponible').value = (detalle.disponible ? 'true' : 'false'); } catch (e) { }
    try { panel.querySelector('.up_fecha').value = detalle.fechaIngreso || ''; } catch (e) { }
    try { panel.querySelector('.up_descripcion').value = detalle.descripcion || ''; } catch (e) { }

    panel.querySelector('.up_cancel').addEventListener('click', function () {
      panel.style.display = 'none';
    });

    panel.querySelector('.up_save').addEventListener('click', async function () {
      var payload = {
        estado: panel.querySelector('.up_estado').value || detalle.estado,
        disponible: (panel.querySelector('.up_disponible').value === 'true'),
        fechaIngreso: panel.querySelector('.up_fecha').value || detalle.fechaIngreso,
        descripcion: panel.querySelector('.up_descripcion').value || detalle.descripcion
      };

      var idD = detalle.idDetalle || detalle.id_detalle || detalle.id;
      var isLocalDetalle = String(idD).startsWith('ld-') || String(idD).startsWith('local-') || String(idD).indexOf('ld-') >= 0;

      try {
        if (isLocalDetalle) {
          // update local
          const tool = API.findLocalToolById(detalle.herramienta && (detalle.herramienta.idHerramienta || detalle.herramienta.id));
          if (tool) {
            tool.detalles = (tool.detalles || []).map(function (dt) {
              if (String(dt.idDetalle) === String(idD)) {
                return Object.assign({}, dt, payload);
              }
              return dt;
            });
            API.updateLocalToolById(tool.idHerramienta, function () { return tool; });
            alert('Unidad actualizada (local)');
            openDetallesModal(tool.idHerramienta, tool.nombre);
            return;
          }
        }

        // remote update
        await API.actualizarDetalle(idD, payload, herramientaId);
        alert('✅ Unidad actualizada');
        // refresh details
        openDetallesModal(herramientaId, detalle.herramienta && detalle.herramienta.nombre);
      } catch (err) {
        console.warn('PUT detalle failed, saving locally fallback', err);
        // fallback: save detalle locally under its tool
        const toolId = detalle.herramienta && (detalle.herramienta.idHerramienta || detalle.herramienta.id) || ('local-' + Date.now());
        let tool = API.findLocalToolById(toolId);
        if (!tool) {
          tool = { idHerramienta: toolId, nombre: detalle.herramienta && detalle.herramienta.nombre || 'LocalTool', fecha_registro: nowIsoDate(), cantidad: 1, detalles: [] };
        }
        const idLocalDetalle = idD || ('ld-' + Date.now() + '-' + Math.floor(Math.random() * 1000));
        const newDetalle = Object.assign({}, { idDetalle: idLocalDetalle }, payload, { codigoUnico: detalle.codigoUnico || idLocalDetalle, herramienta: { idHerramienta: tool.idHerramienta, nombre: tool.nombre } });
        tool.detalles = (tool.detalles || []).filter(dt => String(dt.idDetalle) !== String(idLocalDetalle));
        tool.detalles.push(newDetalle);
        API.updateLocalToolById(tool.idHerramienta, function () { return tool; });
        alert('Unidad guardada localmente (offline)');
        openDetallesModal(tool.idHerramienta, tool.nombre);
      }
    });

    return panel;
  }

  // modal helpers
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', function (ev) { if (ev.target === modalBackdrop) closeModal(); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeModal(); });

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    if (modalBackdrop) modalBackdrop.setAttribute('aria-hidden', 'true');
    if (modalContent) modalContent.innerHTML = '';
  }

  // expose sync function via global FS for debug / button wiring
  window.FS = window.FS || {};
  window.FS.obtenerHoy = obtenerHerramientasHoy;
  window.FS.syncLocalToBackend = function (cb) {
    API.syncLocalToBackend(function (progress) {
      if (typeof cb === 'function') cb(progress);
    }).then(res => {
      alert('Sincronización finalizada.');
      obtenerHerramientasHoy();
    }).catch(e => {
      console.warn('syncLocalToBackend error', e);
      alert('Error sincronizando: ' + (e && e.message ? e.message : 'error'));
    });
  };

  // initialize date input and list
  try { if (fechaInput && !fechaInput.value) fechaInput.value = nowIsoDate(); } catch (e) { }
  obtenerHerramientasHoy();

  // small helper: safeFetch wrapper used inside the module (not exposed)
  function safeFetchWrapper(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) {
          const parsed = await res.text().catch(() => '');
          reject(parsed || ('HTTP ' + res.status));
          return;
        }
        const json = await res.json().catch(() => null);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    });
  }

})();