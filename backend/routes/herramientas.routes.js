const express = require('express');
const router = express.Router();
const herramientasController = require('../controllers/herramientas.controller');

router.get('/', herramientasController.getHerramientas);
router.get('/hoy', herramientasController.getHerramientas); // Retorna todas por ahora
router.get('/:id', herramientasController.getHerramientaById);
router.post('/', herramientasController.createHerramienta);
router.put('/:id', herramientasController.updateHerramienta);
router.delete('/:id', herramientasController.deleteHerramienta);

module.exports = router;
