const db = require('../config/database');

const getAllActivos = async () => {
    const query = `
        SELECT 
            p.id_prestamo as idPrestamo,
            p.fecha_prestamo as fechaPrestamo,
            h.id_herramienta,
            h.nombre,
            h.codigo_herramienta,
            h.foto,
            p.estado,
            u.num_documento as aprendiz_cc,
            u.cargo as aprendiz_ficha
        FROM prestamos p
        JOIN herramientas h ON p.id_herramienta = h.id_herramienta
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        WHERE p.estado = 'Activo'
        AND p.fecha_prestamo >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
        ORDER BY p.fecha_prestamo DESC
    `;
    const [rows] = await db.query(query);
    return rows;
};

const getActivosPorUbicacion = async (id_ubicacion) => {
    const query = `
        SELECT 
            p.id_prestamo as idPrestamo,
            p.fecha_prestamo as fechaPrestamo,
            h.id_herramienta,
            h.nombre,
            h.codigo_herramienta,
            h.foto,
            p.estado,
            u.num_documento as aprendiz_cc,
            u.cargo as aprendiz_ficha
        FROM prestamos p
        JOIN herramientas h ON p.id_herramienta = h.id_herramienta
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        WHERE p.id_ubicacion = ?
        AND p.estado = 'Activo'
        AND p.fecha_prestamo >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
        ORDER BY p.fecha_prestamo DESC
    `;
    const [rows] = await db.query(query, [id_ubicacion]);
    return rows;
};

const createPrestamo = async (data) => {
    const { id_usuario, id_herramienta, id_ubicacion } = data;
    const [result] = await db.query(
        `INSERT INTO prestamos (id_usuario, id_herramienta, id_ubicacion, fecha_prestamo, estado) VALUES (?, ?, ?, NOW(), 'Activo')`,
        [id_usuario, id_herramienta, id_ubicacion]
    );
    return result;
};

module.exports = {
    getAllActivos,
    getActivosPorUbicacion,
    createPrestamo
};
