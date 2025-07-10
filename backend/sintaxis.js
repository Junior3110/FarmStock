/*var nombre = "cesar";// var se usa para declarar variables globales la puedo usar en cualquier parte del codigo 

let apellido = "Diaz"; // variable de alcance local solo puede ser usada dentro del bloque donde fue declarada y le puedo cambiar su valor

apellido = "garcia"; // esta es la diferencia con const ya que con esta no se puede cambiar su valor

{
    let apellido = "diaz";
}

const edad = 9; // siempre va a valer lo mismo por eso es usado para cosas constantes como el numero pi
  // no se puede cambiar el valor de una constante osea const

{ 
    const edad = 12; // 
}

console.log("Hola desde sintaxis.js");
METODO MATH

let numeroRamdom = Math.random();
console.log(numeroRamdom);

*/ 

/*  cadena de texto -----
let nombre = "junior"; 
let apellido = "diaz"; 
console.log(nombre + " " + apellido); 

*/ 
// prompt() no se puede usar en node 

const prompt = require('prompt-sync')();
let nombre = prompt("Ingresa su nombre: "); 


let mayor = true;
while (mayor){ 
  let numero = Number(prompt("Ingresa tu edad "));
  if (numero > 18){ 
  console.log(nombre, "Es mayor de edad"); 
  mayor = false; 
}else{
  console.log(nombre, "Es menor de edad");
  
}

}