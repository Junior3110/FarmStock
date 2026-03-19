const db = require('../config/database');

const getById = async (id) => {
    const [rows] = await db.query('SELECT id_usuario as idUsuario, nombres, apellidos, correo, telefono, cargo, tipo_documento as tipoDocumento, num_documento as numeroDocumento, foto_perfil as fotoPerfil FROM usuario WHERE id_usuario = ?', [id]);
    return rows[0] || null;
};

const update = async (id, data) => {
    const { nombres, apellidos, correo, telefono, fotoPerfil } = data;
    await db.query(`
        UPDATE usuario 
        SET nombres = ?, apellidos = ?, correo = ?, telefono = ?, foto_perfil = ?
        WHERE id_usuario = ?
    `, [nombres, apellidos, correo, telefono, fotoPerfil, id]);
    
    return await getById(id);
};

const updatePassword = async (id, newPassword) => {
    await db.query('UPDATE usuario SET contrasena = ? WHERE id_usuario = ?', [newPassword, id]);
    return true;
};

module.exports = {
    getById,
    update,
    updatePassword
};
