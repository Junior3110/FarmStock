const db = require('../config/database');

const getAll = async () => {
    // Mapping DB columns to CamelCase for the frontend
    const [rows] = await db.query(`
        SELECT 
            id_residente as idAprendiz,
            nombre,
            tipo_documento as tipoDocumento,
            num_documento as numeroDocumento,
            numero_ficha as numeroFicha,
            correo
        FROM residente 
        ORDER BY id_residente DESC
    `);
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query(`
        SELECT 
            id_residente as idAprendiz,
            nombre,
            tipo_documento as tipoDocumento,
            num_documento as numeroDocumento,
            numero_ficha as numeroFicha,
            correo
        FROM residente 
        WHERE id_residente = ?
    `, [id]);
    return rows[0] || null;
};

const create = async (data) => {
    const { nombre, tipoDocumento, numeroDocumento, numeroFicha, correo } = data;
    const [result] = await db.query(
        'INSERT INTO residente (nombre, tipo_documento, num_documento, numero_ficha, correo) VALUES (?, ?, ?, ?, ?)',
        [nombre, tipoDocumento, numeroDocumento, numeroFicha, correo || null]
    );
    return result;
};

const update = async (id, data) => {
    const { nombre, tipoDocumento, numeroDocumento, numeroFicha, correo } = data;
    const [result] = await db.query(
        'UPDATE residente SET nombre = ?, tipo_documento = ?, num_documento = ?, numero_ficha = ?, correo = ? WHERE id_residente = ?',
        [nombre, tipoDocumento, numeroDocumento, numeroFicha, correo || null, id]
    );
    return result;
};

const remove = async (id) => {
    const [result] = await db.query('DELETE FROM residente WHERE id_residente = ?', [id]);
    return result;
};

const buscarPorDocumento = async (tipo, numero) => {
    const [rows] = await db.query(`
        SELECT * FROM residente 
        WHERE tipo_documento = ? AND num_documento = ?
    `, [tipo, numero]);
    return rows[0] || null;
};

const buscarPorFicha = async (ficha) => {
    const [rows] = await db.query(`
        SELECT * FROM residente 
        WHERE numero_ficha = ?
    `, [ficha]);
    return rows;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    buscarPorDocumento,
    buscarPorFicha
};
