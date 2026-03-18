# FarmStock - Backend Modular

Sistema de gestión de inventario profesional y escalable.

## Estructura de Carpetas
- `config/`: Configuración de base de datos.
- `controllers/`: Manejo de peticiones y respuestas.
- `services/`: Lógica de negocio e interacción con BD.
- `routes/`: Definición de rutas API.
- `middlewares/`: Manejo de errores y validaciones.

## Requisitos
- Node.js
- MySQL

## Instalación
1. `npm install`
2. Configura tu archivo `.env` en la raíz.

## Ejecución
```bash
node backend/server.js
```

## API Endpoints
- `GET /api/health`: Estado del servidor.
- `GET /api/herramientas`: Listar herramientas.
- `POST /api/herramientas`: Crear herramienta.
