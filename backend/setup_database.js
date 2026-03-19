require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
    console.log("--- Iniciando Creación de Estructura de Base de Datos ---");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '171006',
        database: process.env.DB_NAME || 'inventario'
    });

    try {
        // Drop existing tables in reverse dependency order if needed, but we'll just create new plural tables
        
        console.log("Creando tabla ubicaciones...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS ubicaciones (
                id_ubicacion INT NOT NULL AUTO_INCREMENT,
                nombre VARCHAR(150) NOT NULL,
                descripcion TEXT,
                PRIMARY KEY (id_ubicacion)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla usuarios...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id_usuario INT NOT NULL AUTO_INCREMENT,
                nombres VARCHAR(100) NOT NULL,
                apellidos VARCHAR(100) NOT NULL,
                correo VARCHAR(150) NOT NULL UNIQUE,
                telefono VARCHAR(20),
                cargo VARCHAR(100),
                tipo_documento VARCHAR(50),
                num_documento VARCHAR(50) NOT NULL UNIQUE,
                contrasena VARCHAR(255) NOT NULL,
                foto_perfil LONGTEXT,
                fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id_usuario)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla residentes...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS residentes (
                id_residente INT NOT NULL AUTO_INCREMENT,
                nombre VARCHAR(150) NOT NULL,
                tipo_documento VARCHAR(50),
                num_documento VARCHAR(50),
                id_ubicacion INT,
                correo VARCHAR(150),
                PRIMARY KEY (id_residente),
                FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla herramientas...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS herramientas (
                id_herramienta INT NOT NULL AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT,
                estado VARCHAR(50) DEFAULT 'Buen estado',
                tipo VARCHAR(50),
                id_ubicacion INT,
                cantidad INT DEFAULT 1,
                foto VARCHAR(255),
                codigo_herramienta VARCHAR(100),
                fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id_herramienta),
                FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla herramienta_detalles...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS herramienta_detalles (
                id_detalle INT NOT NULL AUTO_INCREMENT,
                id_herramienta INT NOT NULL,
                estado VARCHAR(50),
                disponible BOOLEAN DEFAULT TRUE,
                fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
                comentario TEXT,
                contador_prestamo INT DEFAULT 0,
                PRIMARY KEY (id_detalle),
                FOREIGN KEY (id_herramienta) REFERENCES herramientas(id_herramienta) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla equipos_computo...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS equipos_computo (
                id_equipo INT NOT NULL AUTO_INCREMENT,
                nombre_persona VARCHAR(150) NOT NULL,
                cedula VARCHAR(50) NOT NULL,
                id_ubicacion INT,
                nombre_equipo VARCHAR(150) NOT NULL,
                codigo_equipo VARCHAR(100) NOT NULL,
                fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id_equipo),
                FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla equipos_movimiento...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS equipos_movimiento (
                id_movimiento INT NOT NULL AUTO_INCREMENT,
                codigo_equipo VARCHAR(100) NOT NULL,
                tipo_movimiento VARCHAR(50),
                ubicacion_origen INT,
                ubicacion_destino INT,
                fecha_movimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
                registrado_por INT,
                observacion TEXT,
                PRIMARY KEY (id_movimiento),
                FOREIGN KEY (ubicacion_origen) REFERENCES ubicaciones(id_ubicacion) ON DELETE SET NULL,
                FOREIGN KEY (ubicacion_destino) REFERENCES ubicaciones(id_ubicacion) ON DELETE SET NULL,
                FOREIGN KEY (registrado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla reporte_danos...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS reporte_danos (
                id_dano INT NOT NULL AUTO_INCREMENT,
                id_herramienta INT NOT NULL,
                id_detalle INT,
                descripcion TEXT NOT NULL,
                fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,
                reportado_por INT,
                PRIMARY KEY (id_dano),
                FOREIGN KEY (id_herramienta) REFERENCES herramientas(id_herramienta) ON DELETE CASCADE,
                FOREIGN KEY (id_detalle) REFERENCES herramienta_detalles(id_detalle) ON DELETE CASCADE,
                FOREIGN KEY (reportado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla mantenimientos...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS mantenimientos (
                id_mantenimiento INT NOT NULL AUTO_INCREMENT,
                id_herramienta INT NOT NULL,
                id_detalle INT,
                descripcion TEXT NOT NULL,
                fecha_mantenimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
                realizado_por INT,
                estado VARCHAR(50),
                tipo VARCHAR(50),
                PRIMARY KEY (id_mantenimiento),
                FOREIGN KEY (id_herramienta) REFERENCES herramientas(id_herramienta) ON DELETE CASCADE,
                FOREIGN KEY (id_detalle) REFERENCES herramienta_detalles(id_detalle) ON DELETE CASCADE,
                FOREIGN KEY (realizado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla prestamos...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS prestamos (
                id_prestamo INT NOT NULL AUTO_INCREMENT,
                id_usuario INT NOT NULL,
                id_herramienta INT NOT NULL,
                id_detalle INT,
                id_residente INT,
                id_ubicacion INT,
                fecha_prestamo DATETIME DEFAULT CURRENT_TIMESTAMP,
                fecha_devolucion DATETIME,
                estado VARCHAR(50) DEFAULT 'Activo',
                PRIMARY KEY (id_prestamo),
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                FOREIGN KEY (id_herramienta) REFERENCES herramientas(id_herramienta) ON DELETE CASCADE,
                FOREIGN KEY (id_detalle) REFERENCES herramienta_detalles(id_detalle) ON DELETE CASCADE,
                FOREIGN KEY (id_residente) REFERENCES residentes(id_residente) ON DELETE CASCADE,
                FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("Creando tabla notificaciones...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS notificaciones (
                id_notificacion INT NOT NULL AUTO_INCREMENT,
                id_usuario INT NOT NULL,
                mensaje TEXT NOT NULL,
                tipo VARCHAR(50) DEFAULT 'Info',
                leida BOOLEAN DEFAULT FALSE,
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id_notificacion),
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // Insert default locations if they don't exist
        const [ubicaciones] = await connection.query("SELECT COUNT(*) as count FROM ubicaciones");
        if (ubicaciones[0].count === 0) {
            console.log("Insertando proyectos/ubicaciones iniciales...");
            await connection.query(`
                INSERT INTO ubicaciones (nombre, descripcion) VALUES 
                ('Bodega principal', 'Bodega central de inventarios'),
                ('Salvajina', 'Proyecto Salvajina'),
                ('Urra', 'Proyecto Urra'),
                ('Ibague', 'Proyecto Ibague'),
                ('San Carlos', 'Proyecto San Carlos'),
                ('Fundación', 'Proyecto Fundación')
            `);
        }

        // Insert admin user if it doesn't exist
        const [users] = await connection.query("SELECT COUNT(*) as count FROM usuarios");
        if (users[0].count === 0) {
            console.log("Insertando administrador maestro...");
            await connection.query(`
                INSERT INTO usuarios (nombres, apellidos, correo, telefono, cargo, tipo_documento, num_documento, contrasena) 
                VALUES ('Admin', 'Sena', 'admin@sena.edu.co', '3000000000', 'Administrador', 'CC', '123456', 'Admin123*')
            `);
        }

        console.log("--- 11 Tablas creadas exitosamente ---");

    } catch (error) {
        console.error("Error al crear tablas:", error);
    } finally {
        await connection.end();
        process.exit();
    }
}

setupDatabase();
