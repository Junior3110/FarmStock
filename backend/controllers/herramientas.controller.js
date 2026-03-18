const herramientasService = require('../services/herramientas.service');

const getHerramientas = async (req, res, next) => {
    try {
        const data = await herramientasService.getAll();
        // El frontend espera un array plano, no un wrapper
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
        await herramientasService.create(req.body);
        res.status(201).json({ mensaje: "Herramienta creada" });
    } catch (error) {
        next(error);
    }
};

const updateHerramienta = async (req, res, next) => {
    try {
        await herramientasService.update(req.params.id, req.body);
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
    getHerramientaById,
    createHerramienta,
    updateHerramienta,
    deleteHerramienta
};
