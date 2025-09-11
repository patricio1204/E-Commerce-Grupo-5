let catID = localStorage.getItem("catID"); // 

// URL de la API que contiene los productos de la categoría 101.
// Aquí es donde vamos a hacer la solicitud para obtener los datos en formato JSON.
let url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;  //Mod: desde el $ en adelnate logramos que que el ID de la cat sea dinàmico



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


// desde acá
const sortIcons = document.querySelectorAll(".sort-icon");
sortIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    const sortType = icon.dataset.sort; // p.ej. "price-asc", "price-desc", "sold-desc"
    applySortAndRender(products, sortType);
  });
});

const minInput = document.getElementById("min-price");
const maxInput = document.getElementById("max-price");
const filterBtn = document.getElementById("filter-btn");
const clearBtn = document.getElementById("clear-btn");
const sortSelect = document.getElementById("sort-select");

let products = []; // Aquí guardaremos los productos obtenidos

fetch(url)
  .then(res => res.json())
  .then(data => {
    products = data.products;
    renderProducts(products);
  })
  .catch(error => {
    console.error("Error al obtener los productos:", error);
    container.innerHTML = "<p>Error al cargar los productos.</p>";
  });

function renderProducts(list) {
  container.innerHTML = "";
  list.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.dataset.price = prod.cost;
    card.dataset.sold = prod.soldCount;
    card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-title">${prod.name}</h3>
        <p class="product-descripcion">${prod.description}</p>
        <div class="product-sales"><span class="sales-label">Vendidos: ${prod.soldCount}</span></div>
        <div class="product-price">$${prod.cost}</div>
      </div>`;
    container.appendChild(card);
  });
}

filterBtn.addEventListener("click", () => {
  const min = parseFloat(minInput.value);
  const max = parseFloat(maxInput.value);
  const filtered = products.filter(p =>
    (isNaN(min) || p.cost >= min) &&
    (isNaN(max) || p.cost <= max)
  );
  applySortAndRender(filtered);
});

clearBtn.addEventListener("click", () => {
  minInput.value = "";
  maxInput.value = "";
  sortSelect.value = "";
  renderProducts(products);
});

sortSelect.addEventListener("change", () => {
  applySortAndRender(products);
});

function applySortAndRender(list) {
  let sorted = [...list];
  const val = sortSelect.value;
  if (val === "price-asc") {
    sorted.sort((a, b) => a.cost - b.cost);
  } else if (val === "price-desc") {
    sorted.sort((a, b) => b.cost - a.cost);
  } else if (val === "sold-desc") {
    sorted.sort((a, b) => b.soldCount - a.soldCount);
  }
  renderProducts(sorted);
}

// hasta acá