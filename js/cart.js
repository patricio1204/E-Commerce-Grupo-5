//Cuando la página termina de cargar, se ejecutan varias funciones iniciales:
document.addEventListener("DOMContentLoaded", function () {
  mostrarCarrito(); //arma dinámicamente todo el contenido del carrito
  agregarEventosCantidad(); //permite actualizar cantidades
  agregarEventosEliminar();
  agregarModalCheckout(); //que activa los modales necesarios para el proceso de compra.
});


function mostrarCarrito() {
  //Primero obtiene los productos guardados desde local storage:
  const productosEnCarrito = JSON.parse(localStorage.getItem("cartProducts")) || [];
  const contenedorPrincipal = document.querySelector("main .container");

  //Si el carrito está vacío, muestra un mensaje informativo y un botón para volver al catálogo. 
  // Si sí hay productos, comienza a construir todo el HTML del carrito.
  /*Por cada artículo crea una tarjeta con la imagen, el nombre, el precio unitario, un input para modificar la cantidad y un subtotal que se recalcula cuando cambia la cantidad. Además, agrega el botón para eliminar cada producto:*/

  if (productosEnCarrito.length === 0) {
    contenedorPrincipal.innerHTML = `
      <div class="row justify-content-center mt-5">
        <div class="col-md-8">
          <div class="alert alert-info text-center" role="alert">
            <h4 class="alert-heading">Carrito vacío</h4>
            <p>No hay productos en tu carrito de compras.</p>
            <hr />
            <p class="mb-0">Visita nuestro <a href="index.html" class="alert-link">catálogo</a> para agregar productos.</p>
          </div>
        </div>
      </div>`;
    return;
  }  

  /*armado del HTML del Carrito*/

  let html = `<h2 class="mb-4 text-center">Carrito de Compras</h2>
              <div id="productos-container">`;

  let totalProductos = 0;

  productosEnCarrito.forEach((producto, indice) => {
    const subtotalProducto = producto.subtotal || producto.cost * producto.quantity;
    totalProductos += subtotalProducto;

    html += crearCardProducto(producto, indice, subtotalProducto);
  });

  html += `</div>`; // cierre productos

    /*Después de listar los productos, la función incorpora diferentes secciones necesarias para completar la compra: */

  html += crearHTMLTipoEnvio(); //el usuario elige entre Premium, Express o Standard
  html += crearHTMLDireccion(); //Cada campo (departamento, localidad, calle, etc) tiene su propio mensaje de error y validación personalizada.
  html += crearHTMLFormaPago(); //El usuario puede elegir entre tarjeta de crédito o transferencia bancaria. Si elige tarjeta, se abre un modal con los campos de número de tarjeta, nombre, fecha de vencimiento y CVV. Estos datos también incluyen validaciones que se activan cuando el usuario deja un campo vacío.

  //El carrito también incluye varios modales:
  html += crearModalPagoTarjeta(); //modal para ingresar datos de tarjeta de crédito
  html += crearModalErrores(); //para mostrar mensajes de error cuando falta completar algún dato obligatorio
  html += crearModalExito(); //muestra cuando la compra se completa exitosamente
  html += crearHTMLCostos(); //muestra el subtotal, costo de envío y total a pagar, que se actualizan dinámicamente según la cantidad y tipo de envío seleccionado
  html += crearBotonesFinales(); //botones para seguir comprando o finalizar la compra

  //Finalmente, inserta todo el HTML generado en el contenedor principal de la página y llama a una función para inicializar los eventos necesarios después del renderizado (297)

  contenedorPrincipal.innerHTML = html;

  inicializarEventosPostRender(totalProductos);
}


/*BLOQUES DE CREACIÓN DE HTML:*/

function crearCardProducto(producto, indice, subtotal) {
  return `
    <div class="card mb-3 shadow-sm rounded-3">
      <div class="row g-0 align-items-center">
        <div class="col-md-3 text-center p-3">
          <img src="${producto.image}" alt="${producto.name}" class="img-fluid rounded" style="max-height: 140px;">
        </div>

        <div class="col-md-6">
          <div class="card-body">
            <h5 class="card-title mb-2">${producto.name}</h5>
            <p class="mb-1 text-muted">Precio unitario: $${producto.cost.toFixed(2)} ${producto.currency}</p>

            <form class="cart-item-form d-flex align-items-center" data-index="${indice}">
              <div class="me-3" style="width: 100px;">
                <label class="form-label fw-bold">Cantidad</label>
                <input type="number" class="form-control product-quantity"
                       min="1" value="${producto.quantity}" required>
              </div>

              <div class="flex-grow-1 ms-3">
                <label class="form-label fw-bold">Subtotal</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="text" class="form-control product-subtotal"
                         value="${subtotal.toFixed(2)}" readonly>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="col-md-3 text-center">
          <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar"
                  data-index="${indice}">
            <i class="fas fa-trash-alt fa-lg"></i>
          </button>
        </div>
      </div>
    </div>`;
}

