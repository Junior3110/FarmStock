const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function poblar() {
    console.log("--- Iniciando Población de Base de Datos de Prueba ---");
    
    // Crear imagen dummy
    const dirUploads = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dirUploads)) {
        fs.mkdirSync(dirUploads, { recursive: true });
    }
    const dummyImageSource = path.join(__dirname, '../app/imagenes/Logo.png');
    const dummyImageDest = path.join(dirUploads, 'sample_tool.png');
    
    if (fs.existsSync(dummyImageSource)) {
        fs.copyFileSync(dummyImageSource, dummyImageDest);
        console.log("✅ Imagen de prueba copiada");
    }

    const fotoPath = '/uploads/sample_tool.png';

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '171006',
        database: 'inventario'
    });

    try {
        // Asegurarnos de tener un residente de prueba y un usuario
        const [resUsers] = await connection.query("SELECT id_usuario FROM usuarios LIMIT 1");
        const id_usuario = resUsers.length > 0 ? resUsers[0].id_usuario : 1;

        await connection.query("INSERT INTO residentes (nombre, tipo_documento, num_documento, id_ubicacion, correo) VALUES ('Residente Prueba', 'CC', '9999999', 1, 'residente@test.com') ON DUPLICATE KEY UPDATE id_residente=id_residente");
        const [resResi] = await connection.query("SELECT id_residente FROM residentes WHERE num_documento='9999999' LIMIT 1");
        const id_residente = resResi[0].id_residente;

        console.log("🏭 Creando 20 herramientas en Bodega Principal...");
        for (let i = 1; i <= 20; i++) {
            await connection.query(`
                INSERT INTO herramientas (nombre, descripcion, estado, tipo, id_ubicacion, cantidad, foto, codigo_herramienta) 
                VALUES (?, ?, 'Buen estado', 'Manual', 1, 1, ?, ?)
            `, [
                `Herramienta Bodega ${i}`, 
                `Descripción detallada de la herramienta de prueba ${i} para Bodega`,
                fotoPath, 
                `BOD-TEST-${1000+i}`
            ]);
        }

        const proyectos = [
            { id: 2, nombre: 'Salvajina' },
            { id: 3, nombre: 'Urra' },
            { id: 4, nombre: 'Ibague' },
            { id: 5, nombre: 'San Carlos' },
            { id: 6, nombre: 'Fundación' }
        ];

        console.log("🏗️ Creando 5 herramientas (y préstamos) para cada uno de los 5 proyectos (25 en total)...");
        for (const proy of proyectos) {
            for (let i = 1; i <= 5; i++) {
                // Instanciar herramienta
                const [resultH] = await connection.query(`
                    INSERT INTO herramientas (nombre, descripcion, estado, tipo, id_ubicacion, cantidad, foto, codigo_herramienta) 
                    VALUES (?, ?, 'Buen estado', 'Eléctrica', ?, 1, ?, ?)
                `, [
                    `Equipo ${proy.nombre} ${i}`, 
                    `Equipo enviado al proyecto ${proy.nombre} (Mock ${i})`,
                    proy.id,
                    fotoPath, 
                    `PRY-${proy.id}-${1000+i}`
                ]);
                
                const id_herramienta = resultH.insertId;

                // Crear un detalle
                const [resultD] = await connection.query(`
                    INSERT INTO herramienta_detalles (id_herramienta, estado, disponible, comentario)
                    VALUES (?, 'Buen estado', FALSE, 'Detalle de prueba para salida')
                `, [id_herramienta]);
                
                const id_detalle = resultD.insertId;

                // Generar Salida (Préstamo Activo)
                await connection.query(`
                    INSERT INTO prestamos (id_usuario, id_herramienta, id_detalle, id_residente, id_ubicacion, estado)
                    VALUES (?, ?, ?, ?, ?, 'Activo')
                `, [id_usuario, id_herramienta, id_detalle, id_residente, proy.id]);
            }
            console.log(`✅ ${proy.nombre} completado.`);
        }

        console.log("--- 🚀 ¡Población de datos EXITOSA! ---");
    } catch (error) {
        console.error("❌ Error al poblar:", error);
    } finally {
        await connection.end();
    }
}

poblar();
