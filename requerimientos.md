Base de datos (Estructura)

USUARIO

Id_usuario
Nombres
Apellidos
Correo
Teléfono
Cargo
Tipo_documento
Num_documento
Contraseña
Fecha_registro

RESIDENTE

Id_residente
Nombre
Tipo_documento
Num_documento
Ubicación
Correo

UBICACIÓN (bodega)

Id_ubicacion
Nombre
Descripcion

HERRAMIENTA

Id_herramienta
Nombre
Descripción
Estado
Tipo
Ubicación
Cantidad
Fecha_registro

HERRAMIENTA_DETALLE

Id_detalle
Id_herramienta
Estado
Disponible
Fecha_ingreso
Comentario
Contador_prestamo

EQUIPOS_COMPUTO

Id_equipo
Nombre_persona
Cedula
Ubicación
Nombre_equipo
Código_equipo
Fecha_registro

EQUIPOS_MOVIMIENTO

Id_movimiento
Codigo_equipo
Tipo_movimiento
Ubicacion_origen
Ubicacion_destino
Fecha_movimiento
Registrado_por
Observación

REPORTE_DANO

Id_dano
Id_herramienta
Descripción
Fecha_reporte
Reportado_por
Id_detalle

MANTENIMIENTO

Id_mantenimiento
Id_herramienta
Descripción
Fecha_mantenimiento
Realizado_por
Id_detalle
Estado
Tipo

PRESTAMO

Id_prestamo
Id_usuario
Id_herramienta
Id_detalle
Id_residente
Id_ubicacion
Fecha_prestamo
Fecha_devolucion
Estado

NOTIFICACION

Id_notificacion
Id_usuario
Mensaje
Tipo
Leida
Fecha

CAMBIOS AL PROYECTO BASE

Al sistema de gestión de inventario se le debe corregir los siguientes paneles 

Registro de Herramientas en el espacio de ubicación reemplazar la ubicación de bodega y taller por los proyectos que te voy a mencionar


[IMAGEN: requerimiento_img_1.png]


Salvajina

Urra

Ibague

San Carlos

Fundación

Bodega principal

Arreglar ese problema con las fechas y que salga la hora exacta y no asi como sale 


[IMAGEN: requerimiento_img_2.png]


Y por ahora otro cambio es que deje adjuntar una foto de la herramienta al registrarla

SALIDA DE HERRAMIENTA

Para la salida de herramienta tengo pensado que para los filtros aca en esta sección


[IMAGEN: requerimiento_img_3.png]


Salgan los proyectos que mencione para las ubicaciones y que de acuerdo a los últimos pretamos de los 3 meses salgan por ubicación solo mostrando los que están activos porque los devueltos llegan siempre a la bodega principal pero la bodega principal no se va a mostrar ahí porque es de ahí de donde salen las herramientas esa va en inventario 

De resto por el momento en salida herramienta esta bien

INVENTARIO

Aca viene lo complicado creo yo 

Mira donde están las herramientas tienen que estar los proyectos y que al seleccionar el proyecto salgan todas las herramientas que hay en ese proyecto o en la bodega principal, cada herramienta tiene que tener sus datos y también su foto


[IMAGEN: requerimiento_img_4.png]


El apartado de filtrar es mejor quitarl0o porque no son tantos proyectos

