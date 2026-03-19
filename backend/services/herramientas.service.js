const db = require('../config/database');

const getAll = async () => {
    // We select all fields, and we manually alias codigo_herramienta as codigoInforme if needed for legacy
    const [rows] = await db.query('SELECT *, codigo_herramienta as codigoHerramienta FROM herramienta ORDER BY id_herramienta DESC');
    return rows;
};

const getHoy = async () => {
    const [rows] = await db.query('SELECT *, codigo_herramienta as codigoHerramienta FROM herramienta WHERE DATE(fecha_registro) = CURDATE() ORDER BY id_herramienta DESC');
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query('SELECT *, codigo_herramienta as codigoHerramienta FROM herramienta WHERE id_herramienta = ?', [id]);
    return rows[0] || null;
};

const create = async (data) => {
    const { 
        nombre, 
        descripcion, 
        estado, 
        tipo, 
        ubicacion, 
        cantidad, 
        fechaRegistro, // From frontend
        codigoHerramienta // From frontend
    } = data;
    
    const [result] = await db.query(
        `INSERT INTO herramienta 
         (nombre, descripcion, estado, tipo, cantidad, fecha_registro, codigo_herramienta) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre, descripcion, estado, tipo, cantidad, fechaRegistro, codigoHerramienta]
    );
    return result;
};

const update = async (id, data) => {
    const { 
        nombre, 
        descripcion, 
        estado, 
        tipo, 
        cantidad, 
        fecha_registro, // In edit modal it might be snake_case or camel
        codigoHerramienta 
    } = data;

    const fecha = fecha_registro || data.fechaRegistro;
    
    const [result] = await db.query(
        `UPDATE herramienta 
         SET nombre = ?, descripcion = ?, estado = ?, tipo = ?, cantidad = ?, fecha_registro = ?, codigo_herramienta = ?
         WHERE id_herramienta = ?`,
        [nombre, descripcion, estado, tipo, cantidad, fecha, codigoHerramienta, id]
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
    getHoy,
    getById,
    create,
    update,
    remove
};
