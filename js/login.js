SessionManager = {
    guardarSesion: function(userData) {
        localStorage.setItem('userSession', JSON.stringify(userData));
        localStorage.setItem('sessionTime', new Date().getTime());
    },
    
    obtenerSesion: function() {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session) : null;
    },
    
    cerrarSesion: function() {
        localStorage.removeItem('userSession');
        localStorage.removeItem('sessionTime');
    },
    
    redirigirSiNoHaySesion: function() {
        if (!this.estaLogueado()) {
            window.location.href = 'login.html';
        }
    },
        
    estaLogueado: function() {
        return this.obtenerSesion() !== null;
    }

    
};

document.addEventListener('DOMContentLoaded', function() {
    const btnIngresar = document.getElementById('btnIngresar');
    
    if (btnIngresar) {
        btnIngresar.addEventListener('click', function() {
            const usuario = document.getElementById('Usuauario').value.trim();
            const contrasena = document.getElementById('Contraseña').value.trim();
            
            if (!usuario || !contrasena) {
                alert('Por favor complete todos los campos requeridos');
                return false;
            }
            
            // Guardar la sesión del usuario
            window.SessionManager.guardarSesion({
                username: usuario
            });
            
            window.location.href = 'index.html';
        });
    }
});

/* Aca una funcioncita para que el boton de Ingresar solo esté disponible luego de rellenar los campos*/
document.addEventListener('DOMContentLoaded', function () {
  const btnIngresar = document.getElementById('btnIngresar');
  const inputs = document.querySelectorAll('input[name="Usuario"], input[name="Contrasena"]');

  function verificarCampos() {
    // Verificar que todos los campos tengan texto no vacío
    const todosCompletos = Array.from(inputs).every(input => input.value.trim() !== '');
    btnIngresar.disabled = !todosCompletos;
  }

  // Inicializar botón deshabilitado
  btnIngresar.disabled = true;

  // Agregar evento input a cada campo para verificar cambios
  inputs.forEach(input => {
    input.addEventListener('input', verificarCampos);
  });
});
