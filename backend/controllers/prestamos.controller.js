const prestamosService = require('../services/prestamos.service');

const getAllActivos = async (req, res, next) => {
    try {
        const activos = await prestamosService.getAllActivos();
        res.json(activos);
    } catch (error) {
        next(error);
    }
};

const getActivosByUbicacion = async (req, res, next) => {
    try {
        const { id_ubicacion } = req.params;
        const activos = await prestamosService.getActivosPorUbicacion(id_ubicacion);
        res.json(activos);
    } catch (error) {
        next(error);
    }
};

const crear = async (req, res, next) => {
    try {
        await prestamosService.createPrestamo(req.body);
        res.status(201).json({ mensaje: "Préstamo registrado exitosamente" });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllActivos,
    getActivosByUbicacion,
    crear
};
