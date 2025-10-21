// Este script se encarga de obtener y mostrar la información detallada de un producto específico,
// incluyendo las calificaciones de los usuarios.
// Utiliza el ID del producto almacenado en localStorage para realizar la solicitud a la API.

// Obtener el ID del producto desde localStorage (guardado previamente en products.js al hacer clic en un producto)
let prodID = localStorage.getItem("prodID");

// Verificar si existe el ID del producto
if (!prodID) {
  // Si no hay ID, mostrar un mensaje de error en la página
  document.querySelector("main .container").innerHTML =
    '<div class="alert alert-danger text-center" role="alert"><h4>No se encontró el ID del producto</h4><p>Por favor, selecciona un producto desde la lista de productos.</p></div>';
} else {
  // Construir la URL para la solicitud de información del producto usando las constantes de init.js
  let url = PRODUCT_INFO_URL + prodID + EXT_TYPE;

  // Realizar la solicitud a la API usando la función getJSONData definida en init.js
  getJSONData(url).then((result) => {
    if (result.status === "ok") {
      // Si la solicitud fue exitosa, obtener los datos del producto
      let product = result.data;

      // Crear el HTML para mostrar la información del producto
      // Se incluye imagen, nombre, descripción, precio, cantidad vendida, etc.
      let html = `
        <div class="product-detail container">
          <div class="row">
            <div class="col-md-6">
              <img src="${
                product.images ? product.images[0] : product.image
              }" alt="${product.name}" class="img-fluid">
            </div>
            <div class="col-md-6">
              <h1>${product.name}</h1>
              <p class="text-muted">${product.description}</p>
              <h3 class="text-primary">Precio: $${product.cost} ${
        product.currency
      }</h3>
              <p><strong>Vendidos:</strong> ${product.soldCount}</p>
              <p><strong>Categoría:</strong> ${product.category}</p>
              <button id="buy-button" class="btn btn-success mt-3">Comprar</button>
            </div>
          </div>
        </div>
      `;

      // Insertar el HTML generado en el contenedor principal de la página
      document.querySelector("main .container").innerHTML = html;

      // Agregar funcionalidad al botón "Comprar"
      document.getElementById("buy-button").addEventListener("click", function() {
        // Obtener información del producto
        const quantity = 1; // Cantidad por defecto
        const subtotal = product.cost * quantity;
        const productInfo = {
          id: product.id,
          name: product.name,
          cost: product.cost,
          currency: product.currency,
          quantity: quantity,
          image: product.images ? product.images[0] : product.image,
          subtotal: subtotal
        };

        // Guardar en localStorage
        localStorage.setItem("cartProduct", JSON.stringify(productInfo));

        // Navegar a cart.html
        window.location.href = "cart.html";
      });

      // Agregar formulario de calificación después de la información del producto
      let formularioCalificacion = `
        <div class="row mt-5 row justify-content-center align-items-center min-vh-50">
          <div class="col-6 ">
            <h2 class="mb-4 text-center" style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Calificar este producto</h2>
            <div class="card border-0 shadow" style="border-radius: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
              <div class="card-body p-4">
                <form id="form-calificacion">
                  <div class="mb-4">
                    <label for="comentario" class="form-label fw-bold">Tu comentario:</label>
                    <textarea class="form-control" id="comentario" rows="3" placeholder="Escribe tu opinión sobre este producto..." required></textarea>
                  </div>
                  <div class="mb-4">
                    <label class="form-label fw-bold">Calificación:</label>
                    <div class="rating-stars">
                      <div class="stars-container">
                        <input type="radio" id="star1" name="rating" value="1" class="d-none">
                        <label for="star1" class="star-label fs-2">★</label>
                        
                        <input type="radio" id="star2" name="rating" value="2" class="d-none">
                        <label for="star2" class="star-label fs-2">★</label>
                        
                        <input type="radio" id="star3" name="rating" value="3" class="d-none">
                        <label for="star3" class="star-label fs-2">★</label>
                        
                        <input type="radio" id="star4" name="rating" value="4" class="d-none">
                        <label for="star4" class="star-label fs-2">★</label>
                        
                        <input type="radio" id="star5" name="rating" value="5" class="d-none">
                        <label for="star5" class="star-label fs-2">★</label>
                      </div>
                      <div class="rating-labels">
                        <span>1 - Malo</span>
                        <span>5 - Excelente</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary btn-lg px-5">Enviar calificación</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;
      document
        .querySelector("main .container .product-detail")
        .insertAdjacentHTML("afterend", formularioCalificacion);

      // Agregar funcionalidad al formulario de calificación
      document
        .getElementById("form-calificacion")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const comentario = document.getElementById("comentario").value;
          const rating = document.querySelector('input[name="rating"]:checked');

          // Validar que se haya seleccionado una calificación
          if (!rating) {
            alert("Por favor, selecciona una calificación");
            return;
          }

          // Validar que el comentario no esté vacío
          if (!comentario.trim()) {
            alert("Por favor, escribe un comentario");
            return;
          }

          // Obtener usuario actual (si existe) o usar "Anónimo"
          let usuario = "Anónimo";
          if (localStorage.getItem("user")) {
            usuario = localStorage.getItem("user");
          }

          // Crear objeto con la nueva calificación
          const nuevaCalificacion = {
            user: usuario,
            score: parseInt(rating.value),
            description: comentario,
            dateTime: new Date().toISOString(),
          };

          // Agregar la nueva calificación a la lista visualmente
          agregarCalificacion(nuevaCalificacion);

          // Limpiar el formulario después del envío
          document.getElementById("form-calificacion").reset();
          document.querySelectorAll('input[name="rating"]').forEach((radio) => {
            radio.checked = false;
          });

          // Restablecer el color de las estrellas a gris
          document.querySelectorAll(".star-label").forEach((star) => {
            star.style.color = "#ddd";
          });

          // Mostrar mensaje de éxito temporal
          mostrarMensajeExito();
        });

      // Funcionalidad para las estrellas - CÓDIGO CORREGIDO
      document.querySelectorAll(".star-label").forEach((star, index) => {
        star.addEventListener("click", () => {
          const stars = document.querySelectorAll(".star-label");
          const radioButtons = document.querySelectorAll(
            'input[name="rating"]'
          );

          // El índice ya corresponde al valor correcto (0=1, 1=2, 2=3, 3=4, 4=5)
          const valorSeleccionado = index + 1;

          // Marcar el radio button correspondiente
          radioButtons[index].checked = true;

          // Cambiar colores de las estrellas - pintar todas hasta la seleccionada
          stars.forEach((s, i) => {
            if (i <= index) {
              s.style.color = "#ffc107"; // Amarillo para estrellas seleccionadas
            } else {
              s.style.color = "#ddd"; // Gris para estrellas no seleccionadas
            }
          });

          console.log("Estrella seleccionada:", valorSeleccionado); // Para debug
        });
      });

      // Listener adicional para cuando se cambia manualmente el radio button
      document.querySelectorAll('input[name="rating"]').forEach((radio) => {
        radio.addEventListener("change", function () {
          const stars = document.querySelectorAll(".star-label");
          const value = parseInt(this.value);

          // Pintar estrellas según el valor seleccionado
          stars.forEach((star, index) => {
            if (index < value) {
              star.style.color = "#ffc107";
            } else {
              star.style.color = "#ddd";
            }
          });
        });
      });

      // Ahora obtener y mostrar las calificaciones (ESTE BLOQUE DEBE IR ANTES DE LOS PRODUCTOS RELACIONADOS)
      let urlComentarios = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE;
      getJSONData(urlComentarios).then((resultComentarios) => {
        if (resultComentarios.status === "ok") {
          let comentarios = resultComentarios.data;

          // Crear un contenedor específico para las calificaciones con un ID único
          let seccionCalificaciones = `
            <div class="row mt-5" id="seccion-calificaciones">
              <div class="col-12">
                <h2 class="mb-4 text-center" style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Calificaciones de Usuarios</h2>
                <div id="lista-calificaciones">
                  ${
                    comentarios.length > 0
                      ? comentarios
                          .map(
                            (comentario) => `
                    <div class="card mb-4 border-0 shadow" style="border-radius: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
                      <div class="card-body p-4">
                        <div class="row">
                          <div class="col-md-8">
                            <h5 class="card-title" style="color: #007bff; font-weight: bold; margin-bottom: 15px;">${
                              comentario.user
                            }</h5>
                            <p class="card-text" style="font-size: 1.1em; line-height: 1.6; color: #495057;">${
                              comentario.description
                            }</p>
                            <p class="card-text"><small class="text-muted" style="font-style: italic;">Fecha: ${new Date(
                              comentario.dateTime
                            ).toLocaleDateString("es-ES")}</small></p>
                          </div>
                          <div class="col-md-4 text-end d-flex flex-column justify-content-center align-items-end">
                            <div class="rating-display mb-2" style="font-size: 2em; font-weight: bold; color: #ffc107; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
                              ${comentario.score}
                            </div>
                            <small class="text-muted" style="font-size: 0.9em;">/ 5</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  `
                          )
                          .join("")
                      : '<div class="alert alert-info text-center" role="alert" style="border-radius: 15px;" id="alerta-no-calificaciones"><p class="mb-0">No hay calificaciones disponibles para este producto.</p></div>'
                  }
                </div>
              </div>
            </div>
          `;

          // Insertar las calificaciones DESPUÉS del formulario
          document
            .querySelector("main .container")
            .insertAdjacentHTML("beforeend", seccionCalificaciones);

          // Entrega 4 - Lucia: Mostrar prods relacionados (ESTE BLOQUE DEBE IR DESPUÉS DE LAS CALIFICACIONES)
          let relatedHTML = `
            <div class="row mt-5">
              <div class="col-12">
                <h2 class="mb-4 text-center fw-semibold text-primary border-bottom border-3 border-primary pb-2">
                  Productos relacionados
                </h2>
                <div class="row row-cols-2 row-cols-md-4 g-4 justify-content-center" id="related-products">
                  ${product.relatedProducts
                    .map(
                      (related) => `
                    <div class="col">
                      <div class="card h-100 shadow-sm rounded-4 border-0 product-related-card" style="cursor: pointer;" data-prod-id="${related.id}">
                        <img src="${related.image}" class="card-img-top rounded-top-4" alt="${related.name}" style="object-fit: cover; height: 150px;">
                        <div class="card-body text-center px-2">
                          <p class="card-text text-truncate fw-semibold text-primary mb-0" title="${related.name}">${related.name}</p>
                        </div>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
          `;

          // Insertar productos relacionados DESPUÉS de las calificaciones
          document
            .querySelector("main .container")
            .insertAdjacentHTML("beforeend", relatedHTML);

          // Agregar evento click para cambiar el producto mostrado al pulsar relacionado
          document
            .querySelectorAll("#related-products .product-related-card")
            .forEach((card) => {
              card.addEventListener("click", () => {
                const newProdID = card.getAttribute("data-prod-id");
                localStorage.setItem("prodID", newProdID);
                location.reload();
              });
            });
        } else {
          console.error("Error al cargar Producto");
        }
      });
    } else {
      // Si hubo un error en la solicitud, mostrar un mensaje de error
      document.querySelector("main .container").innerHTML =
        '<div class="alert alert-danger text-center" role="alert"><h4>Error al cargar la información del producto</h4><p>Inténtalo de nuevo más tarde.</p></div>';
    }
  });
}

