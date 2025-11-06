let catID = localStorage.getItem("catID");
let url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

const container = document.getElementById("products-container");
const searchInput = document.getElementById("search-input");
const sortAscBtn = document.getElementById("sortAsc");
const sortDescBtn = document.getElementById("sortDesc");

let products = []; 
let filteredProducts = []; 

// OBTENER LOS PRODUCTOS
fetch(url)
  .then(res => res.json())
  .then(data => {
    products = data.products;
    filteredProducts = [...products];
    renderProducts(filteredProducts);
  })
  .catch(error => {
    console.error("Error al obtener los productos:", error);
    container.innerHTML = "<p>Error al cargar los productos.</p>";
  });

// MOSTRAR PRODUCTOS
function renderProducts(list) {
  container.innerHTML = ""; // limpia el contenedor
  if (list.length === 0) {
    container.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  list.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-title">${prod.name}</h3>
        <p class="product-descripcion">${prod.description}</p>
        <div class="product-sales"><span class="sales-label">Vendidos: ${prod.soldCount}</span></div>
        <div class="product-price">$${prod.cost}</div>
      </div>
    `;

    // redirección al hacer clic
    card.addEventListener('click', () => {
      localStorage.setItem('prodID', prod.id);
      window.location.href = 'product-info.html';
    });

    container.appendChild(card);
  });
}

// FILTRAR POR TEXTO
searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase().trim();

  filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(searchText) ||
    prod.description.toLowerCase().includes(searchText)
  );

  renderProducts(filteredProducts);
});

// ORDEN ALFABETICO
sortAscBtn.addEventListener("change", () => {
  if (sortAscBtn.checked) {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    renderProducts(filteredProducts);
  }
});

sortDescBtn.addEventListener("change", () => {
  if (sortDescBtn.checked) {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    renderProducts(filteredProducts);
  }
});
