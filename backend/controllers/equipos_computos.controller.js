const db = require('../config/database');

const getAllEquipos = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM equipos_computo ORDER BY id_equipo DESC');
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

const getEquipoByCodigo = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM equipos_computo WHERE codigo_equipo = ?', [req.params.codigo]);
        if (rows.length === 0) return res.status(404).json({ message: "Equipo no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

const getEquiposByCedula = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM equipos_computo WHERE cedula = ?', [req.params.cedula]);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

const createEquipo = async (req, res, next) => {
    try {
        const { nombre_persona, cedula, nombre_equipo, codigo_equipo, fecha_registro } = req.body;
        const [result] = await db.query(
            'INSERT INTO equipos_computo (nombre_persona, cedula, nombre_equipo, codigo_equipo, fecha_registro) VALUES (?, ?, ?, ?, ?)',
            [nombre_persona, cedula, nombre_equipo, codigo_equipo, fecha_registro || new Date()]
        );
        res.status(201).json({ id_equipo: result.insertId, message: "Equipo creado con éxito" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEquipos,
    getEquipoByCodigo,
    getEquiposByCedula,
    createEquipo
};
