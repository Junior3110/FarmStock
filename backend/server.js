require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware');
const herramientasRoutes = require('./routes/herramientas.routes');
const equiposComputosRoutes = require('./routes/equipos_computos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const aprendicesRoutes = require('./routes/aprendices.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas — alineadas con FSApiClient.js (singular)
app.use('/herramienta', herramientasRoutes);
app.use('/equipos-computos', equiposComputosRoutes);

// Placeholders para módulos pendientes
app.use('/prestamo', (req, res) => {
    res.json({ success: true, data: [], message: "Módulo de préstamos pendiente" });
});

app.use('/usuario', usuariosRoutes);
app.use('/aprendices', aprendicesRoutes);

// --- Mock "Detalles" ---
let detallesMockDB = [];
let nextDetalleId = 1;

app.get('/api/herramienta-detalle/herramienta/:idHerramienta', (req, res) => {
    const idH = req.params.idHerramienta;
    let detalles = detallesMockDB.filter(d => String(d.herramienta?.idHerramienta || d.herramienta?.id) === String(idH));
    if (detalles.length === 0) {
        // Generar 1 detalle virtual
        const nd = {
            idDetalle: nextDetalleId++,
            estado: 'Disponible',
            disponible: true,
            fechaIngreso: new Date().toISOString().split('T')[0],
            codigoUnico: 'UNIT-' + idH + '-1',
            descripcion: '',
            herramienta: { idHerramienta: idH, nombre: 'Herramienta ID '+idH }
        };
        detallesMockDB.push(nd);
        detalles.push(nd);
    }
    res.json(detalles);
});

app.put('/api/herramienta-detalle/:idDetalle', (req, res) => {
    const idD = req.params.idDetalle;
    const idx = detallesMockDB.findIndex(d => String(d.idDetalle) === String(idD));
    if (idx >= 0) {
        detallesMockDB[idx] = { ...detallesMockDB[idx], ...req.body };
        return res.json(detallesMockDB[idx]);
    }
    res.status(404).json({ message: "Detalle no encontrado en memoria" });
});

// --- Mock "Estadísticas de Mantenimientos" ---
const db = require('./config/database');
app.get('/mantenimientos/estadisticas', async (req, res, next) => {
    try {
        const [herramientas] = await db.query('SELECT * FROM herramienta');
        const stats = herramientas.map(h => {
            // Generar algo de ruido pseudoaleatorio en base a la longitud del nombre para que siempre sea igual
            const nombreStr = h.nombre || 'Herramienta';
            const rSeed = nombreStr.length + (h.id_herramienta || 1);
            return {
                idHerramienta: h.id_herramienta,
                nombreHerramienta: h.nombre,
                totalPrestamos: (rSeed * 3) % 25,
                totalDanos: (rSeed) % 5,
                totalMantenimientos: (rSeed * 2) % 10
            };
        });
        res.json(stats);
    } catch (e) {
        next(e);
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: "Servidor funcionando correctamente 🔥", timestamp: new Date() });
});

// Manejo de errores
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${PORT} ya está en uso.`);
    } else {
        console.error(`❌ Error del servidor: ${err.message}`);
    }
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Excepción no capturada:', err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Promesa no manejada:', reason);
});