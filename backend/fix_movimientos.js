const mysql = require('mysql2/promise');

async function fixMovimientos() {
    console.log("--- Reparando Movimientos ---");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '171006',
        database: 'inventario'
    });

    try {
        const [resUsers] = await connection.query("SELECT id_usuario FROM usuarios LIMIT 1");
        let id_usuario = null;
        if (resUsers.length > 0) {
            id_usuario = resUsers[0].id_usuario;
        } else {
            console.log("No hay usuarios. Creando uno de emergencia.");
            const [insU] = await connection.query("INSERT INTO usuarios (nombres, apellidos, correo, num_documento, contrasena) VALUES ('Test', 'User', 'test@example.com', '99999999', '123')");
            id_usuario = insU.insertId;
        }

        const proyectos = [2, 3, 4, 5, 6];

        for (const pid of proyectos) {
            for (let i = 1; i <= 5; i++) {
                const codigo = `PRY-${pid}-${1000+i}`;
                await connection.query(`
                    INSERT INTO equipos_movimiento (codigo_equipo, tipo_movimiento, ubicacion_origen, ubicacion_destino, registrado_por, observacion)
                    VALUES (?, 'Salida a Proyecto', 1, ?, ?, 'Sembrado Automático QA')
                `, [codigo, pid, id_usuario]);
            }
        }

        console.log("✅ 25 Movimientos registrados correctamente asociando al usuario:", id_usuario);
    } catch (e) {
        console.error(e);
    } finally {
        await connection.end();
    }
}

fixMovimientos();
