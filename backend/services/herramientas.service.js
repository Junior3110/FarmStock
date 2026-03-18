const db = require('../config/database');

const getAll = async () => {
    const [rows] = await db.query('SELECT * FROM herramienta');
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM herramienta WHERE id_herramienta = ?', [id]);
    return rows[0] || null;
};

const create = async (data) => {
    const { nombre, tipo, estado, cantidad } = data;
    const [result] = await db.query(
        'INSERT INTO herramienta (nombre, tipo, estado, cantidad) VALUES (?, ?, ?, ?)',
        [nombre, tipo, estado, cantidad]
    );
    return result;
};

const update = async (id, data) => {
    const { nombre } = data;
    const [result] = await db.query(
        'UPDATE herramienta SET nombre = ? WHERE id_herramienta = ?',
        [nombre, id]
    );
    return result;
};

const remove = async (id) => {
    const [result] = await db.query(
        'DELETE FROM herramienta WHERE id_herramienta = ?',
        [id]
    );
    return result;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
