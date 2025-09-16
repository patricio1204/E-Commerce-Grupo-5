// Este script se encarga de obtener y mostrar la información detallada de un producto específico.
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
    } else {
      // Si hubo un error en la solicitud, mostrar un mensaje de error
      document.querySelector('main .container').innerHTML = '<div class="alert alert-danger text-center" role="alert"><h4>Error al cargar la información del producto</h4><p>Inténtalo de nuevo más tarde.</p></div>';
    }
  });
}
