(function (global) {
  'use strict';

  const API_BASE = 'http://localhost:3000';
  const HERR_URL = API_BASE + '/herramienta';
  const DETALLE_URL_BASE = API_BASE + '/api/herramienta-detalle';
  const PRESTAMOS_URL = API_BASE + '/prestamo';
  const USUARIO_URL = API_BASE + '/usuario';
  const TIMEOUT_MS = 8000;

  const LS_KEYS = {
    TOOLS: 'fs_local_tools_v1',
    APRENDICES: 'fs_aprendices_v1',
    HISTORIAL: 'fs_historial_v1'
  };

  function timeoutPromise(p, ms) {
    return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
  }

  async function safeFetch(url, opts) {
    try {
      const res = await timeoutPromise(fetch(url, opts), TIMEOUT_MS);
      return res;
    } catch (e) {
      throw e;
    }
  }

  function parseJSONSafe(res) {
    return res.text().then(text => {
      try { return text ? JSON.parse(text) : null; }
      catch (e) { return text; }
    });
  }

  function nowIsoDate() { return new Date().toISOString().split('T')[0]; }

  function loadLocal(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Error parseando localStorage', key, e);
      return [];
    }
  }

  function saveLocal(key, list) {
    try { localStorage.setItem(key, JSON.stringify(list || [])); }
    catch (e) { console.warn('Error guardando localStorage', key, e); }
  }

  function normalizeBackendTool(h) {
    if (!h) return null;
    return {
      idHerramienta: h.idHerramienta || h.id || h.id_herramienta || null,
      nombre: h.nombre || '',
      descripcion: h.descripcion || '',
      estado: h.estado || '',
      tipo: h.tipo || '',
      ubicacion: h.ubicacion || '',
      numero_lote: h.numero_lote || h.numeroLote || h.lote || '',
      cantidad: (h.cantidad != null) ? h.cantidad : 0,
      fecha_registro: h.fecha_registro || h.fechaRegistro || h.fecha || '',
      codigoInforme: h.codigoInforme || h.codigo_informe || ''
    };
  }

  function normalizeLocalTool(t) {
    if (!t) return null;
    return {
      idHerramienta: t.idHerramienta || t.id || ('local-' + Date.now() + '-' + Math.floor(Math.random() * 1000)),
      nombre: t.nombre || '',
      descripcion: t.descripcion || '',
      estado: t.estado || '',
      tipo: t.tipo || '',
      ubicacion: t.ubicacion || '',
      numero_lote: t.numero_lote || t.numeroLote || t.lote || '',
      cantidad: (t.cantidad != null) ? t.cantidad : 0,
      fecha_registro: t.fecha_registro || t.fecha || nowIsoDate(),
      _local: true,
      detalles: t.detalles || []
    };
  }

  function genDetalleCodes(tool) {
    const detalles = [];
    const cantidad = tool.cantidad || 0;
    for (let i = 1; i <= cantidad; i++) {
      const idDetalle = 'ld-' + Date.now() + '-' + i + '-' + Math.floor(Math.random() * 1000);
      const codigoUnico = (tool.nombre || 'LOCAL').toUpperCase().replace(/\s+/g, '_') + '-' + (tool.idHerramienta) + '-' + String(i).padStart(3, '0');
      detalles.push({
        idDetalle: idDetalle,
        codigoUnico: codigoUnico,
        estado: 'Disponible',
        disponible: true,
        fechaIngreso: tool.fecha_registro || nowIsoDate(),
        herramienta: {
          idHerramienta: tool.idHerramienta,
          nombre: tool.nombre
        }
      });
    }
    return detalles;
  }

  const FSApiClient = {

    LS_KEYS,

    isBackendAvailable: async function () {
      try {
        const res = await timeoutPromise(fetch(HERR_URL + '/hoy', { method: 'GET' }), 800);
        return !!res && res.ok;
      } catch (e) { return false; }
    },

    obtenerHerramientasHoy: async function () {
      try {
        const res = await safeFetch(HERR_URL + '/hoy', { method: 'GET' });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        const arr = await res.json();
        return (arr || []).map(normalizeBackendTool);
      } catch (err) {
        const local = loadLocal(LS_KEYS.TOOLS).map(normalizeLocalTool);
        return local;
      }
    },

    obtenerTodasHerramientas: async function () {
      try {
        const res = await safeFetch(HERR_URL, { method: 'GET' });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        const arr = await res.json();
        return (arr || []).map(normalizeBackendTool);
      } catch (err) {
        return loadLocal(LS_KEYS.TOOLS).map(normalizeLocalTool);
      }
    },

    crearHerramienta: async function (payload) {
      try {
        const res = await safeFetch(HERR_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok && res.status !== 201) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        const created = await parseJSONSafe(res);
        return normalizeBackendTool(created || payload);
      } catch (err) {
        const local = normalizeLocalTool(payload);
        local.idHerramienta = local.idHerramienta || ('local-' + Date.now());
        if (!local.detalles || local.detalles.length === 0) local.detalles = genDetalleCodes(local);
        const list = loadLocal(LS_KEYS.TOOLS);
        list.unshift(local);
        saveLocal(LS_KEYS.TOOLS, list);
        local._local = true;
        return local;
      }
    },

    actualizarHerramienta: async function (id, payload) {
      try {
        const res = await safeFetch(HERR_URL + '/' + encodeURIComponent(id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          const errorMsg = (txt && (txt.message || txt.error)) || ('HTTP ' + res.status);
          throw new Error(errorMsg);
        }
        const updated = await parseJSONSafe(res);
        return normalizeBackendTool(updated || Object.assign({}, payload, { idHerramienta: id }));
      } catch (err) {
        // Re-lanzar el error para que el caller lo maneje
        throw err;
      }
    },

    eliminarHerramienta: async function (id) {
      try {
        if (String(id).startsWith('local-')) {
          let list = loadLocal(LS_KEYS.TOOLS);
          list = list.filter(t => String(t.idHerramienta) !== String(id));
          saveLocal(LS_KEYS.TOOLS, list);
          return true;
        }
        const res = await safeFetch(HERR_URL + '/' + encodeURIComponent(id), { method: 'DELETE' });
        if (!res.ok && res.status !== 204) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        let list = loadLocal(LS_KEYS.TOOLS);
        list = list.filter(t => String(t.idHerramienta) !== String(id));
        saveLocal(LS_KEYS.TOOLS, list);
        return true;
      } catch (err) {
        let list = loadLocal(LS_KEYS.TOOLS);
        const newList = list.filter(t => String(t.idHerramienta) !== String(id));
        saveLocal(LS_KEYS.TOOLS, newList);
        return false;
      }
    },

    obtenerDetalles: async function (herramientaId) {
      try {
        const res = await safeFetch(DETALLE_URL_BASE + '/herramienta/' + encodeURIComponent(herramientaId), { method: 'GET' });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        const arr = await res.json();
        return (arr || []);
      } catch (err) {
        const tools = loadLocal(LS_KEYS.TOOLS);
        const found = tools.find(t => String(t.idHerramienta) === String(herramientaId));
        return (found && found.detalles) ? found.detalles : [];
      }
    },

    actualizarDetalle: async function (idDetalle, payload, herramientaId) {
      try {
        const res = await safeFetch(DETALLE_URL_BASE + '/' + encodeURIComponent(idDetalle), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        const updated = await parseJSONSafe(res);
        return updated || payload;
      } catch (err) {
        throw err;
      }
    },

    eliminarDetalle: async function (idDetalle) {
      try {
        const res = await safeFetch(DETALLE_URL_BASE + '/' + encodeURIComponent(idDetalle), {
          method: 'DELETE'
        });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        return true;
      } catch (err) {
        throw err;
      }
    },

    crearPrestamo: async function (codigoUnico, idUsuario, numeroDocumento, prestamoPayload) {
      try {
        const url = PRESTAMOS_URL + '/crear?codigoUnico=' + encodeURIComponent(codigoUnico) + '&idUsuario=' + encodeURIComponent(idUsuario) + '&numeroDocumento=' + encodeURIComponent(numeroDocumento);
        const res = await safeFetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prestamoPayload || {})
        });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        const created = await parseJSONSafe(res);
        return created;
      } catch (err) {
        throw err;
      }
    },

    obtenerPrestamosActivos: async function () {
      try {
        const res = await safeFetch(PRESTAMOS_URL + '/activos', { method: 'GET' });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        return await res.json();
      } catch (err) {
        return [];
      }
    },

    crearUsuario: async function (payload) {
      try {
        const res = await safeFetch(USUARIO_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const text = await res.text().catch(() => '');
        let body = null;
        try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }

        if (res.status === 201 || res.ok) {
          return body || {};
        }

        if (res.status === 400 && body) {
          const err = new Error(body.message || 'Validation error');
          err.fieldErrors = body.fieldErrors || null;
          err.raw = body;
          throw err;
        }

        throw new Error((body && (body.message || body.error)) || ('HTTP ' + res.status));
      } catch (err) {
        throw err;
      }
    },

    obtenerUsuarioPorId: async function (id) {
      try {
        const res = await safeFetch(`${USUARIO_URL}/${id}`, { method: 'GET' });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        return await res.json();
      } catch (err) {
        throw err;
      }
    },

    actualizarUsuario: async function (id, payload) {
      try {
        const res = await safeFetch(`${USUARIO_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        return await res.json();
      } catch (err) {
        throw err;
      }
    },

    login: async function (payload) {
      try {
        const res = await safeFetch(USUARIO_URL + '/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const txt = await parseJSONSafe(res);
          throw new Error((txt && (txt.message || txt.error)) || ('HTTP ' + res.status));
        }
        const body = await parseJSONSafe(res);
        return body;
      } catch (err) {
        throw err;
      }
    },

    loadAprendicesLocal: function () { return loadLocal(LS_KEYS.APRENDICES); },
    saveAprendicesLocal: function (list) { return saveLocal(LS_KEYS.APRENDICES, list); },
    loadHistorialLocal: function () { return loadLocal(LS_KEYS.HISTORIAL); },
    saveHistorialLocal: function (list) { return saveLocal(LS_KEYS.HISTORIAL, list); },

    loadLocalTools: function () { return loadLocal(LS_KEYS.TOOLS); },
    saveLocalTools: function (list) { return saveLocal(LS_KEYS.TOOLS, list); },

    pushLocalTool: function (tool) {
      const list = loadLocal(LS_KEYS.TOOLS);
      list.unshift(tool);
      saveLocal(LS_KEYS.TOOLS, list);
    },
    updateLocalToolById: function (id, updater) {
      const list = loadLocal(LS_KEYS.TOOLS);
      const idx = list.findIndex(t => String(t.idHerramienta) === String(id));
      if (idx === -1) return false;
      list[idx] = updater(list[idx]);
      saveLocal(LS_KEYS.TOOLS, list);
      return true;
    },
    removeLocalToolById: function (id) {
      const list = loadLocal(LS_KEYS.TOOLS);
      const newList = list.filter(t => String(t.idHerramienta) !== String(id));
      saveLocal(LS_KEYS.TOOLS, newList);
      return list.length !== newList.length;
    },
    findLocalToolById: function (id) {
      const list = loadLocal(LS_KEYS.TOOLS);
      return (list.find(t => String(t.idHerramienta) === String(id)) || null);
    },

    syncLocalToBackend: async function (onProgress) {
      const local = loadLocal(LS_KEYS.TOOLS);
      if (!local || local.length === 0) {
        if (typeof onProgress === 'function') onProgress({ total: 0, done: 0 });
        return { synced: 0, total: 0 };
      }
      let total = local.length;
      let done = 0;
      for (let i = 0; i < local.length; i++) {
        const item = local[i];
        try {
          if (!item._local && !(String(item.idHerramienta).startsWith('local-'))) {
            done++;
            if (typeof onProgress === 'function') onProgress({ total, done });
            continue;
          }
          const payload = {
            nombre: item.nombre,
            descripcion: item.descripcion,
            estado: item.estado,
            tipo: item.tipo,
            ubicacion: item.ubicacion,
            numero_lote: item.numero_lote,
            cantidad: item.cantidad,
            fecha_registro: item.fecha_registro
          };
          const res = await safeFetch(HERR_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            FSApiClient.removeLocalToolById(item.idHerramienta);
            done++;
          } else {
            done++;
          }
        } catch (e) {
          done++;
        }
        if (typeof onProgress === 'function') onProgress({ total, done });
      }
      return { synced: done, total: total };
    }

  }; // end FSApiClient object

  global.FSApiClient = FSApiClient;

})(window);

// Archivo: JS/FSApiClient.aprendices.js
