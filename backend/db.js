const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '171006', // tu contraseña
    database: 'inventario'
});

conexion.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

module.exports = conexion;