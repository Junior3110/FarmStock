const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ruta al instalador de MySQL (ajusta el nombre si es necesario)
const installerPath = path.join(__dirname, 'mysql-installer-community-8.0.44.0.msi');
// Carpeta con los archivos .sql
const sqlFolder = path.join(__dirname, 'sql');

// Cambia estos datos según tu configuración
const MYSQL_USER = 'root';
const MYSQL_PASSWORD = 'Cesar;10'; // Cambia esto por la contraseña real

// 1. Instalar MySQL (manual, solo si no está instalado)
console.log('Abriendo instalador de MySQL...');
exec(`start "" "${installerPath}"`, (err) => {
  if (err) {
    console.error('Error ejecutando el instalador de MySQL:', err);
    return;
  }
  console.log('Instalador de MySQL abierto. Instala MySQL y configura el usuario root.');
  // 2. Restaurar cada archivo .sql
  fs.readdirSync(sqlFolder).forEach(file => {
    if (file.endsWith('.sql')) {
      const sqlFile = path.join(sqlFolder, file);
      const restoreCmd = `mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} < "${sqlFile}"`;
      exec(restoreCmd, (err) => {
        if (err) {
          console.error(`Error restaurando ${file}:`, err);
        } else {
          console.log(`Restaurado: ${file}`);
        }
      });
    }
  });
});
