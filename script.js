document.addEventListener('DOMContentLoaded', () => {
  loadProducts(1); // Carga los productos automáticamente cuando la página se carga
});

document.getElementById('applyFilter').addEventListener('click', () => loadProducts(1));

let shoppingCartItems = [];
let filteredProducts = [];
let currentPage = 1; // Nueva variable para controlar la página actual

function loadProducts(page) {
  currentPage = page;
  const minPrice = document.getElementById('minPrice').value;
  const category = document.getElementById('category').value.toLowerCase();
  const brand = document.getElementById('brand').value.toLowerCase();

  fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
        // Filtrar y almacenar los productos en una variable global
        filteredProducts = data.products.filter(product => 
          product.price >= (minPrice || 0) &&
          (!category || product.category.toLowerCase().includes(category)) &&
          (!brand || product.brand.toLowerCase().includes(brand))
        );

        displayProducts(currentPage); // Llamar a displayProducts con la página actual
        renderPagination(filteredProducts.length); // Renderizar la paginación basada en la cantidad de productos filtrados
    });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function displayProducts(page) {
  const productResults = document.getElementById('productResults');
  productResults.innerHTML = '';
  const itemsPerPage = 6;
  const startIndex = (page - 1) * itemsPerPage;
  const selectedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  let cardsHtml = '<div class="row">';

  selectedProducts.forEach(product => {
    let formattedCategory = capitalizeFirstLetter(product.category);
    cardsHtml += `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          <div class="card-body d-flex flex-column">
            <h2 class="card-title">${product.title}</h2>
            <p class="card-text">${formattedCategory}</p>
            <div class="card-bottom">
              <h3>${product.price}€</h3>
              <button onclick="addToCart(${product.id})" class="btn btn-primary mt-auto">Añadir</button>
            </div> 
          </div>
        </div>
      </div>
    `;
  });

  cardsHtml += '</div>';
  productResults.innerHTML = cardsHtml;
}

function renderPagination(totalProducts) {
  const totalPages = Math.ceil(totalProducts / 6);
  const paginationElement = document.getElementById('pagination');

  // Limpiamos los elementos de la paginación completamente
  paginationElement.innerHTML = '';

  // Añadimos los números de página directamente
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
    pageItem.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
    paginationElement.appendChild(pageItem);
  }
}

// Función para cambiar de página
function changePage(newPage) {
  if (newPage >= 1 && newPage <= Math.ceil(filteredProducts.length / 6)) {
    loadProducts(newPage); // Asegúrate de que esta llamada esté pasando la nueva página correctamente
  }
}

function addToCart(productId) {
  fetch(`https://dummyjson.com/products/${productId}`)
  .then(response => response.json())
  .then(product => {
    shoppingCartItems.push(product);
    displaycart();
    let timerInterval;
    Swal.fire({
      title: "Producto añadido",
      html: `${product.title} ha sido añadido al carrito.`,
      timer: 2000,
      icon: "success",
      timerProgressBar: true,
      showConfirmButton: false
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });     
  });
}

function removeFromCart(index) {
  shoppingCartItems.splice(index, 1);
  displaycart();
}

function displaycart(){
  document.getElementById("count").innerHTML=shoppingCartItems.length;
  const shoppingCart = document.getElementById('cartItem');
  shoppingCart.innerHTML = "";

  if(shoppingCartItems.length==0){
    document.getElementById('cartItem').innerHTML = "Tu carrito esta vacio.";
  }
  else{
    const shoppingCart = document.getElementById('cartItem');
    shoppingCartItems.forEach((item, index) => {
      shoppingCart.innerHTML += `
        <div class='cart-item'>
          <div class='row-img'>
            <img class='rowimg' src=${item.thumbnail} alt=${item.title}>
          </div>
          <p>${item.title}</p>
          <p class="font-weight-bold">€${item.price}</p>
          <i class='fa-solid fa-trash' onclick='removeFromCart(${index})'></i>
        </div>
      `
    });
  }
}

loadProducts();
