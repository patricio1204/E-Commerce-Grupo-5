let catID = localStorage.getItem("catID"); //

// URL de la API que contiene los productos de la categoría.
// Aquí es donde vamos a hacer la solicitud para obtener los datos en formato JSON.
let url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;  //Mod: desde el $ en adelante logramos que el ID de la cat sea dinámico

// Seleccionamos el elemento del DOM (HTML) donde se insertarán todas las tarjetas.
// En este caso, es un <div> con id="products-container".
const container = document.getElementById("products-container");

// Realizamos la petición a la URL usando fetch.
// fetch() es una función nativa de JavaScript que nos permite obtener recursos a través de HTTP.
fetch(url)
  // El método .then() se ejecuta cuando la promesa de fetch se resuelve (cuando llega la respuesta).
  // Primero convertimos la respuesta en un objeto JavaScript usando response.json().
  .then((response) => response.json())

  // Aquí trabajamos con el resultado de response.json(), que ya es un objeto JavaScript.
  .then((data) => {
    // La API nos devuelve un objeto que tiene varias propiedades, pero la que nos interesa es "products".
    // "products" es un array que contiene la lista de productos.
    const productos = data.products;

    // Recorremos el array de productos usando forEach().
    // forEach() ejecuta la función para cada elemento del array.
    productos.forEach((producto) => {
      // Creamos un nuevo elemento <div> en el DOM para representar la tarjeta del producto.
      const card = document.createElement("div");

      // Agregamos la clase "product-card" a este <div> para aplicarle los estilos definidos en style.css.
      card.classList.add("product-card");

      // Definimos el contenido HTML de la tarjeta usando template literals (las comillas invertidas ` `).
      // Esto permite insertar variables dentro del HTML con la sintaxis ${variable}.
      // Así podemos mostrar dinámicamente la imagen, el nombre, la descripción, la cantidad vendida y el precio.
      card.innerHTML = `
        <img src="${producto.image}" alt="${producto.name}" class="product-image">
        <div class="product-info">
          <h3 class="product-title">${producto.name}</h3>
          <p class="product-descripcion">${producto.description}</p>
          <div class="product-sales">
            <span class="sales-label">Vendidos: ${producto.soldCount}</span>
          </div>
          <div class="product-price">$${producto.cost}</div>
        </div>
      `;

      // Agregar event listener para seleccionar el producto
      card.addEventListener('click', () => {
        // Guardar el ID del producto en localStorage
        localStorage.setItem('prodID', producto.id);
        // Redirigir a la página de información del producto
        window.location.href = 'product-info.html';
      });

      // Finalmente, insertamos la tarjeta recién creada dentro del contenedor principal (products-container).
      // Esto hace que la tarjeta aparezca en la página.
      container.appendChild(card);
    });
  })

  // Si ocurre algún error durante la solicitud o la conversión de datos,
  // se ejecuta el bloque .catch(), que captura el error.
  .catch((error) => {
    // Mostramos el error en la consola para que el desarrollador lo vea.
    console.error("Error al obtener los productos:", error);

    // También mostramos un mensaje de error en la página para informar al usuario.
    container.innerHTML = "<p>Error al cargar los productos.</p>";
  });


  

