document.addEventListener("DOMContentLoaded", function () {
  mostrarCarrito();
  agregarEventosCantidad();
  agregarEventosEliminar();
});

function mostrarCarrito() {
  const cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
  const container = document.querySelector("main .container");

  if (cartProducts.length === 0) {
    container.innerHTML = `
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

  let cartHTML = `<h2 class="mb-4 text-center">Carrito de Compras</h2>`;
  let total = 0;

  cartProducts.forEach((product, index) => {
    const subtotal = product.subtotal || product.cost * product.quantity;
    total += subtotal;

    cartHTML += `
      <div class="card mb-3 shadow-sm rounded-3">
        <div class="row g-0 align-items-center">
          <div class="col-md-3 text-center p-3">
            <img src="${product.image}" alt="${product.name}" class="img-fluid rounded" style="max-height: 140px;">
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <h5 class="card-title mb-2">${product.name}</h5>
              <p class="mb-1 text-muted">Precio unitario: $${product.cost.toFixed(2)} ${product.currency}</p>
              <form class="cart-item-form d-flex align-items-center" data-index="${index}">
                <div class="me-3" style="width: 100px;">
                  <label for="quantity-${index}" class="form-label fw-bold">Cantidad</label>
                  <input type="number" id="quantity-${index}" class="form-control product-quantity" min="1" value="${product.quantity}" required>
                </div>
                <div class="flex-grow-1 ms-3">
                  <label class="form-label fw-bold">Subtotal</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="text" class="form-control product-subtotal" value="${subtotal.toFixed(2)}" readonly>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="col-md-3 text-center">
            <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar" title="Eliminar producto" data-index="${index}">
              <i class="fas fa-trash-alt fa-lg"></i>
            </button>
          </div>
        </div>
      </div>`;
  });

  cartHTML += `
    <div class="d-flex justify-content-between align-items-center mt-4">
      <a href="index.html" class="btn btn-outline-secondary btn-lg">
        <i class="fas fa-arrow-left me-2"></i> Seguir Comprando
      </a>
      <div>
        <h4 class="d-inline me-4" id="carrito-total">Total a pagar: $${total.toFixed(2)}</h4>
        <button type="button" id="checkout-btn" class="btn btn-success btn-lg">
          <i class="fas fa-credit-card me-2"></i> Proceder al Pago
        </button>
      </div>
    </div>`;

  container.innerHTML = cartHTML;
}

function agregarEventosCantidad() {
  const container = document.querySelector("main .container");
  if (!container) return;

  const cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

  container.querySelectorAll(".cart-item-form").forEach(form => {
    const index = parseInt(form.getAttribute("data-index"));
    const quantityInput = form.querySelector(".product-quantity");
    const subtotalInput = form.querySelector(".product-subtotal");
    const cost = parseFloat(cartProducts[index].cost);

    quantityInput.addEventListener("input", function () {
      let newQuantity = parseInt(this.value);
      if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
      const newSubtotal = cost * newQuantity;
      subtotalInput.value = newSubtotal.toFixed(2);

      cartProducts[index].quantity = newQuantity;
      cartProducts[index].subtotal = newSubtotal;

      localStorage.setItem("cartProducts", JSON.stringify(cartProducts));

      actualizarTotal();
    });
  });
}

function agregarEventosEliminar() {
  const container = document.querySelector("main .container");
  if (!container) return;

  container.querySelectorAll(".btn-eliminar").forEach(button => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

      cartProducts.splice(index, 1);
      localStorage.setItem("cartProducts", JSON.stringify(cartProducts));

      mostrarCarrito();
      agregarEventosCantidad();
      agregarEventosEliminar();
      actualizarTotal();
    });
  });
}

function actualizarTotal() {
  const cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
  const totalContenedor = document.getElementById("carrito-total");
  if (!totalContenedor) return;

  let total = cartProducts.reduce((sum, p) => sum + (p.subtotal || p.cost * p.quantity), 0);
  totalContenedor.textContent = `Total a pagar: $${total.toFixed(2)}`;
}

document.addEventListener("click", function (event) {
  if (event.target && event.target.id === "checkout-btn") {
    alert("¡Gracias por tu compra! Esta funcionalidad estará disponible próximamente.");
  }
});


