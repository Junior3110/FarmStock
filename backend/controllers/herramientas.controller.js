const herramientasService = require('../services/herramientas.service');

const getHerramientas = async (req, res, next) => {
    try {
        const data = await herramientasService.getAll();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getHerramientasHoy = async (req, res, next) => {
    try {
        const data = await herramientasService.getHoy();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getHerramientaById = async (req, res, next) => {
    try {
        const item = await herramientasService.getById(req.params.id);
        if (!item) return res.status(404).json({ mensaje: "Herramienta no encontrada" });
        res.json(item);
    } catch (error) {
        next(error);
    }
};

const createHerramienta = async (req, res, next) => {
    try {
        const bodyData = { ...req.body };
        if (req.file) {
            bodyData.foto = `/uploads/${req.file.filename}`;
        }
        await herramientasService.create(bodyData);
        res.status(201).json({ mensaje: "Herramienta creada" });
    } catch (error) {
        next(error);
    }
};

const updateHerramienta = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id || id === 'undefined' || isNaN(id)) {
            return res.status(400).json({ message: "ID de herramienta no válido" });
        }
        const bodyData = { ...req.body };
        if (req.file) {
            bodyData.foto = `/uploads/${req.file.filename}`;
        }
        await herramientasService.update(id, bodyData);
        res.json({ mensaje: "Actualizada" });
    } catch (error) {
        next(error);
    }
};

const deleteHerramienta = async (req, res, next) => {
    try {
        await herramientasService.remove(req.params.id);
        res.json({ mensaje: "Eliminada" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHerramientas,
    getHerramientasHoy,
    getHerramientaById,
    createHerramienta,
    updateHerramienta,
    deleteHerramienta
};
