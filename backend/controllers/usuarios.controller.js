const db = require('../config/database');
const usuariosService = require('../services/usuarios.service');

const login = async (req, res, next) => {
    try {
        const { numeroDocumento, tipoDocumento, contrasena, cargo } = req.body;
        
        const [rows] = await db.query(
            'SELECT * FROM usuarios WHERE num_documento = ? AND tipo_documento = ? AND cargo = ?',
            [numeroDocumento, tipoDocumento, cargo]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Usuario no encontrado con esos datos" });
        }

        const user = rows[0];

        // Comparación simple por ahora
        if (contrasena !== user.contrasena) {
            return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
        }

        // Retornar usuario sin pass, formateado como espera el frontend
        const { contrasena: _c, ...userData } = user;
        
        // Mapeo selectivo para asegurar compatibilidad con render-login.js
        const responseData = {
          idUsuario: userData.id_usuario,
          nombres: userData.nombres,
          apellidos: userData.apellidos,
          correo: userData.correo,
          telefono: userData.telefono,
          cargo: userData.cargo,
          tipoDocumento: userData.tipo_documento,
          numeroDocumento: userData.num_documento
        };

        res.json({ success: true, data: responseData, message: "Login exitoso" });

    } catch (error) {
        next(error);
    }
};

const registrar = async (req, res, next) => {
    try {
        const { nombres, apellidos, tipoDocumento, numeroDocumento, correo, telefono, cargo, contrasena } = req.body;

        // Verificar si ya existe
        const [exists] = await db.query('SELECT id_usuario FROM usuarios WHERE num_documento = ? OR correo = ?', [numeroDocumento, correo]);
        if (exists.length > 0) {
            return res.status(400).json({ success: false, message: "El documento o correo ya está registrado" });
        }

        const [result] = await db.query(
            'INSERT INTO usuarios (nombres, apellidos, correo, telefono, cargo, tipo_documento, num_documento, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombres, apellidos, correo, telefono, cargo, tipoDocumento, numeroDocumento, contrasena]
        );

        res.status(201).json({ success: true, message: "Usuario registrado con éxito", id: result.insertId });

    } catch (error) {
        next(error);
    }
};

const getByDocumento = async (req, res, next) => {
    try {
        const { numeroDocumento } = req.params;
        const [rows] = await db.query('SELECT id_usuario as idUsuario, nombres, apellidos, correo, telefono, cargo, tipo_documento as tipoDocumento, num_documento as numeroDocumento FROM usuarios WHERE num_documento = ?', [numeroDocumento]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
        
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await usuariosService.getById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedUser = await usuariosService.update(id, req.body);
        res.json({ success: true, data: updatedUser, message: "Perfil actualizado" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    registrar,
    getByDocumento,
    getUserById,
    updateUser
};
