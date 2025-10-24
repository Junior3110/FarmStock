const API_URL = "http://localhost:8080/usuario";

document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const datos = new FormData(form);
  const f = Object.fromEntries(datos);

  // aceptar varios nombres de campo para compatibilidad con tu HTML
  const pass = f.password ?? f.contrasena ?? "";
  const confirm = f.confirm_password ?? f.confirmPassword ?? "";
  if (pass !== confirm) {
    alert("Las contraseñas no coinciden ❌");
    return;
  }

  // construir payload con los nombres que indicaste
  const payload = {
    nombres: (f.nombres ?? f.nombre ?? "").trim(),
    apellidos: (f.apellidos ?? f.apellido ?? "").trim(),
    correo: (f.correo ?? f.email ?? "").trim(),
    telefono: (f.telefono ?? "").trim(),
    nombreFormacion: (f.nombre_formacion ?? f.nombreFormacion ?? "").trim(),
    numeroFicha: (f.num_ficha ?? f.numeroFicha ?? "").toString().trim(),
    numeroDocumento: (f.numero_documento ?? f.numeroDocumento ?? "").toString().trim(),
    contrasena: pass,
    cargo: (f.cargo ?? f.rol ?? "").trim(),
    tipoDocumento: (f.tipo_documento ?? f.tipoDocumento ?? "").trim()
  };

  // validación mínima frontend (ajusta según requisitos backend)
  const required = ["nombres", "apellidos", "correo", "contrasena", "cargo", "tipoDocumento", "numeroDocumento"];
  for (const k of required) {
    if (!payload[k] || payload[k].toString().trim() === "") {
      alert("Falta el campo obligatorio: " + k);
      return;
    }
  }

  console.log("Payload enviado a /usuario:", payload);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const raw = await res.text();
    let body;
    try { body = JSON.parse(raw); } catch { body = raw; }

    if (res.ok) {
      alert("Usuario registrado ✅");
      form.reset();
    } else {
      console.error("Error servidor:", res.status, body);
      const msg = (body && (body.message || body.error || JSON.stringify(body))) || `HTTP ${res.status}`;
      alert("Error servidor: " + msg);
    }
  } catch (err) {
    console.error("Error de conexión:", err);
    alert("No se pudo conectar con el servidor.");
  }
});