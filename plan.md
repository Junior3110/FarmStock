# Plan de Implementación - Actualización de Base de Datos e Interfaz

## 1. Análisis y Arquitectura
- **Base de Datos (PostgreSQL)**: Creación/actualización de las 11 tablas principales usando relaciones correctas y `snake_case`. (usuarios, residentes, ubicaciones, herramientas, herramienta_detalle, equipos_computo, equipos_movimiento, reporte_dano, mantenimiento, prestamos, notificaciones). Modificación de la tabla herramientas para agregar columna de foto.
- **Backend (Node/Express)**: Ajuste en los controladores y rutas para gestionar la subida de imágenes (archivos adjuntos) y traer los préstamos activos de los últimos 3 meses.
- **Frontend (UI)**:
  - **Registro de herramientas**: Añadir subida de foto. Arreglar formateo de fecha para que sea legible y con hora. Reemplazar "Bodega/Taller" por los 6 proyectos específicos.
  - **Salida**: Nuevo selector para proyectos (sin incluir Bodega principal). Mostrar sólo activos de los últimos 3 meses de la ubicación.
  - **Inventario**: Eliminar buscador por código. La vista principal mostrará tarjetas (recuadros) por cada Proyecto. Al hacer clic en un proyecto, se mostrarán las herramientas de ese proyecto. Las herramientas tendrán su foto en la tarjeta.

## 2. Validación
- Realizar simulación de registro de herramienta con imagen, validando la inserción.
- Checar los listados en Inventario y los reportes en Salida para comprobar la lógica de negocios deseada por proyectos.
