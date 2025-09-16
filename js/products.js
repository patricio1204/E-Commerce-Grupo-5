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
    const sortType = icon.dataset.sort; // por ejemplo "price-asc", "price-desc", "sold-desc" (tipo de orden a aplicar)
    applySortAndRender(products, sortType); // llama función para ordenar y volver a mostrar productos
  });
});

const minInput = document.getElementById("min-price"); // input para precio mínimo
const maxInput = document.getElementById("max-price"); // input para precio máximo
const filterBtn = document.getElementById("filter-btn"); // botón que aplica filtro
const clearBtn = document.getElementById("clear-btn"); // botón que limpia filtros
const sortSelect = document.getElementById("sort-select"); // select de criterio de orden

let products = []; // Aquí guardaremos los productos obtenidos

fetch(url)
  .then(res => res.json())
  .then(data => {
    products = data.products; // asigna los productos obtenidos de la respuesta
    renderProducts(products); // muestra todos los productos por primera vez
  })
  .catch(error => {
    console.error("Error al obtener los productos:", error); // impresión de error en consola
    container.innerHTML = "<p>Error al cargar los productos.</p>"; // mensaje de error para el usuario
  });

function renderProducts(list) {
  container.innerHTML = ""; // limpia contenedor antes de renderizar
  list.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("product-card"); // clase para estilo de tarjeta de producto
    card.dataset.price = prod.cost; // guarda precio en atributo data para uso interno
    card.dataset.sold = prod.soldCount; // guarda cantidad vendida en atributo data
    card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" class="product-image"> <!-- imagen del producto -->
      <div class="product-info">
        <h3 class="product-title">${prod.name}</h3> <!-- nombre del producto -->
        <p class="product-descripcion">${prod.description}</p> <!-- descripción -->
        <div class="product-sales"><span class="sales-label">Vendidos: ${prod.soldCount}</span></div> <!-- muestra venta -->
        <div class="product-price">$${prod.cost}</div> <!-- muestra precio -->
      </div>`;
    container.appendChild(card); // agrega la tarjeta al contenedor visible
  });
}

filterBtn.addEventListener("click", () => { // le está diciendo al botón “Filtrar” que, cuando el usuario haga click, ejecute todo lo que está dentro de la función
  const min = parseFloat(minInput.value); // convierte valor del input mínimo a número
  const max = parseFloat(maxInput.value); // convierte valor del input máximo a número
  const filtered = products.filter(p =>
    (isNaN(min) || p.cost >= min) && // si no hay mínimo o precio >= mínimo
    (isNaN(max) || p.cost <= max) // si no hay máximo o precio <= máximo
  );
  applySortAndRender(filtered); // aplica orden y muestra la lista filtrada
});

clearBtn.addEventListener("click", () => {  // clearBtn es la referencia al botón "Limpia" y  .addEventListener("click", …)  se usa para decir: “cuando alguien haga clic en este botón…”
  minInput.value = ""; // limpia input mínimo
  maxInput.value = ""; // limpia input máximo
  sortSelect.value = ""; // resetea select de orden
  renderProducts(products); // vuelve a mostrar todos los productos sin filtros ni orden aplicado
});

sortSelect.addEventListener("change", () => {   // sortSelect es una referencia a un elemento <select> que permite elegir un criterio de orden (por ejemplo "price-asc", "price-desc", etc.)..addEventListener("change") le dice al navegador que “escuche” el evento change en ese elemento. 
//El evento "change" se dispara cuando se modifica el valor del <select> (cuando el usuario elige una opción diferente).
  applySortAndRender(products); // cuando cambia el criterio de orden, reordena y re-muestra los productos
});

function applySortAndRender(list) {
  let sorted = [...list]; // clona la lista para no modificar el original
  let val = sortSelect.value; // obtiene valor del select actual
  if (val === "price-asc") {
    sorted.sort((a, b) => a.cost - b.cost); // ordenar de menor a mayor precio
  } else if (val === "price-desc") {
    sorted.sort((a, b) => b.cost - a.cost); // ordenar de mayor a menor precio
  } else if (val === "sold-desc") {
    sorted.sort((a, b) => b.soldCount - a.soldCount); // ordenar por ventas descendentes
  }
  renderProducts(sorted); // finalmente muestra los productos ordenados
}

// hasta acá