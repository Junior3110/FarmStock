const aprendicesService = require('../services/aprendices.service');

const getAll = async (req, res, next) => {
    try {
        const data = await aprendicesService.getAll();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const item = await aprendicesService.getById(req.params.id);
        if (!item) return res.status(404).json({ message: "No encontrado" });
        res.json(item);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        // Validation check
        const { nombre, tipoDocumento, numeroDocumento } = req.body;
        if (!nombre || !tipoDocumento || !numeroDocumento) {
            return res.status(400).json({ message: "Nombre, tipo y número de documento son obligatorios" });
        }

        const result = await aprendicesService.create(req.body);
        res.status(201).json({ idAprendiz: result.insertId, message: "Creado" });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        await aprendicesService.update(req.params.id, req.body);
        res.json({ message: "Actualizado" });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await aprendicesService.remove(req.params.id);
        res.json({ message: "Eliminado" });
    } catch (error) {
        next(error);
    }
};

const buscar = async (req, res, next) => {
    try {
        const { tipoDocumento, numeroDocumento } = req.query;
        if (!tipoDocumento || !numeroDocumento) {
            return res.status(400).json({ message: "Faltan parámetros" });
        }
        const item = await aprendicesService.buscarPorDocumento(tipoDocumento, numeroDocumento);
        if (!item) return res.status(404).json({ message: "No encontrado" });
        res.json(item);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    buscar
};
