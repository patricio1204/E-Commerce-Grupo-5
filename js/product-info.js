// Este script se encarga de obtener y mostrar la información detallada de un producto específico,
// incluyendo las calificaciones de los usuarios.
// Utiliza el ID del producto almacenado en localStorage para realizar la solicitud a la API.

// Obtener el ID del producto desde localStorage (guardado previamente en products.js al hacer clic en un producto)
let prodID = localStorage.getItem('prodID');

// Verificar si existe el ID del producto
if (!prodID) {
  // Si no hay ID, mostrar un mensaje de error en la página
  document.querySelector('main .container').innerHTML = '<div class="alert alert-danger text-center" role="alert"><h4>No se encontró el ID del producto</h4><p>Por favor, selecciona un producto desde la lista de productos.</p></div>';
} else {
  // Construir la URL para la solicitud de información del producto usando las constantes de init.js
  let url = PRODUCT_INFO_URL + prodID + EXT_TYPE;

  // Realizar la solicitud a la API usando la función getJSONData definida en init.js
  getJSONData(url).then(result => {
    if (result.status === 'ok') {
      // Si la solicitud fue exitosa, obtener los datos del producto
      let product = result.data;

      // Crear el HTML para mostrar la información del producto
      // Se incluye imagen, nombre, descripción, precio, cantidad vendida, etc.
      let html = `
        <div class="product-detail container">
          <div class="row">
            <div class="col-md-6">
              <img src="${product.images ? product.images[0] : product.image}" alt="${product.name}" class="img-fluid">
            </div>
            <div class="col-md-6">
              <h1>${product.name}</h1>
              <p class="text-muted">${product.description}</p>
              <h3 class="text-primary">Precio: $${product.cost} ${product.currency}</h3>
              <p><strong>Vendidos:</strong> ${product.soldCount}</p>
              <p><strong>Categoría:</strong> ${product.category}</p>
            </div>
          </div>
        </div>
      `;

      // Insertar el HTML generado en el contenedor principal de la página
      document.querySelector('main .container').innerHTML = html;

      // Ahora obtener y mostrar las calificaciones
      let urlComentarios = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE;
      getJSONData(urlComentarios).then(resultComentarios => {
        if (resultComentarios.status === 'ok') {
          let comentarios = resultComentarios.data;
          let seccionCalificaciones = `
            <div class="row mt-5">
              <div class="col-12">
                <h2 class="mb-4 text-center" style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Calificaciones de Usuarios</h2>
                ${comentarios.length > 0 ? comentarios.map(comentario => `
                  <div class="card mb-4 border-0 shadow" style="border-radius: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
                    <div class="card-body p-4">
                      <div class="row">
                        <div class="col-md-8">
                          <h5 class="card-title" style="color: #007bff; font-weight: bold; margin-bottom: 15px;">${comentario.user}</h5>
                          <p class="card-text" style="font-size: 1.1em; line-height: 1.6; color: #495057;">${comentario.description}</p>
                          <p class="card-text"><small class="text-muted" style="font-style: italic;">Fecha: ${new Date(comentario.dateTime).toLocaleDateString('es-ES')}</small></p>
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
                `).join('') : '<div class="alert alert-info text-center" role="alert" style="border-radius: 15px;"><p class="mb-0">No hay calificaciones disponibles para este producto.</p></div>'}
              </div>
            </div>
          `;
          document.querySelector('main .container .product-detail').insertAdjacentHTML('beforeend', seccionCalificaciones);
        } else {
          console.error('Error al cargar las calificaciones');
        }
      });
    } else {
      // Si hubo un error en la solicitud, mostrar un mensaje de error
      document.querySelector('main .container').innerHTML = '<div class="alert alert-danger text-center" role="alert"><h4>Error al cargar la información del producto</h4><p>Inténtalo de nuevo más tarde.</p></div>';
    }
  });
}


