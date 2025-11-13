const API_URL = "http://localhost:8080/usuario";

document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const datos = new FormData(form);
  const f = Object.fromEntries(datos);

  const pass = f.password || "";
  const confirm = f.confirm_password || "";
  if (pass !== confirm) {
    alert("❌ Las contraseñas no coinciden");
    return;
  }

  const payload = {
    nombres: f.nombres?.trim(),
    apellidos: f.apellidos?.trim(),
    correo: f.correo?.trim(),
    telefono: f.telefono?.trim(),
    numeroDocumento: f.numero_documento?.trim(),
    contrasena: pass,
    cargo: f.cargo?.trim(),
    tipoDocumento: f.tipo_documento?.trim()
  };

  console.log("➡️ Enviando a backend:", payload);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log("⬅️ Respuesta:", res.status, text);

    if (res.ok) {
      alert("✅ Usuario registrado correctamente");
      form.reset();
    } else {
      alert(`⚠️ Error (${res.status}): ${text}`);
    }
  } catch (err) {
    console.error("💥 Error de conexión:", err);
    alert("🚫 No se pudo conectar con el servidor.");
  }
});
