# Plan de Acción - Resolviendo los 4 Bugs / Mejoras

1. **Quiénes Somos (Misión y Visión)**
   - Eliminar `mision2.jpg` y `vision2.jpg` en HTML.
   - Ajustar el CSS en `quienes-somos.css` para centrar la imagen única en su contenedor flex.

2. **Mejores Estadísticas (Tiempo Real)**
   - Agregar polling con `setInterval` en `estats.html` para consultar los datos periódicamente sin refrescar la página manualmente.

3. **Herramientas de Hoy**
   - Modificar la query SQL en `herramientas.controller.js` método `obtenerHoy`.
   - Asegurar `ORDER BY id_herramienta DESC` y el filtro `DATE(fecha_registro) = CURDATE()`.

4. **Equipos de Cómputo (Arreglo de Registro + 3 Datos)**
   - Implementar todo el endpoint faltante en el backend (Rutas y Controladores).
   - Crear tabla en la BD usando conexión DDL si no existe.
   - Insertar 3 registros de prueba.
