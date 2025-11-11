document.addEventListener("DOMContentLoaded", function () {
  mostrarCarrito();
  agregarEventosCantidad();
  agregarEventosEliminar();
  agregarModalCheckout(); // Se agrega la función para el modal de checkout
});

function mostrarCarrito() {
  const productosEnCarrito = JSON.parse(localStorage.getItem("cartProducts")) || [];
  const contenedorPrincipal = document.querySelector("main .container");

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

  let htmlCarrito = `<h2 class="mb-4 text-center">Carrito de Compras</h2><div id="productos-container">`;
  let totalProductos = 0; // Variable para el total de productos sin envío

  productosEnCarrito.forEach((producto, indice) => {
    const subtotalProducto = producto.subtotal || producto.cost * producto.quantity;
    totalProductos += subtotalProducto;

    htmlCarrito += `
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
                  <label for="cantidad-${indice}" class="form-label fw-bold">Cantidad</label>
                  <input type="number" id="cantidad-${indice}" class="form-control product-quantity" min="1" value="${producto.quantity}" required>
                </div>
                <div class="flex-grow-1 ms-3">
                  <label class="form-label fw-bold">Subtotal</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="text" class="form-control product-subtotal" value="${subtotalProducto.toFixed(2)}" readonly>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="col-md-3 text-center">
            <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar" title="Eliminar producto" data-index="${indice}">
              <i class="fas fa-trash-alt fa-lg"></i>
            </button>
          </div>
        </div>
      </div>`;
  });

  htmlCarrito += `
    </div>`; // Cierra el contenedor de productos del carrito

  // Sección Tipo de envío
  htmlCarrito += `
    <div class="card mb-4">
      <div class="card-header">
        <h4>Tipo de envío</h4>
      </div>
      <div class="card-body">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="tipoEnvio" id="envioPremium" value="0.15" checked>
          <label class="form-check-label" for="envioPremium">
            Premium 2 a 5 días (15%)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="tipoEnvio" id="envioExpress" value="0.07">
          <label class="form-check-label" for="envioExpress">
            Express 5 a 8 días (7%)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="tipoEnvio" id="envioStandard" value="0.05">
          <label class="form-check-label" for="envioStandard">
            Standard 12 a 15 días (5%)
          </label>
        </div>
      </div>
    </div>`;

  // Sección Dirección de envío
  htmlCarrito += `
    <div class="card mb-4">
      <div class="card-header">
        <h4>Dirección de envío</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="departamento" class="form-label">Departamento</label>
            <input type="text" class="form-control" id="departamento" required>
          </div>
          <div class="col-md-6 mb-3">
            <label for="localidad" class="form-label">Localidad</label>
            <input type="text" class="form-control" id="localidad" required>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="calle" class="form-label">Calle</label>
            <input type="text" class="form-control" id="calle" required>
          </div>
          <div class="col-md-6 mb-3">
            <label for="numero" class="form-label">Número</label>
            <input type="text" class="form-control" id="numero" required>
          </div>
        </div>
        <div class="mb-3">
          <label for="esquina" class="form-label">Esquina</label>
          <input type="text" class="form-control" id="esquina" required>
        </div>
      </div>
    </div>`;

  // Sección Forma de pago
  htmlCarrito += `
    <div class="card mb-4">
      <div class="card-header">
        <h4>Forma de pago</h4>
      </div>
      <div class="card-body">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="metodoPago" id="tarjetaCredito" value="tarjetaCredito" data-bs-toggle="modal" data-bs-target="#modalPago">
          <label class="form-check-label" for="tarjetaCredito">
            Tarjeta de crédito
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="metodoPago" id="transferenciaBancaria" value="transferenciaBancaria">
          <label class="form-check-label" for="transferenciaBancaria">
            Transferencia bancaria
          </label>
        </div>
        <div class="mt-3">
          <span id="metodoPagoSeleccionado">No se ha seleccionado ninguna forma de pago.</span>
        </div>
      </div>
    </div>`;

  // Modal de pago con tarjeta de crédito
  htmlCarrito += `
    <div class="modal fade" id="modalPago" tabindex="-1" aria-labelledby="modalPagoLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalPagoLabel">Datos de Tarjeta de Crédito</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="numeroTarjeta" class="form-label">Número de tarjeta</label>
              <input type="text" class="form-control" id="numeroTarjeta" required>
            </div>
            <div class="mb-3">
              <label for="nombreTarjeta" class="form-label">Nombre en la tarjeta</label>
              <input type="text" class="form-control" id="nombreTarjeta" required>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="fechaVencimiento" class="form-label">Fecha de vencimiento</label>
                <input type="text" class="form-control" id="fechaVencimiento" placeholder="MM/AA" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="cvv" class="form-label">CVV</label>
                <input type="text" class="form-control" id="cvv" required>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
          </div>
        </div>
      </div>
    </div>`;

  // Sección Costos
  htmlCarrito += `
    <div class="card mb-4">
      <div class="card-header">
        <h4>Costos</h4>
      </div>
      <div class="card-body">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Subtotal
            <span id="costoSubtotal"></span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Costo de envío
            <span id="costoEnvio"></span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center fw-bold">
            Total
            <span id="costoTotal"></span>
          </li>
        </ul>
      </div>
    </div>`;

  // Botón Finalizar compra y Seguir Comprando
  htmlCarrito += `
    <div class="d-flex justify-content-between align-items-center mt-4 mb-5">
      <a href="index.html" class="btn btn-outline-secondary btn-lg">
        <i class="fas fa-arrow-left me-2"></i> Seguir Comprando
      </a>
      <button class="btn btn-primary btn-lg" id="btnFinalizarCompra">Finalizar compra</button>
    </div>`;

  contenedorPrincipal.innerHTML = htmlCarrito;

  // Actualizar el total de productos en el resumen del carrito existente
  const contenedorTotalCarrito = document.getElementById("carrito-total");
  if (contenedorTotalCarrito) {
    contenedorTotalCarrito.textContent = `Total a pagar: $${totalProductos.toFixed(2)}`;
  }

  // Re-adjuntar listeners de eventos después de actualizar el innerHTML
  agregarEventosCantidad();
  actualizarCostos(); // Llama a esta función para inicializar los costos

  // Agregar listeners de eventos para los radios de tipo de envío
  document.querySelectorAll('input[name="tipoEnvio"]').forEach(radio => {
    radio.addEventListener('change', actualizarCostos);
  });

  // Agregar listeners de eventos para los radios de método de pago
  document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const spanMetodoPagoSeleccionado = document.getElementById('metodoPagoSeleccionado');
      if (this.id === 'tarjetaCredito') {
        spanMetodoPagoSeleccionado.textContent = 'Tarjeta de crédito';
      } else if (this.id === 'transferenciaBancaria') {
        spanMetodoPagoSeleccionado.textContent = 'Transferencia bancaria';
      }
    });
  });

 
}

