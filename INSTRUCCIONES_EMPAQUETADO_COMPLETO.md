# Empaquetado Completo de FarmStock con MySQL y Java

## ⚠️ IMPORTANTE: Tamaño del instalador

Incluir MySQL y Java hará que el instalador pese aproximadamente **500MB - 800MB** debido a:
- MySQL portable: ~200MB
- Java JRE portable: ~180MB
- Aplicación + Backend: ~100MB

---

## 📦 Opción 1: Instalador con todo incluido (Recomendada)

### Paso 1: Descargar dependencias portables

1. **Java JRE Portable** (OpenJDK):
   - Descargar de: https://adoptium.net/temurin/releases/?version=17&os=windows&arch=x64
   - Archivo: `OpenJDK17U-jre_x64_windows_hotspot_17.X.X_XX.zip`
   - Extraer a: `C:\proyecto\FarmStock\portable\java`

2. **MySQL Portable**:
   - Descargar de: https://dev.mysql.com/downloads/mysql/ (ZIP Archive)
   - Archivo: `mysql-8.x.xx-winx64.zip`
   - Extraer a: `C:\proyecto\FarmStock\portable\mysql`

### Paso 2: Estructura de carpetas

```
C:\proyecto\FarmStock\
├── portable/
│   ├── java/
│   │   └── bin/
│   │       └── java.exe
│   └── mysql/
│       ├── bin/
│       │   └── mysqld.exe
│       └── data/
├── main.js
├── setup-database.js
└── package.json
```

---

## 📦 Opción 2: Instalador ligero con descarga automática (Alternativa)

Crear un instalador que descargue MySQL y Java automáticamente durante la instalación.

**Ventajas:**
- Instalador inicial pequeño (~100MB)
- Siempre descarga versiones actualizadas
- Mejor para distribución online

**Desventajas:**
- Requiere conexión a internet
- Instalación más lenta

---

## 🔧 Implementación Recomendada

Dado el tamaño, te recomiendo **Opción 3: Instalador modular**:

1. **Instalador principal** - FarmStock.exe (100MB)
2. **Pack de dependencias** - FarmStock-Dependencies.exe (400MB)
   - MySQL portable
   - Java portable
   - Script de configuración

El usuario ejecuta primero Dependencies y luego FarmStock.

---

## ⚡ Solución práctica AHORA

Como crear un empaquetado completo desde cero es complejo y pesado, te propongo:

### Crear un paquete ZIP con todo incluido:

```
FarmStock-Completo.zip (500-800MB)
├── FarmStock-Setup.exe          (tu instalador actual)
├── jre-17-windows-x64.zip       (Java portable)
├── mysql-8-windows-x64.zip      (MySQL portable)
└── INSTRUCCIONES.txt            (pasos de instalación)
```

**INSTRUCCIONES.txt** contendrá:
1. Extraer Java y MySQL a C:\FarmStock\runtime
2. Ejecutar setup-mysql.bat (configurar MySQL)
3. Ejecutar FarmStock-Setup.exe
4. ¡Listo!

---

## 💡 ¿Qué prefieres?

1. **Empaquetado automático completo** (500-800MB, un solo .exe, toma 2-3 horas implementar)
2. **Paquete ZIP modular** (más rápido, toma 30 min, el usuario extrae y ejecuta scripts)
3. **Mantener actual + documento de requisitos** (ya está listo, más profesional)

¿Cuál prefieres que implemente?
