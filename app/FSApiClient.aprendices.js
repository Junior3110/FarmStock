(function (global) {
  'use strict';

  const API_BASE = 'http://localhost:3000/aprendices';

  const FSC_Aprendices = {
    getAll: async function () {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Error al obtener aprendices');
      return await res.json();
    },

    create: async function (data) {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(body.message || 'Error al crear aprendiz');
      }
      return await res.json();
    },

    update: async function (id, data) {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(body.message || 'Error al actualizar aprendiz');
      }
      return await res.json();
    },

    remove: async function (id) {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error('Error al eliminar aprendiz');
      return true;
    }
  };

  global.FSC_Aprendices = FSC_Aprendices;
})(window);