// Función para agregar una nueva calificación a la lista
function agregarCalificacion(nuevaCalificacion) {
  // Crear elemento HTML para la nueva calificación
  const nuevaCalificacionHTML = `
    <div class="card mb-4 border-0 shadow" style="border-radius: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
      <div class="card-body p-4">
        <div class="row">
          <div class="col-md-8">
            <h5 class="card-title" style="color: #007bff; font-weight: bold; margin-bottom: 15px;">${
              nuevaCalificacion.user
            }</h5>
            <p class="card-text" style="font-size: 1.1em; line-height: 1.6; color: #495057;">${
              nuevaCalificacion.description
            }</p>
            <p class="card-text"><small class="text-muted" style="font-style: italic;">Fecha: ${new Date(
              nuevaCalificacion.dateTime
            ).toLocaleDateString("es-ES")}</small></p>
          </div>
          <div class="col-md-4 text-end d-flex flex-column justify-content-center align-items-end">
            <div class="rating-display mb-2" style="font-size: 2em; font-weight: bold; color: #ffc107; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
              ${nuevaCalificacion.score}
            </div>
            <small class="text-muted" style="font-size: 0.9em;">/ 5</small>
          </div>
        </div>
      </div>
    </div>
  `;

  // Buscar el contenedor específico de las calificaciones usando el ID único
  const listaCalificaciones = document.getElementById("lista-calificaciones");
  const alertaNoCalificaciones = document.getElementById(
    "alerta-no-calificaciones"
  );

  // Si existe el alerta de "no hay calificaciones", reemplazarlo
  if (alertaNoCalificaciones) {
    alertaNoCalificaciones.outerHTML = nuevaCalificacionHTML;
    return;
  }

  // Si no hay alerta pero sí existe la lista de calificaciones
  if (listaCalificaciones) {
    // Insertar la nueva calificación al principio de la lista
    listaCalificaciones.insertAdjacentHTML("afterbegin", nuevaCalificacionHTML);
  } else {
    // Si no se encuentra el contenedor, mostrar error en consola
    console.error("No se encontró el contenedor de calificaciones");
  }
}
