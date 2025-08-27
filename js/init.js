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
    const session = localStorage.getItem('userSession');
    const usernameElement = document.getElementById('navbar-username');
    
    if (session && usernameElement) {
        const userData = JSON.parse(session);
        usernameElement.textContent = userData.username;
        usernameElement.style.display = 'inline';
    } else if (usernameElement) {
        usernameElement.style.display = 'none';
    }
}

/* Codigo para que redireccione a Login o Index segun corresponda*/
document.addEventListener('DOMContentLoaded', function() {
    const session = localStorage.getItem('userSession'); //Obtiene los datos desde localstorage
    if (session && window.location.pathname.includes(`login.html`)){ // Verifica si existe una sesión almacenada Y si la página actual es 'login.html'
      window.location.href =`index.html`; //redirige a index
    }
    else if
      (!session && !window.location.pathname.includes(`login.html`)){
      window.location.href =`login.html`;  // Acá, si no estas logueado, te redirige a login por siempre hasta que te loguees
    }
    
    // Mostrar nombre de usuario en la barra de navegación
    mostrarNombreUsuario();
});
