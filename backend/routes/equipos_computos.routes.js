const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equipos_computos.controller');

router.get('/', equiposController.getAllEquipos);
router.get('/codigo/:codigo', equiposController.getEquipoByCodigo);
router.get('/cedula/:cedula', equiposController.getEquiposByCedula);
router.post('/', equiposController.createEquipo);

module.exports = router;
