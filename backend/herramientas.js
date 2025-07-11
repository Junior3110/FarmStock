class Herramienta {
    constructor(id, nombre, descripcion, cantidad, estado, codigoQR) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.estado = estado; // "Disponible", "Prestada", "En mantenimiento"
        this.codigoQR = codigoQR; // valor del QR (puede ser ID o serial)
    }

    actualizarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    reducirCantidad(cantidadUsada) {
        if (cantidadUsada <= this.cantidad) {
            this.cantidad -= cantidadUsada;
        } else {
            throw new Error("Cantidad insuficiente en inventario.");
        }
    }

    aumentarCantidad(cantidadDevuelta) {
        this.cantidad += cantidadDevuelta;
    }1
}



// Clase: Usuario (instructor o aprendiz)
class Usuario {
    constructor(id, nombre, tipo, codigoQR) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo; // "Instructor" o "Aprendiz"
        this.codigoQR = codigoQR;
    }
}



// Clase: Movimiento (registro de entrada/salida)
class Movimiento {
    constructor(id, herramienta, usuario, tipo, fecha) {
        this.id = id;
        this.herramienta = herramienta;
        this.usuario = usuario;        
        this.tipo = tipo;               // "Entrada" o "Salida"
        this.fecha = fecha || new Date();
    }

    obtenerResumen() {
        return '${this.tipo} - ${this.herramienta.nombre} por ${this.usuario.nombre} el ${this.fecha.toLocaleString()}';
    }
}

// Ejemplo de uso
const h1 = new Herramienta(1, "Azadón", "Herramienta agrícola manual", 10, "Disponible", "QR-H001");
const u1 = new Usuario(1, "Carlos Ruiz", "Instructor", "QR-U001");

const movimiento1 = new Movimiento(1, h1, u1, "Salida");
console.log(movimiento1.obtenerResumen());

// Simular devolución
h1.aumentarCantidad(1);
h1.actualizarEstado("Disponible");