document.addEventListener('DOMContentLoaded', function() {
    const btnIngresar = document.getElementById('btnIngresar');
    
    if (btnIngresar) {
        btnIngresar.addEventListener('click', function() {
            const usuario = document.querySelector('input[name="Usuario"]').value.trim();
            const contrasena = document.querySelector('input[name="Contrasena"]').value.trim();
            
            if (!usuario || !contrasena) {
                alert('Por favor complete todos los campos requeridos');
                return false;
            }
            
            window.location.href = 'index.html';
        });
    }
});
