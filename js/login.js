document.addEventListener('DOMContentLoaded', function() {

    const btnIngresar = document.getElementById('btnIngresar');
    if (btnIngresar) {
        btnIngresar.addEventListener('click', function(event) {
            event.preventDefault(); //previene que se envie el form con los valores default

            const usuario = document.querySelector('input[id="Usuario"]').value.trim(); //obtencion de los valores de input, con el trim pa eliminar espacios en blanco
            const contrasena = document.querySelector('input[id="Contrasena"]').value.trim();

            if (!usuario || !contrasena) { //verificar campos vacíos
                alert('Por favor complete todos los campos requeridos'); //la politziaaa
                return false;
            }

            const userData = { usuario, contrasena }; //creamos nuevo objeto para meter los datos del usuario
            localStorage.setItem('userSession', JSON.stringify(userData)); // se guarda "userData" en el almacenamiento local como un JSON que se llama'userSession'
            localStorage.setItem('sessionTime', Date.now());

            window.location.href = 'index.html'; //Redirige a Index.html
        });
    }
});