/*Tipo de envío*/
function crearHTMLTipoEnvio() {
  return `
    <div class="card mb-4">
      <div class="card-header"><h4>Tipo de envío</h4></div>
      <div class="card-body">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="tipoEnvio" value="0.15" checked>
          <label class="form-check-label">Premium 2 a 5 días (15%)</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="tipoEnvio" value="0.07">
          <label class="form-check-label">Express 5 a 8 días (7%)</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="tipoEnvio" value="0.05">
          <label class="form-check-label">Standard 12 a 15 días (5%)</label>
        </div>
      </div>
    </div>`;
}

/*Dirección*/
function crearHTMLDireccion() {
  return `
    <div class="card mb-4">
      <div class="card-header"><h4>Dirección de envío</h4></div>
      <div class="card-body">
        ${crearCampo("departamento")}
        ${crearCampo("localidad")}
        ${crearCampo("calle")}
        ${crearCampo("numero")}
        ${crearCampo("esquina")}
      </div>
    </div>`;
}

function crearCampo(id) {
  return `
    <div class="mb-3">
      <label class="form-label">${capitalize(id)}</label>
      <input type="text" id="${id}" class="form-control" required>
      <div class="invalid-feedback" id="error-${id}">Este campo es obligatorio.</div>
    </div>`;
}

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/*Pago*/
function crearHTMLFormaPago() {
  return `
    <div class="card mb-4">
      <div class="card-header"><h4>Forma de pago</h4></div>
      <div class="card-body">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="metodoPago"
                 id="tarjetaCredito" value="tarjetaCredito"
                 data-bs-toggle="modal" data-bs-target="#modalPago">
          <label class="form-check-label">Tarjeta de crédito</label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="radio" name="metodoPago"
                 id="transferenciaBancaria" value="transferenciaBancaria">
          <label class="form-check-label">Transferencia bancaria</label>
        </div>

        <div class="mt-3">
          <span id="metodoPagoSeleccionado">
            No se ha seleccionado ninguna forma de pago.
          </span>
        </div>
      </div>
    </div>`;
}

/*Modal Tarjeta*/
function crearModalPagoTarjeta() {
  return `
    <div class="modal fade" id="modalPago" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Datos de Tarjeta de Crédito</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            ${crearCampo("numeroTarjeta")}
            ${crearCampo("nombreTarjeta")}
            ${crearCampo("fechaVencimiento")}
            ${crearCampo("cvv")}
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary"
                    data-bs-dismiss="modal">Cerrar</button>
            <button type="button" id="btnGuardarTarjeta"
                    class="btn btn-primary">Guardar</button>
          </div>
        </div>
      </div>
    </div>`;
}

/*Modal Errores*/
function crearModalErrores() {
  return `
    <div class="modal fade" id="modalErrores" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Errores en el formulario</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="modalErroresBody"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary"
                    data-bs-dismiss="modal">Aceptar</button>
          </div>
        </div>
      </div>
    </div>`;
}

/*Modal Éxito*/
function crearModalExito() {
  return `
    <div class="modal fade" id="modalExito" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Compra Exitosa</h5>
            <button type="button" class="btn-close"
                    data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body"><p>Gracias por su compra!</p></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary"
                    data-bs-dismiss="modal">Aceptar</button>
          </div>
        </div>
      </div>
    </div>`;
}

/*Costos*/
function crearHTMLCostos() {
  return `
    <div class="card mb-4">
      <div class="card-header"><h4>Costos</h4></div>
      <div class="card-body">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between">
            Subtotal <span id="costoSubtotal"></span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            Costo de envío <span id="costoEnvio"></span>
          </li>
          <li class="list-group-item d-flex justify-content-between fw-bold">
            Total <span id="costoTotal"></span>
          </li>
        </ul>
      </div>
    </div>`;
}

/*Botones finales*/
function crearBotonesFinales() {
  return `
    <div class="d-flex justify-content-between mt-4 mb-5">
      <a href="index.html" class="btn btn-outline-secondary btn-lg">
        <i class="fas fa-arrow-left me-2"></i> Seguir Comprando
      </a>

      <button class="btn btn-primary btn-lg" id="btnFinalizarCompra">
        Finalizar compra
      </button>
    </div>`;
}


/*EVENTOS DESPUÉS DE RENDERIZAR:
*/
function inicializarEventosPostRender(totalProductos) {

  const badge = document.getElementById("carrito-total");
  if (badge) badge.textContent = `Total a pagar: $${totalProductos.toFixed(2)}`;

  agregarEventosCantidad();
  actualizarCostos();

  document.querySelectorAll('input[name="tipoEnvio"]')
    .forEach(r => r.addEventListener("change", actualizarCostos));

  document.querySelectorAll('input[name="metodoPago"]')
    .forEach(r => r.addEventListener("change", actualizarPagoSeleccionado));

  agregarValidacionTarjeta();
  agregarValidacionDireccion();
  agregarEventoFinalizarCompra();
}


/* VALIDACIONES*/

