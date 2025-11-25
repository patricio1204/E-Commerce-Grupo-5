document.addEventListener('DOMContentLoaded', function() {

    const btnIngresar = document.getElementById('btnIngresar');
    if (btnIngresar) {

        btnIngresar.addEventListener('click', async function(event) {
            event.preventDefault(); //previene que se envie el form con los valores default

            const usuario = document.querySelector('input[id="Usuario"]').value.trim(); 
            const contrasena = document.querySelector('input[id="Contrasena"]').value.trim();

            if (!usuario || !contrasena) { 
                alert('Por favor complete todos los campos requeridos'); 
                return false;
            }
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: usuario, password: contrasena })
                });
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userSession', JSON.stringify({ usuario }));
                    localStorage.setItem('sessionTime', Date.now());
                    window.location.href = 'index.html';
                } else if (response.status === 401) {
                    const errorData = await response.json();
                    alert(errorData.message || 'Usuario y/o contraseña inválidas');
                } else {
                    alert('Error en la autenticación. Intente más tarde.');
                }
            } catch (error) {
                console.error('Error en la solicitud de login:', error);
                alert('Error de red. Intente más tarde.');
            }
        });
    }
});
