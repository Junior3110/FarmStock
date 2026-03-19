const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamos.controller');

router.get('/activos', prestamosController.getAllActivos);
router.get('/activos/:id_ubicacion', prestamosController.getActivosByUbicacion);
router.post('/', prestamosController.crear);

module.exports = router;
