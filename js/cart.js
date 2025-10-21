// Este script se encarga de mostrar el producto agregado al carrito desde localStorage

document.addEventListener("DOMContentLoaded", function() {
  // Obtener el producto del localStorage
  const cartProduct = localStorage.getItem("cartProduct");

  if (cartProduct) {
    const product = JSON.parse(cartProduct);

    // Crear el HTML para mostrar el producto en el carrito
    const cartHTML = `
      <div class="row">
        <div class="col-12">
          <h2 class="mb-4 text-center">Carrito de Compras</h2>
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <img src="${product.image}" alt="${product.name}" class="img-fluid">
                </div>
                <div class="col-md-8">
                  <h3>${product.name}</h3>
                  <p class="text-muted">${product.description}</p>
                  <h4 class="text-primary">Precio: $${product.cost} ${product.currency}</h4>
                  <div class="mb-3">
                    <label for="quantity" class="form-label">Cantidad:</label>
                    <input type="number" id="quantity" class="form-control" value="${product.quantity}" min="1" style="width: 100px;">
                  </div>
                  <p><strong>Subtotal:</strong> <span id="subtotal">$${product.subtotal} ${product.currency}</span></p>
                  <p><strong>ID del Producto:</strong> ${product.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insertar el HTML en el contenedor principal
    document.querySelector("main .container").innerHTML = cartHTML;

    // Agregar funcionalidad para actualizar cantidad y subtotal
    const quantityInput = document.getElementById("quantity");
    const subtotalSpan = document.getElementById("subtotal");

    quantityInput.addEventListener("input", function() {
      const newQuantity = parseInt(quantityInput.value) || 1;
      const newSubtotal = product.cost * newQuantity;
      subtotalSpan.textContent = `$${newSubtotal} ${product.currency}`;

      // Actualizar localStorage
      product.quantity = newQuantity;
      product.subtotal = newSubtotal;
      localStorage.setItem("cartProduct", JSON.stringify(product));
    });
  } else {
    // Si no hay producto en el carrito, mostrar mensaje
    document.querySelector("main .container").innerHTML = `
      <div class="alert alert-info text-center" role="alert">
        <h4>No hay productos en el carrito</h4>
        <p>Agrega productos desde la página de información del producto.</p>
      </div>
    `;
  }
});
