const db = require('./config/database');

async function setup() {
    try {
        console.log("Creando tabla equipo_computo...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS equipo_computo (
                id_equipo INT NOT NULL AUTO_INCREMENT,
                nombre_persona VARCHAR(150) NOT NULL,
                cedula VARCHAR(50) NOT NULL,
                nombre_equipo VARCHAR(150) NOT NULL,
                codigo_equipo VARCHAR(100) NOT NULL,
                fecha_registro DATETIME NOT NULL,
                PRIMARY KEY (id_equipo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `);
        console.log("Tabla equipo_computo asegurada.");

        console.log("Insertando 3 registros de prueba...");
        await db.query(`
            INSERT INTO equipo_computo (nombre_persona, cedula, nombre_equipo, codigo_equipo, fecha_registro)
            VALUES 
            ('Maria Lopez', '10203040', 'Laptop Lenovo ThinkPad', 'SENA-101', NOW()),
            ('Carlos Vargas', '50607080', 'PC Escritorio HP', 'SENA-102', NOW()),
            ('Ana Martinez', '90102030', 'MacBook Air', 'SENA-103', NOW())
        `);
        console.log("3 registros insertados con éxito.");

    } catch (error) {
        console.error("Error en setup_equipos:", error);
    } finally {
        process.exit();
    }
}

setup();
