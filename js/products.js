// Botones de ordenamiento
document.getElementById("sortPriceAsc").addEventListener("click", () => sortProducts("priceAsc"));
document.getElementById("sortPriceDesc").addEventListener("click", () => sortProducts("priceDesc"));
document.getElementById("sortSoldDesc").addEventListener("click", () => sortProducts("soldDesc"));

// Botón filtrar
applyFiltersBtn.addEventListener("click", () => sortProducts(currentSort));

// Enlace limpiar
document.getElementById("clearFilters").addEventListener("click", () => {
    minPriceInput.value = "";
    maxPriceInput.value = "";
    sortProducts("priceAsc"); // volver al orden por defecto
});

let currentSort = "priceAsc";

function sortProducts(criteria) {
    currentSort = criteria;
    let minPrice = parseFloat(minPriceInput.value) || 0;
    let maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    let filtered = products.filter(p => p.cost >= minPrice && p.cost <= maxPrice);

    if(criteria === "priceAsc") filtered.sort((a,b) => a.cost - b.cost);
    else if(criteria === "priceDesc") filtered.sort((a,b) => b.cost - a.cost);
    else if(criteria === "soldDesc") filtered.sort((a,b) => b.soldCount - a.soldCount);

    displayProducts(filtered);
}
