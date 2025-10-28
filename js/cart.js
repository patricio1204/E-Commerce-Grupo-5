// Este script se encarga de mostrar el carrito de compras
// Verifica si hay productos en localStorage y los muestra en el carrito

document.addEventListener("DOMContentLoaded", function () {
  // Obtener el producto del carrito desde localStorage
  const cartProduct = localStorage.getItem("cartProduct");

  // Contenedor principal donde se insertará el carrito
  const container = document.querySelector("main .container");

  if (!cartProduct) {
    // Si no hay producto en el carrito, mostrar mensaje
    container.innerHTML = `
            <div class="row justify-content-center mt-5">
                <div class="col-md-8">
                    <div class="alert alert-info text-center" role="alert">
                        <h4 class="alert-heading">Carrito vacío</h4>
                        <p>No hay productos en tu carrito de compras.</p>
                        <hr>
                        <p class="mb-0">Visita nuestro <a href="index.html" class="alert-link">catálogo</a> para agregar productos.</p>
                    </div>
                </div>
            </div>
        `;
  } else {
    // Si hay producto, parsear y mostrar en el carrito
    const product = JSON.parse(cartProduct);

    // Calcular subtotal inicial
    let subtotal = product.subtotal || product.cost * product.quantity;

    // Crear HTML del carrito
    const cartHTML = `
            <div class="row justify-content-center mt-4">
                <div class="col-md-10">
                    <h2 class="mb-4 text-center">Carrito de Compras</h2>
                    
                    <div class="card shadow">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <!-- Imagen del producto -->
                                <div class="col-md-3 text-center">
                                    <img src="${product.image}" alt="${product.name}" class="img-fluid rounded" style="max-height: 150px;">
                                </div>
                                
                                <!-- Información del producto -->
                                <div class="col-md-9">
                                    <form id="cart-form">
                                        <div class="row">
                                            <!-- Nombre -->
                                            <div class="col-md-6 mb-3">
                                                <label for="product-name" class="form-label fw-bold">Nombre</label>
                                                <input type="text" class="form-control" id="product-name" value="${product.name}" readonly>
                                            </div>
                                            
                                            <!-- Costo -->
                                            <div class="col-md-3 mb-3">
                                                <label for="product-cost" class="form-label fw-bold">Costo</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">$</span>
                                                    <input type="text" class="form-control" id="product-cost" value="${product.cost}" readonly>
                                                </div>
                                            </div>
                                            
                                            <!-- Moneda -->
                                            <div class="col-md-3 mb-3">
                                                <label for="product-currency" class="form-label fw-bold">Moneda</label>
                                                <input type="text" class="form-control" id="product-currency" value="${product.currency}" readonly>
                                            </div>
                                        </div>
                                        
                                        <div class="row">
                                            <!-- Cantidad -->
                                            <div class="col-md-6 mb-3">
                                                <label for="product-quantity" class="form-label fw-bold">Cantidad</label>
                                                <input type="number" class="form-control" id="product-quantity" min="1" value="${product.quantity}" required>
                                            </div>
                                            
                                            <!-- Subtotal -->
                                            <div class="col-md-6 mb-3">
                                                <label for="product-subtotal" class="form-label fw-bold">Subtotal</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">$</span>
                                                    <input type="text" class="form-control" id="product-subtotal" value="${subtotal}" readonly>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Botones de acción -->
                                        <div class="row mt-4">
                                            <div class="col-12 d-flex justify-content-between">
                                                <a href="index.html" class="btn btn-outline-secondary">
                                                    <i class="fas fa-arrow-left me-2"></i>Seguir Comprando
                                                </a>
                                                <button type="button" id="checkout-btn" class="btn btn-success">
                                                    <i class="fas fa-credit-card me-2"></i>Proceder al Pago
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Insertar el carrito en el contenedor
    container.innerHTML = cartHTML;

    // Agregar funcionalidad para actualizar el subtotal cuando cambia la cantidad
    const quantityInput = document.getElementById("product-quantity");
    const subtotalInput = document.getElementById("product-subtotal");

    quantityInput.addEventListener("input", function () {
      const quantity = parseInt(this.value) || 1;
      const cost = parseFloat(product.cost);
      const newSubtotal = cost * quantity;

      // Actualizar el valor del subtotal
      subtotalInput.value = newSubtotal.toFixed(2);

      // Actualizar el producto en localStorage
      product.quantity = quantity;
      product.subtotal = newSubtotal;
      localStorage.setItem("cartProduct", JSON.stringify(product));
    });

    // Agregar funcionalidad al botón de pago
    document
      .getElementById("checkout-btn")
      .addEventListener("click", function () {
        alert(
          "¡Gracias por tu compra! Esta funcionalidad estará disponible próximamente."
        );
        // Aquí podrías redirigir a una página de checkout o procesar el pago
      });
  }
});
