const mysql = require('mysql2/promise');

async function testFK() {
    const conn = await mysql.createConnection({host:'localhost',user:'root',password:'171006',database:'inventario'});
    try {
        const [u] = await conn.query("SELECT id_usuario FROM usuarios");
        console.log("Usuarios:", u);
        const [ub] = await conn.query("SELECT id_ubicacion, nombre FROM ubicaciones");
        console.log("Ubicaciones:", ub);
        
        const testUserId = u[0].id_usuario;
        const testUbOrig = ub[0].id_ubicacion;
        const testUbDest = ub[1].id_ubicacion;
        
        console.log("Inserting for User ID:", testUserId, "Orig:", testUbOrig, "Dest:", testUbDest);
        await conn.query(`
            INSERT INTO equipos_movimiento (codigo_equipo, tipo_movimiento, ubicacion_origen, ubicacion_destino, registrado_por) 
            VALUES ('TEST-COD', 'Salida', ?, ?, ?)`, 
            [testUbOrig, testUbDest, testUserId]
        );
        console.log("INSERT OK!");
    } catch(e) {
        console.error("SQL ERROR:", e.sqlMessage);
    }
    await conn.end();
}
testFK();
