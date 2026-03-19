const express = require('express');
const router = express.Router();
const herramientasController = require('../controllers/herramientas.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', herramientasController.getHerramientas);
router.get('/hoy', herramientasController.getHerramientasHoy); // Retorna las de hoy
router.get('/:id', herramientasController.getHerramientaById);
router.post('/', upload.single('foto'), herramientasController.createHerramienta);
router.put('/:id', upload.single('foto'), herramientasController.updateHerramienta);
router.delete('/:id', herramientasController.deleteHerramienta);

module.exports = router;
