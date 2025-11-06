document.addEventListener('DOMContentLoaded', function() {
    const contenedor = document.querySelector('main .container');
    const sesionUsuario = localStorage.getItem('userSession');
    let datosUsuario = {};
    if (sesionUsuario) {
        datosUsuario = JSON.parse(sesionUsuario);
    }

    // Imagen de perfil por defecto
    const imagenPorDefecto = 'img/img_perfil.png';
    const imagenPerfil = datosUsuario.imagenPerfil || imagenPorDefecto;

    const htmlPerfil = `
        <div class="row">
            <div class="col-md-4 text-center">
                <h4 class="foto-perfil-title">Foto de Perfil</h4>
                <img id="imagen-perfil" src="${imagenPerfil}" alt="Foto de Perfil" class="img-fluid rounded-circle mb-3" style="max-width: 200px;">
                <div id="subida-foto" class="dropzone border rounded p-3">
                    <div class="dz-message">Arrastra una imagen aquí o haz clic para seleccionar</div>
                </div>
                <div class="mt-2">
                    <button id="btn-aceptar" class="btn btn-outline-success me-2" title="Aceptar imagen">✔</button>
                    <button id="btn-rechazar" class="btn btn-outline-danger" title="Rechazar imagen">✖</button>
                </div>
            </div>
            <div class="col-md-8">
                <h4>Información Personal</h4>
                <form id="formulario-perfil">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" value="${datosUsuario.nombre || ''}" placeholder="Ingresa tu nombre">
                    </div>
                    <div class="mb-3">
                        <label for="apellido" class="form-label">Apellido</label>
                        <input type="text" class="form-control" id="apellido" value="${datosUsuario.apellido || ''}" placeholder="Ingresa tu apellido">
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" value="${datosUsuario.email || ''}" placeholder="Ingresa tu email">
                    </div>
                    <div class="mb-3">
                        <label for="telefono" class="form-label">Teléfono de Contacto</label>
                        <input type="tel" class="form-control" id="telefono" value="${datosUsuario.telefono || ''}" placeholder="Ingresa tu teléfono">
                    </div>
                    <button type="submit" class="btn btn-primary" id="guardar-cambios">Guardar Cambios</button>
                </form>
            </div>
        </div>
    `;

    contenedor.innerHTML = htmlPerfil;

    // Inicializar Dropzone
    const opcionesDz = {
        url: "/", // No se usa ya que manejamos localmente
        autoQueue: false,
        maxFiles: 1,
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        dictDefaultMessage: "Arrastra una imagen aquí o haz clic para seleccionar",
        dictRemoveFile: "Eliminar",
        init: function() {
            this.on("addedfile", function(archivo) {
                // Leer el archivo y mostrar instantáneamente
                const lector = new FileReader();
                lector.onload = function(e) {
                    imagenTemporal = e.target.result;
                    document.getElementById('imagen-perfil').src = imagenTemporal;
                };
                lector.readAsDataURL(archivo);
            });
            this.on("removedfile", function() {
                // Restablecer a la imagen guardada
                document.getElementById('imagen-perfil').src = datosUsuario.imagenPerfil || imagenPorDefecto;
                imagenTemporal = null;
            });
        }
    };
    const miDropzone = new Dropzone("#subida-foto", opcionesDz);

    let imagenTemporal = null;

    // Botones aceptar y rechazar imagen
    document.getElementById('btn-aceptar').addEventListener('click', function() {
        if (imagenTemporal) {
            datosUsuario.imagenPerfil = imagenTemporal;
            localStorage.setItem('userSession', JSON.stringify(datosUsuario));
            miDropzone.removeAllFiles();
            imagenTemporal = null;
            alert('Imagen de perfil actualizada.');
        }
    });

    document.getElementById('btn-rechazar').addEventListener('click', function() {
        miDropzone.removeAllFiles();
        imagenTemporal = null;
        document.getElementById('imagen-perfil').src = datosUsuario.imagenPerfil || imagenPorDefecto;
        alert('Cambio de imagen cancelado.');
    });

    // Precargar email en el campo email la primera vez que se ingresa
    if (!datosUsuario.email) {
        const sesionEmail = localStorage.getItem('userEmail');
        if (sesionEmail) {
            datosUsuario.email = sesionEmail;
            document.getElementById('email').value = sesionEmail;
        }
    }

    // Guardar cambios en localStorage al hacer clic en el botón
    document.getElementById('guardar-cambios').addEventListener('click', function(event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;

        // Validar que el email contenga '@'
        if (!email.includes('@')) {
            alert('Mail no valido');
            return;
        }

        datosUsuario.nombre = nombre;
        datosUsuario.apellido = apellido;
        datosUsuario.email = email;
        datosUsuario.telefono = telefono;

        localStorage.setItem('userSession', JSON.stringify(datosUsuario));
        alert('Cambios guardados exitosamente.');
    });
});
