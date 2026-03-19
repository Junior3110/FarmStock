# Tareas - Actualizaciones del Sistema de Inventario / Prototipo DB

- [x] Fase 1: Base de Datos y Backend Core
  - [x] Levantar las 11 tablas base requeridas según el doc (usuarios, residentes, ubicaciones, herramientas, detalle, equipos_computo, equipos_movimiento, reporte_dano, mantenimiento, prestamos, notificaciones).
  - [x] Implementar soporte en backend para recibir fotos en los endpoints de herramientas.
  - [x] Adaptar queries de consultas de préstamos/inventarios para las nuevas jerarquías de ubicación.

- [x] Fase 2: Registro de Herramientas (Frontend)
  - [x] Añadir campo/botón para adjuntar foto.
  - [x] Implementar el nuevo listado de proyectos (Salvajina, Urra, Ibague, San Carlos, Fundación, Bodega principal).
  - [x] Formatear adecuadamente la fecha con hora de los recientes registros en pantalla.

- [x] Fase 8: Flexbox y Tabla de Movimientos
  - [x] Cambiar diseño visual de las tarjetas 'Registro de hoy' para agrupar variables en lista con foto estática al lateral derecho.
  - [x] Script Node dinámico ejecutado para poblar transparentemente la tabla de `equipos_movimiento` e iluminar los registros de log transactionales de salida pre-seed.

- [x] Fase 9: Consolas y Vistas UI de Préstamos
  - [x] Depurar tabla relacional en el backend API (`/prestamo/activos`) que fallaba por la columna errónea `numero_documento` hacia `num_documento`.
  - [x] Confirmar que las 25 Salidas de Prueba se plasmen explícitamente en `registro-salida.html`.

- [x] Fase 3: Salida de Herramienta (Frontend)
  - [x] Implementar el dropdown selector de Proyectos.
  - [x] Ocultar Bodega principal de ese listado.
  - [x] Obtener solo préstamos activos de los últimos 3 meses para la ubicación seleccionada.

- [x] Fase 4: Inventario (Frontend)
  - [x] Eliminar buscador por código actual de inventario.
  - [x] Implementar la vista por tarjetas visuales (cards) de proyectos (incluyendo Bodega principal).
  - [x] Mostrar en las tarjetas la herramienta junto con su foto correspondiente.
  - [ ] Implementar la vista del proyecto seleccionado: mostrar exclusivamente las herramientas de ese proyecto o de la bodega principal.
  - [ ] Incluir la foto alojada en el server dentro de las tarjetas individuales de las herramientas.

- [x] Fase 5: Detalles de Inventario
  - [x] Mover el botón "Volver a Proyectos" arriba a la derecha.
  - [x] Eliminar el uso y escaneo de códigos QR de los modales de Detalles.
  - [x] Soportar mostrar y editar fotos subidas directamente desde la tarjeta de Inventario.

- [x] Fase 6: Ajustes de Layout (Inventario)
  - [x] Reordenar encabezado para listar el título Inventario, Inventario: Proyecto, y Botón de Volver orientados de manera horizontal superior.
  - [x] Aplicar Grid-Layout a los contenedores de tarjetas para asegurar listado horizontal adaptable de Proyectos y Herramientas.

- [x] Fase 7: Datos de Prueba (Seed) y Filtros de Hoy
  - [x] Generar 20 herramientas mock para la Bodega principal con imágenes adjuntas.
  - [x] Generar 5 herramientas adicionales por cada proyecto (25 en total) y asociarles un registro de salida (Préstamo Activo).
  - [x] Validar que la interfaz 'Registro de hoy' restrinja el historial temporal estrictamente mediante `CURDATE()` en base de datos para expirar a las 11:59PM.
