const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
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
        usernameElement.textContent = userData.usuario;
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

/* Código para que redireccione a Login o Index según corresponda */
document.addEventListener('DOMContentLoaded', function() {
    const session = localStorage.getItem('userSession');
    if (session && window.location.pathname.includes(`login.html`)){
      window.location.href =`index.html`;
    }
    else if
      (!session && !window.location.pathname.includes(`login.html`)){
      window.location.href =`login.html`;
    }

    mostrarNombreUsuario();

    // cerrar sesión
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("userSession");
            window.location = "login.html";
        });
    }
});