function agregarValidacionTarjeta() {
  const campos = [
    "numeroTarjeta",
    "nombreTarjeta",
    "fechaVencimiento",
    "cvv"
  ];

  campos.forEach(id => {
    const input = document.getElementById(id);
    const error = document.getElementById(`error-${id}`);

    if (!input) return;

    input.addEventListener("blur", () => {
      if (!input.value.trim()) {
        input.classList.add("is-invalid");
        error.style.display = "block";
      }
    });

    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
      error.style.display = "none";
    });
  });

  const btnGuardar = document.getElementById("btnGuardarTarjeta");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      let valido = true;

      campos.forEach(id => {
        const input = document.getElementById(id);
        const error = document.getElementById(`error-${id}`);

        if (!input.value.trim()) {
          valido = false;
          input.classList.add("is-invalid");
          error.style.display = "block";
        }
      });

      if (valido) {
        bootstrap.Modal.getInstance(
          document.getElementById("modalPago")
        ).hide();

        document.getElementById("tarjetaCredito").checked = true;
        document.getElementById("metodoPagoSeleccionado").textContent =
          "Tarjeta de crédito";
      }
    });
  }
}

function agregarValidacionDireccion() {
  ["departamento", "localidad", "calle", "numero", "esquina"]
    .forEach(id => {
      const input = document.getElementById(id);
      const error = document.getElementById(`error-${id}`);

      if (!input) return;

      input.addEventListener("input", () => {
        if (input.value.trim()) {
          input.classList.remove("is-invalid");
          error.style.display = "none";
        }
      });
    });
}

function actualizarPagoSeleccionado() {
  const span = document.getElementById("metodoPagoSeleccionado");
  span.textContent =
    this.value === "tarjetaCredito"
      ? "Tarjeta de crédito"
      : "Transferencia bancaria";
}


/*COSTOS*/
function actualizarCostos() {
  const productos = JSON.parse(localStorage.getItem("cartProducts")) || [];

  const subtotal = productos.reduce(
    (sum, p) => sum + (p.subtotal || p.cost * p.quantity),
    0
  );

  const envioSel = document.querySelector('input[name="tipoEnvio"]:checked');
  const porcentaje = envioSel ? parseFloat(envioSel.value) : 0.15;

  const costoEnvio = subtotal * porcentaje;
  const total = subtotal + costoEnvio;

  document.getElementById("costoSubtotal").textContent =
    `$${subtotal.toFixed(2)}`;
  document.getElementById("costoEnvio").textContent =
    `$${costoEnvio.toFixed(2)}`;
  document.getElementById("costoTotal").textContent =
    `$${total.toFixed(2)}`;
}


/*FINALIZAR COMPRA*/
function agregarEventoFinalizarCompra() {
  const btn = document.getElementById("btnFinalizarCompra");

  if (!btn) return;

  btn.addEventListener("click", function (e) {
    e.preventDefault();

    if (validarCheckout()) {
      const modal = new bootstrap.Modal(document.getElementById("modalExito"));
      modal.show();

      localStorage.removeItem("cartProducts");
      window.dispatchEvent(new Event("cart-updated"));

      mostrarCarrito();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  });
}


/* FUNCIÓN validarCheckout*/
function validarCheckout() {
  let esValido = true;
  const mensajes = [];
  let erroresDireccion = false;
  let erroresPago = false;

  // Dirección
  ["departamento", "localidad", "calle", "numero", "esquina"]
    .forEach(id => {
      const input = document.getElementById(id);

      if (!input.value.trim()) {
        erroresDireccion = true;
        esValido = false;
        input.classList.add("is-invalid");
        document.getElementById(`error-${id}`).style.display = "block";
      }
    });

  // Cantidad
  document.querySelectorAll(".product-quantity").forEach((inp, i) => {
    if (!inp.value || inp.value < 1) {
      esValido = false;
      mensajes.push(`La cantidad del producto ${i + 1} debe ser mayor a 0.`);
    }
  });

  // Envío
  if (!document.querySelector('input[name="tipoEnvio"]:checked')) {
    esValido = false;
    mensajes.push("Debe seleccionar un tipo de envío.");
  }

  // Pago
  const pago = document.querySelector('input[name="metodoPago"]:checked');
  if (!pago) {
    esValido = false;
    erroresPago = true;
  } else if (pago.value === "tarjetaCredito") {
    ["numeroTarjeta", "nombreTarjeta", "fechaVencimiento", "cvv"]
      .forEach(id => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
          esValido = false;
          mensajes.push(`El campo ${id} es obligatorio.`);
        }
      });
  }

  // Mensaje general
  if (erroresDireccion && erroresPago) {
    mensajes.push("Debe completar la dirección y seleccionar método de pago.");
  } else if (erroresDireccion) {
    mensajes.push("Debe completar la dirección.");
  } else if (erroresPago) {
    mensajes.push("Debe seleccionar un método de pago.");
  }

  // Mostrar modal
  if (!esValido) {
    const modalBody = document.getElementById("modalErroresBody");
    modalBody.innerHTML = mensajes.map(m => `<p>${m}</p>`).join("");
    new bootstrap.Modal(document.getElementById("modalErrores")).show();
  }

  return esValido;
}
