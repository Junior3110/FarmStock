const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.post('/login', usuariosController.login);
router.post('/', usuariosController.registrar);
router.get('/documento/:numeroDocumento', usuariosController.getByDocumento);
router.get('/:id', usuariosController.getUserById);
router.put('/:id', usuariosController.updateUser);

module.exports = router;
