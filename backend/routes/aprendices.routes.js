const express = require('express');
const router = express.Router();
const aprendicesController = require('../controllers/aprendices.controller');

router.get('/', aprendicesController.getAll);
router.get('/buscar', aprendicesController.buscar);
router.get('/:id', aprendicesController.getById);
router.post('/', aprendicesController.create);
router.put('/:id', aprendicesController.update);
router.delete('/:id', aprendicesController.remove);

module.exports = router;
