const db = require('../config/database');

const getAll = async () => {
    // We select all fields, and we manually alias codigo_herramienta as codigoInforme if needed for legacy
    const [rows] = await db.query('SELECT h.*, h.codigo_herramienta as codigoHerramienta, u.nombre as ubicacion FROM herramientas h LEFT JOIN ubicaciones u ON h.id_ubicacion = u.id_ubicacion ORDER BY h.id_herramienta DESC');
    return rows;
};

const getHoy = async () => {
    const [rows] = await db.query('SELECT h.*, h.codigo_herramienta as codigoHerramienta, u.nombre as ubicacion FROM herramientas h LEFT JOIN ubicaciones u ON h.id_ubicacion = u.id_ubicacion WHERE DATE(h.fecha_registro) = CURDATE() ORDER BY h.id_herramienta DESC');
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query('SELECT h.*, h.codigo_herramienta as codigoHerramienta, u.nombre as ubicacion FROM herramientas h LEFT JOIN ubicaciones u ON h.id_ubicacion = u.id_ubicacion WHERE h.id_herramienta = ?', [id]);
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
        fechaRegistro, 
        codigoHerramienta,
        foto
    } = data;
    
    // Tratamos ubicacion as id_ubicacion from frontend
    const id_ubicacion = ubicacion || null;

    const [result] = await db.query(
        `INSERT INTO herramientas 
         (nombre, descripcion, estado, tipo, id_ubicacion, cantidad, fecha_registro, codigo_herramienta, foto) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, descripcion, estado || 'Buen estado', tipo, id_ubicacion, cantidad || 1, fechaRegistro || new Date(), codigoHerramienta, foto || null]
    );
    return result;
};

const update = async (id, data) => {
    const { 
        nombre, 
        descripcion, 
        estado, 
        tipo, 
        ubicacion,
        cantidad, 
        fecha_registro,
        codigoHerramienta,
        foto
    } = data;

    const fecha = fecha_registro || data.fechaRegistro;
    const id_ubicacion = ubicacion || null;
    
    let query = `UPDATE herramientas SET nombre = ?, descripcion = ?, estado = ?, tipo = ?, id_ubicacion = ?, cantidad = ?, fecha_registro = ?, codigo_herramienta = ?`;
    let params = [nombre, descripcion, estado, tipo, id_ubicacion, cantidad, fecha, codigoHerramienta];

    if (foto) {
        query += `, foto = ?`;
        params.push(foto);
    }
    
    query += ` WHERE id_herramienta = ?`;
    params.push(id);

    const [result] = await db.query(query, params);
    return result;
};

const remove = async (id) => {
    const [result] = await db.query(
        'DELETE FROM herramientas WHERE id_herramienta = ?',
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
