import pymongo
import pandas as pd  # Puedes importar aquí o al inicio del archivo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["mi_base"]
agenda = db["mi_agenda"]

print("Bienvenido a la agenda")

while True:
    print("\n¿Qué deseas realizar?")
    print("1. Ingresar un registro")
    print("2. Mostrar los registros")
    print("3. Borrar Registro")
    print("4. Salir")
    opcion = input("Selecciona una opción: ")

    if not opcion.isdigit():
        print("Por favor ingresa un número válido.")
        continue

    opcion = int(opcion)

    match opcion:
        case 1:
            nombre = input("Ingrese su nombre: ")
            while nombre == "" or nombre.isnumeric():
                print("El nombre no puede estar vacío y no debe llevar números")
                nombre = input("Ingrese su nombre: ")

            apellido = input("Ingrese su apellido: ")
            while apellido == "" or apellido.isnumeric():
                print("El apellido no puede estar vacío y no debe llevar números")
                apellido = input("Ingrese su apellido: ")

            telefono = input("Ingrese su teléfono: ")
            while telefono == "" or not telefono.isdigit():
                print("El teléfono no puede estar vacío y debe contener solo números")
                telefono = input("Ingrese su teléfono: ")
            telefono = int(telefono)

            correo = input("Ingrese su correo: ")
            while correo == "" or "@" not in correo or ".com" not in correo:
                print("El correo no puede estar vacío y debe contener un '@' y '.com'")
                correo = input("Ingrese su correo: ")

            registro = {
                "nombre": nombre,
                "apellido": apellido,
                "telefono": telefono,
                "correo": correo
            }
            agenda.insert_one(registro)
            print("Registro guardado correctamente.")

        case 2:
            registros = list(agenda.find({}, {"_id": 0}))  # Excluye el campo _id
            if registros:
                df = pd.DataFrame(registros)
                print(df)
            else:
                print("No hay registros en la agenda.")

        case 3:
            nombre = input("Ingrese el nombre del registro a borrar: ")
            resultado = agenda.delete_one({"nombre": nombre})
            if resultado.deleted_count > 0:
                print("Registro borrado correctamente.")
            else:
                print("No se encontró el registro.")

        case 4:
            print("¡Hasta luego!")
            break

        case _:
            print("Opción inválida.")