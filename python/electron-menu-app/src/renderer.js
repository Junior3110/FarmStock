const { execFile } = require('child_process');

document.getElementById('guardar').onclick = () => {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;

    // Ejecuta el script Python y pasa los datos como argumentos
    execFile('python', ['../Tanyiro.py', nombre, apellido, telefono, correo], (error, stdout, stderr) => {
        if (error) {
            alert('Error al guardar: ' + stderr);
            return;
        }
        alert(stdout); // Muestra la respuesta del script Python
    });
};