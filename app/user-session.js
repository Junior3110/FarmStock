// user-session.js - Gestión de sesión de usuario
(function() {
  'use strict';
  
  // Obtener datos del usuario actual
  function getCurrentUser() {
    try {
      const userData = localStorage.getItem('fs_usuario_actual');
      console.log('🔍 Leyendo localStorage fs_usuario_actual:', userData);
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log('✅ Usuario parseado:', parsed);
        return parsed;
      }
    } catch (e) {
      console.error('❌ Error al leer datos de usuario:', e);
    }
    console.warn('⚠️ No hay datos de usuario en localStorage');
    return null;
  }
  
  // Actualizar nombre del usuario en el header
  function updateUserName() {
    const user = getCurrentUser();
    // Buscar el elemento de bienvenida
    const bienvenidaElement = document.querySelector('.bienvenida p strong');
    if (bienvenidaElement && user && user.nombres) {
      bienvenidaElement.textContent = `¡Hola ${user.nombres}!`;
      console.log('Nombre actualizado:', user.nombres);
    } else if (bienvenidaElement) {
      // Si no hay datos del usuario completo, intentar con documento
      const documento = localStorage.getItem('documento');
      if (documento) {
        console.log('Usuario sin datos completos, usando documento');
        // Mantener el nombre por defecto o mostrar documento
      }
    }

    // Mostrar foto de perfil en el avatar de bienvenida si existe
    const avatarBienvenida = document.querySelector('.bienvenida img.foto-usuario');
    const userPhoto = (user && user.fotoPerfil) || localStorage.getItem('fs_usuario_foto');
    if (avatarBienvenida && userPhoto) {
      avatarBienvenida.src = userPhoto;
    }

    // Actualizar el nombre en el header superior si existe
    const headerName = document.querySelector('header .user-name');
    if (headerName && user && user.nombres) {
      headerName.textContent = `¡Hola ${user.nombres}!`;
    }
  }
  
  // Verificar si el usuario está logueado
  function checkAuth() {
    // Solo verificar si no estamos en páginas públicas
    const isPublicPage = window.location.pathname.indexOf('login.html') !== -1 || 
                         window.location.pathname.indexOf('registro-persona.html') !== -1 ||
                         window.location.pathname.indexOf('quienes-somos.html') !== -1;
    
    if (isPublicPage) {
      return; // No verificar autenticación en páginas públicas
    }
    
    const user = getCurrentUser();
    const documento = localStorage.getItem('documento');
    
    // Auth check logic can be added here if needed
  }
  
  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      updateUserName();
      checkAuth();
    });
  } else {
    updateUserName();
    checkAuth();
  }
  
  // Exportar funciones globales
  window.FSUserSession = {
    getCurrentUser: getCurrentUser,
    updateUserName: updateUserName,
    checkAuth: checkAuth,
    logout: function() {
      localStorage.removeItem('fs_usuario_actual');
      localStorage.removeItem('fs_usuario_foto');
      localStorage.removeItem('documento');
      localStorage.removeItem('rol');
      window.location.replace('login.html');
    }
  };
  
})();
