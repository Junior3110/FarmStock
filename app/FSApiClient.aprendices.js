(function () {
  'use strict';

  // Ajusta BACKEND_BASE si tu backend no está en localhost:8080
  const BACKEND_BASE = 'http://localhost:8080';
  const TIMEOUT_MS = 10000;
  const LS_KEY = 'fs_aprendices_v1';

  // candidatos de ruta (se prueban en orden)
  const PATH_CANDIDATES = [
    '/aprendiz',
    '/aprendices',
    '/api/aprendiz',
    '/api/aprendices',
    '/api/v1/aprendiz',
    '/api/v1/aprendices'
  ];

  // Forzar uso de backend (temporal para depuración). Pon a false para volver a detección automática.
  const FORCE_BACKEND = true;
  // backend expone /aprendices (plural) según tu controlador Spring
  let cachedPath = FORCE_BACKEND ? '/aprendices' : null;

  function timeoutFetch(url, opts, ms = TIMEOUT_MS) {
    return Promise.race([
      fetch(url, opts),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
    ]);
  }

  async function parseBodySafe(res) {
    const text = await res.text().catch(() => '');
    try { return text ? JSON.parse(text) : null; } catch (e) { return text; }
  }

  function loadLocal() {
    try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
  }
  function saveLocal(list) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list || [])); } catch (e) {}
  }

  // intenta detectar la ruta base que responde para aprendices; cachea el resultado
  async function detectPath() {
    if (cachedPath) return cachedPath;
    for (const p of PATH_CANDIDATES) {
      const url = BACKEND_BASE + p;
      try {
        const res = await timeoutFetch(url, { method: 'GET' }, TIMEOUT_MS);
        const text = await res.text().catch(() => '');
        if (res.ok) {
          // si body JSON parseable to Array -> accept
          try {
            const parsed = text ? JSON.parse(text) : null;
            if (Array.isArray(parsed) || parsed === null) {
              cachedPath = p;
              console.debug('FSApiClient.aprendices: detected endpoint', p);
              return cachedPath;
            }
          } catch (e) {
            // no JSON, but res.ok: accept
            cachedPath = p;
            console.debug('FSApiClient.aprendices: detected endpoint (non-json OK)', p);
            return cachedPath;
          }
        } else {
          const txtLower = (text || '').toLowerCase();
          if (res.status === 404 || txtLower.indexOf('cannot get') >= 0 || txtLower.indexOf('no static resource') >= 0) {
            console.debug('FSApiClient.aprendices: path not found', p, 'status', res.status);
            continue;
          }
          console.debug('FSApiClient.aprendices: candidate responded with status', res.status, p, 'body:', text);
          continue;
        }
      } catch (err) {
        console.debug('FSApiClient.aprendices: candidate fetch error', p, err && err.message);
        continue;
      }
    }
    console.warn('FSApiClient.aprendices: no backend path detected from candidates', PATH_CANDIDATES);
    return null;
  }

  // helper para construir URL a partir de path detectada (o usar una por defecto)
  async function buildUrl(resourcePath) {
    const p = await detectPath();
    if (p) return BACKEND_BASE + p + (resourcePath ? (resourcePath.startsWith('/') ? resourcePath : '/' + resourcePath) : '');
    return BACKEND_BASE + PATH_CANDIDATES[0] + (resourcePath ? (resourcePath.startsWith('/') ? resourcePath : '/' + resourcePath) : '');
  }

  const api = {
    obtenerAprendices: async function () {
      const base = await detectPath();
      if (!base) {
        console.warn('FSApiClient.obtenerAprendices: no backend detected, using local storage');
        return loadLocal();
      }
      const url = BACKEND_BASE + base;
      try {
        const res = await timeoutFetch(url, { method: 'GET' }, TIMEOUT_MS);
        if (!res.ok) {
          const body = await parseBodySafe(res);
          console.error('FSApiClient.obtenerAprendices: backend error', res.status, body);
          throw new Error((body && (body.message || body.error)) || ('HTTP ' + res.status));
        }
        const arr = await res.json().catch(() => []);
        return Array.isArray(arr) ? arr : [];
      } catch (err) {
        console.warn('FSApiClient.obtenerAprendices: fallback local (error)', err);
        return loadLocal();
      }
    },

    crearAprendiz: async function (payload) {
      const send = Object.assign({}, payload, {
        nombres: payload.nombres || payload.nombre || payload.name || '',
        nombre: payload.nombre || payload.nombres || payload.name || '',
        numeroDocumento: payload.numeroDocumento || payload.numero_documento || payload.documento || '',
        numero_documento: payload.numero_documento || payload.numeroDocumento || payload.documento || '',
        tipoDocumento: payload.tipoDocumento || payload.tipo_documento || payload.tipo || '',
        tipo_documento: payload.tipo_documento || payload.tipoDocumento || payload.tipo || '',
        ficha: payload.ficha || payload.numero_ficha || payload.numeroFicha || ''
      });

      const base = await detectPath();
      if (!base) {
        console.warn('FSApiClient.crearAprendiz: no backend detected, saving locally');
        const list = loadLocal();
        const localId = 'lap-' + Date.now();
        const item = Object.assign({}, send, { id: localId, _local: true });
        list.unshift(item);
        saveLocal(list);
        return item;
      }
      const url = BACKEND_BASE + base;
      try {
        const res = await timeoutFetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(send)
        }, TIMEOUT_MS);
        const body = await parseBodySafe(res);
        if (res.ok || res.status === 201) return body || send;
        const err = new Error((body && (body.message || body.error)) || ('HTTP ' + res.status));
        err.status = res.status; err.body = body;
        throw err;
      } catch (err) {
        console.warn('FSApiClient.crearAprendiz: backend failed, saving locally', err);
        const list = loadLocal();
        const localId = 'lap-' + Date.now();
        const item = Object.assign({}, send, { id: localId, _local: true });
        list.unshift(item);
        saveLocal(list);
        return item;
      }
    },

    actualizarAprendiz: async function (id, payload) {
      if (String(id).startsWith('lap-')) {
        const list = loadLocal();
        const idx = list.findIndex(x => String(x.id) === String(id));
        if (idx >= 0) {
          list[idx] = Object.assign({}, list[idx], payload);
          saveLocal(list);
          return list[idx];
        }
        const localItem = Object.assign({}, payload, { id: id, _local: true });
        const l = loadLocal(); l.unshift(localItem); saveLocal(l);
        return localItem;
      }

      const base = await detectPath();
      if (!base) {
        console.warn('FSApiClient.actualizarAprendiz: backend not detected, updating local');
        const list = loadLocal();
        const idx = list.findIndex(x => String(x.id) === String(id) || String(x.numeroDocumento) === String(id));
        if (idx >= 0) { list[idx] = Object.assign({}, list[idx], payload); saveLocal(list); return list[idx]; }
        const localItem = Object.assign({}, payload, { id: 'lap-' + Date.now(), _local: true });
        const l = loadLocal(); l.unshift(localItem); saveLocal(l); return localItem;
      }

      const url = BACKEND_BASE + base + '/' + encodeURIComponent(id);
      const send = Object.assign({}, payload, {
        nombres: payload.nombres || payload.nombre || '',
        nombre: payload.nombre || payload.nombres || '',
        numeroDocumento: payload.numeroDocumento || payload.numero_documento || '',
        numero_documento: payload.numero_documento || payload.numeroDocumento || '',
        tipoDocumento: payload.tipoDocumento || payload.tipo_documento || '',
        tipo_documento: payload.tipo_documento || payload.tipoDocumento || ''
      });

      try {
        const res = await timeoutFetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(send)
        }, TIMEOUT_MS);
        const body = await parseBodySafe(res);
        if (!res.ok) {
          console.error('FSApiClient.actualizarAprendiz backend error', res.status, body);
          throw new Error((body && (body.message || body.error)) || ('HTTP ' + res.status));
        }
        return body || send;
      } catch (err) {
        console.warn('FSApiClient.actualizarAprendiz: fallback local', err);
        const list = loadLocal();
        const idx = list.findIndex(x => String(x.id) === String(id) || String(x.numeroDocumento) === String(id));
        if (idx >= 0) { list[idx] = Object.assign({}, list[idx], send); saveLocal(list); return list[idx]; }
        const localItem = Object.assign({}, send, { id: 'lap-' + Date.now(), _local: true });
        const l = loadLocal(); l.unshift(localItem); saveLocal(l); return localItem;
      }
    },

    eliminarAprendiz: async function (id) {
      // treat local ids first
      if (String(id).startsWith('lap-') || String(id).startsWith('A-')) {
        const list = loadLocal().filter(x => String(x.id) !== String(id));
        saveLocal(list); return true;
      }

      const base = await detectPath();
      if (!base) {
        console.warn('FSApiClient.eliminarAprendiz: backend not detected, deleting locally');
        const list = loadLocal().filter(x => String(x.id) !== String(id));
        saveLocal(list); return true;
      }

      const url = BACKEND_BASE + base + '/' + encodeURIComponent(id);
      try {
        const res = await timeoutFetch(url, { method: 'DELETE' }, TIMEOUT_MS);
        const body = await parseBodySafe(res);
        if (!res.ok && res.status !== 204) {
          console.error('FSApiClient.eliminarAprendiz backend error', res.status, body);
          throw new Error((body && (body.message || body.error)) || ('HTTP ' + res.status));
        }
        const list = loadLocal().filter(x => String(x.id) !== String(id) && String(x.numeroDocumento) !== String(id));
        saveLocal(list); return true;
      } catch (err) {
        console.warn('FSApiClient.eliminarAprendiz fallback local (error)', err);
        const list = loadLocal().filter(x => String(x.id) !== String(id) && String(x.numeroDocumento) !== String(id));
        saveLocal(list); return false;
      }
    },

    syncAprendicesLocalToBackend: async function (onProgress) {
      const local = loadLocal();
      if (!local || local.length === 0) { if (typeof onProgress === 'function') onProgress({ total: 0, done: 0 }); return { synced: 0, total: 0 }; }
      let done = 0; let total = local.length;
      for (let i = 0; i < local.length; i++) {
        const it = local[i];
        try {
          if (!it._local && !String(it.id).startsWith('lap-')) { done++; if (onProgress) onProgress({ total, done }); continue; }
          const base = await detectPath();
          if (!base) { done++; if (onProgress) onProgress({ total, done }); continue; }
          const res = await timeoutFetch(BACKEND_BASE + base, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(it)
          }, TIMEOUT_MS);
          if (res.ok || res.status === 201) {
            const remaining = loadLocal().filter(x => String(x.id) !== String(it.id));
            saveLocal(remaining);
          }
          done++;
        } catch (e) { done++; }
        if (onProgress) onProgress({ total, done });
      }
      return { synced: done, total };
    },

    loadLocalAprendices: loadLocal,
    saveLocalAprendices: saveLocal
  };

  if (window.FSApiClient && typeof window.FSApiClient === 'object') { Object.assign(window.FSApiClient, api); } else { window.FSApiClient = api; }
})();