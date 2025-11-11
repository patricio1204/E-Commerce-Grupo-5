const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

// Función para mostrar el nombre de usuario en la barra de navegación
function mostrarNombreUsuario() {
  // Obtener datos de sesión del almacenamiento local
  const session = localStorage.getItem('userSession');
  // Obtener elemento donde mostrar el nombre de usuario
  const usernameElement = document.getElementById('navusername');
  // Obtener enlace de inicio de sesión
  const loginLink = document.querySelector('.nav-link[href="login.html"]');

  // Si hay sesión y elemento de usuario existe
  if (session && usernameElement) {
    // Parsear datos de usuario y mostrar nombre
    const userData = JSON.parse(session);
    usernameElement.textContent = userData.usuario || "Usuario";
    usernameElement.style.display = '';
    // remover enlace de login si existe
    if (loginLink) {
      loginLink.remove();
    }
  } else if (usernameElement) {
    // Si no hay sesión, remueve nombre de usuario
    usernameElement.remove();
  }
}

window.addEventListener("storage", mostrarNombreUsuario);


/* Código para que redireccione a Login o Index según corresponda */
document.addEventListener('DOMContentLoaded', function () {
  const session = localStorage.getItem('userSession');
  if (session && window.location.pathname.includes(`login.html`)) {
    window.location.href = `index.html`;
  }
  else if
    (!session && !window.location.pathname.includes(`login.html`)) {
    window.location.href = `login.html`;
  }

  mostrarNombreUsuario();

  // cerrar sesión
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("userSession");
      window.location = "login.html";
    });
  }
});


//CAMBIO DE TEMA OSCURO O CLARO
function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const isDark = savedTheme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  updateThemeButton(isDark);
}

function updateThemeButton(isDark) {
  const sunIcon = document.getElementById('icon-sun');
  const moonIcon = document.getElementById('icon-moon');
  const themeText = document.getElementById('theme-text');

  if (isDark) {
    sunIcon && (sunIcon.style.display = 'inline');
    moonIcon && (moonIcon.style.display = 'none');
    themeText && (themeText.textContent = 'Modo Claro');
  } else {
    sunIcon && (sunIcon.style.display = 'none');
    moonIcon && (moonIcon.style.display = 'inline');
    themeText && (themeText.textContent = 'Modo Oscuro');
  }
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButton(isDark);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  setupThemeToggle();
});



//CARGA DE NAV-BAR DINÁMICO 
document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");

  if (navbarContainer) {
    fetch("nav-bar.html")
      .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar la barra de navegación.");
        return response.text();
      })
      .then(data => {
        navbarContainer.innerHTML = data;

        // Iniciar  Bootstrap
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => new bootstrap.Dropdown(dropdown));

        // ejecutar func del badge cuando el elemento está en el DOM
        if (typeof actualizarBadgeCarrito === "function") {
          actualizarBadgeCarrito();
        }

        // D/L mode
        if (typeof initDarkMode === "function") {
          initDarkMode();
        }
      })
      .catch(error => console.error("Error al cargar la barra de navegación:", error));
  }
});





//El señor baaaadge
function actualizarBadgeCarrito() {
  const cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
  const badge = document.getElementById("cart-badge");
  const totalCantidad = cartProducts.reduce((sum, p) => sum + p.quantity, 0);

  if (badge) {
    badge.textContent = totalCantidad;
    badge.style.display = totalCantidad > 0 ? "flex" : "none";
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", actualizarBadgeCarrito);

// Opcional: actualizar si se modifica el carrito desde otra pestaña
window.addEventListener("storage", actualizarBadgeCarrito);

