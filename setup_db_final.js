// setup_db_final.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function setup() {
    console.log("--- Iniciando Ajustes de Base de Datos ---");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // 1. Crear tabla equipo_computo
        console.log("Asegurando tabla equipo_computo...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS equipo_computo (
                id_equipo INT NOT NULL AUTO_INCREMENT,
                nombre_persona VARCHAR(150) NOT NULL,
                cedula VARCHAR(50) NOT NULL,
                nombre_equipo VARCHAR(150) NOT NULL,
                codigo_equipo VARCHAR(100) NOT NULL,
                fecha_registro DATETIME NOT NULL,
                PRIMARY KEY (id_equipo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // 2. Ajustar columnas a VARCHAR
        console.log("Ajustando columnas a VARCHAR...");
        await connection.query("ALTER TABLE usuario MODIFY COLUMN cargo VARCHAR(100) NULL");
        await connection.query("ALTER TABLE usuario MODIFY COLUMN tipo_documento VARCHAR(100) NULL");

        // 2b. Columna foto_perfil
        try {
            await connection.query("ALTER TABLE usuario ADD COLUMN foto_perfil LONGTEXT DEFAULT NULL");
            console.log("Columna foto_perfil añadida");
        } catch (e) {
            if (e.code === 'ER_DUP_COLUMN_NAME') {
                await connection.query("ALTER TABLE usuario MODIFY COLUMN foto_perfil LONGTEXT");
                console.log("Columna foto_perfil asegurada como LONGTEXT");
            } else {
                console.warn("Aviso foto_perfil:", e.message);
            }
        }

        // 3. Equipos
        const [equiposCount] = await connection.query("SELECT COUNT(*) as count FROM equipo_computo");
        if (equiposCount[0].count === 0) {
            console.log("Insertando equipos...");
            await connection.query("INSERT INTO equipo_computo (nombre_persona, cedula, nombre_equipo, codigo_equipo, fecha_registro) VALUES ('Maria Lopez', '10203040', 'Laptop ThinkPad', 'SENA-101', NOW()), ('Carlos Vargas', '50607080', 'PC HP', 'SENA-102', NOW()), ('Ana Martinez', '90102030', 'MacBook Air', 'SENA-103', NOW())");
        }

        // 4. Admin - Usando check en JS
        const [allUsers] = await connection.query("SELECT * FROM usuario");
        const adminExists = allUsers.some(u => String(u.num_documento) === '123456');
        
        if (!adminExists) {
            console.log("Creando admin...");
            const userObj = {
                nombres: 'Admin',
                apellidos: 'Sena',
                correo: 'admin@sena.edu.co',
                telefono: '3000000000',
                cargo: 'Administrador',
                tipo_documento: 'CC',
                num_documento: '123456',
                contrasena: 'Admin123*'
            };
            const keys = Object.keys(userObj);
            const vals = Object.values(userObj);
            const placeholders = keys.map(() => '?').join(',');
            const sql = `INSERT INTO usuario (${keys.join(',')}) VALUES (${placeholders})`;
            await connection.query(sql, vals);
            console.log("Admin creado con Doc: 123456 / Pass: Admin123*");
        } else {
            console.log("Admin ya existe.");
        }

        console.log("--- Base de datos configurada con éxito ---");

    } catch (error) {
        console.error("Error crítico:", error);
    } finally {
        await connection.end();
        process.exit();
    }
}

setup();