// Función para calcular y mostrar todos los costos (Subtotal, Costo de envío, Total)
function actualizarCostos() {
  const productosEnCarrito = JSON.parse(localStorage.getItem("cartProducts")) || [];
  const subtotal = productosEnCarrito.reduce((sum, p) => sum + (p.subtotal || p.cost * p.quantity), 0);
  const envioSeleccionado = document.querySelector('input[name="tipoEnvio"]:checked');
  const porcentajeEnvio = envioSeleccionado ? parseFloat(envioSeleccionado.value) : 0.15;
  const costoEnvio = subtotal * porcentajeEnvio;
  const total = subtotal + costoEnvio;
  
  document.getElementById("costoSubtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("costoEnvio").textContent = `$${costoEnvio.toFixed(2)}`;
  document.getElementById("costoTotal").textContent = `$${total.toFixed(2)}`;
}


// La función actualizarTotal ahora solo actualiza el total de productos sin envío
function actualizarTotal() {
  const productosEnCarrito = JSON.parse(localStorage.getItem("cartProducts")) || [];
  const contenedorTotalCarrito = document.getElementById("carrito-total");
  if (!contenedorTotalCarrito) return;

  let totalProductos = productosEnCarrito.reduce((sum, p) => sum + (p.subtotal || p.cost * p.quantity), 0);
  contenedorTotalCarrito.textContent = `Total a pagar: $${totalProductos.toFixed(2)}`;
  actualizarCostos(); // Llama a actualizarCostos para que se actualicen los costos de envío y total
}

function agregarEventosCantidad() {
  const contenedorPrincipal = document.querySelector("main .container");
  if (!contenedorPrincipal) return;

  const productosEnCarrito = JSON.parse(localStorage.getItem("cartProducts")) || [];

  contenedorPrincipal.querySelectorAll(".cart-item-form").forEach(formulario => {
    const indice = parseInt(formulario.getAttribute("data-index"));
    const inputCantidad = formulario.querySelector(".product-quantity");
    const inputSubtotal = formulario.querySelector(".product-subtotal");
    const costo = parseFloat(productosEnCarrito[indice].cost);

    inputCantidad.addEventListener("input", function () {
      let nuevaCantidad = parseInt(this.value);
      if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
      const nuevoSubtotal = costo * nuevaCantidad;
      inputSubtotal.value = nuevoSubtotal.toFixed(2);

      productosEnCarrito[indice].quantity = nuevaCantidad;
      productosEnCarrito[indice].subtotal = nuevoSubtotal;

      localStorage.setItem("cartProducts", JSON.stringify(productosEnCarrito));

      actualizarCostos();
    });
  });
}

function agregarEventosEliminar() {
  const contenedorPrincipal = document.querySelector("main .container");
  if (!contenedorPrincipal) return;

  contenedorPrincipal.addEventListener("click", function (e) {
    const button = e.target.closest(".btn-eliminar");
    if (button) {
      const indice = parseInt(button.getAttribute("data-index"));
      let productosEnCarrito = JSON.parse(localStorage.getItem("cartProducts")) || [];

      productosEnCarrito.splice(indice, 1);
      localStorage.setItem("cartProducts", JSON.stringify(productosEnCarrito));

      mostrarCarrito();
    }
  });
}

// Esta función ya no es necesaria ya que el modal se agrega directamente en mostrarCarrito
function agregarModalCheckout() {
  // No es necesario agregar el modal aquí, ya está en el HTML dinámico
  // Solo se asegura que los listeners estén adjuntos
}
