// Event listener para cargar los productos automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadProducts(1); // Carga los productos automáticamente cuando la página se carga
});

// Event listener para el botón de aplicar filtro
document.getElementById('applyFilter').addEventListener('click', (event) => {
  event.preventDefault(); // Evitar recarga de la página
  loadProducts(1); // Cargar productos con el filtro aplicado
});

// Variables globales
let shoppingCartItems = []; // Almacena los elementos del carrito de compras
let filteredProducts = []; // Almacena los productos filtrados
let currentPage = 1; // Variable para controlar la página actual

// Función para cargar los productos
function loadProducts(page) {
  currentPage = page; // Actualizar la página actual
  const minPrice = document.getElementById('minPrice').value; // Obtener el valor mínimo del precio
  const category = document.getElementById('category').value.toLowerCase(); // Obtener la categoría y convertirla a minúsculas
  const brand = document.getElementById('brand').value.toLowerCase(); // Obtener la marca y convertirla a minúsculas

  // Petición para obtener los productos
  fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
      // Filtrar los productos basados en el precio, categoría y marca
      filteredProducts = data.products.filter(product => 
        product.price >= (minPrice || 0) &&
        (!category || product.category.toLowerCase().includes(category)) &&
        (!brand || product.brand.toLowerCase().includes(brand))
      );
      console.log('Productos filtrados:', filteredProducts.length);
      displayProducts(currentPage); // Mostrar los productos en la página actual
      renderPagination(filteredProducts.length); // Renderizar la paginación basada en la cantidad de productos filtrados
    }).catch(error => {
      console.error('Error al cargar productos:', error);
  });;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Función para mostrar los productos en la página
function displayProducts(page) {
  const productResults = document.getElementById('productResults');
  productResults.innerHTML = '';
  const itemsPerPage = 6; // Número de productos por página
  const startIndex = (page - 1) * itemsPerPage;
  const selectedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  let cardsHtml = '<div class="row">';

  // Generar el HTML para cada producto seleccionado
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

// Función para renderizar la paginación
function renderPagination(totalProducts) {
  const totalPages = Math.ceil(totalProducts / 6); // Calcular el número total de páginas
  const paginationElement = document.getElementById('pagination');

  // Limpiar los elementos de paginación
  paginationElement.innerHTML = '';

  // Añadir los números de página
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
    loadProducts(newPage); // Cargar productos de la nueva página
  }
}

// Función para añadir un producto al carrito
function addToCart(productId) {
  fetch(`https://dummyjson.com/products/${productId}`)
  .then(response => response.json())
  .then(product => {
    shoppingCartItems.push(product); // Añadir el producto al carrito
    displaycart(); // Mostrar el carrito actualizado
    Swal.fire({
      title: "Producto añadido",
      html: `${product.title} ha sido añadido al carrito.`,
      timer: 2000,
      icon: "success",
      timerProgressBar: true,
      showConfirmButton: false
    }).then((result) => {
      /* Leer más sobre cómo manejar rechazos a continuación */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });     
  });
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
  Swal.fire({
    title: "¿Estas seguro?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "¡Eliminado!",
        text: "Tu producto ha sido eliminado",
        icon: "success"
      });
      shoppingCartItems.splice(index, 1); // Eliminar el producto del carrito
      displaycart(); // Mostrar el carrito actualizado
    }
  });
}

// Función para mostrar el carrito
function displaycart(){
  document.getElementById("count").innerHTML=shoppingCartItems.length; // Mostrar la cantidad de elementos en el carrito
  const shoppingCart = document.getElementById('cartItem');
  shoppingCart.innerHTML = ""; // Limpiar el contenido del carrito
  
  let total = 0;

  // Si el carrito está vacío, mostrar un mensaje
  if(shoppingCartItems.length==0){
    document.getElementById('cartItem').innerHTML = "Tu carrito está vacío.";
    document.getElementById('cartTotal').innerHTML = "Total: €0";
  }
  else{
    const shoppingCart = document.getElementById('cartItem');
    // Mostrar cada producto en el carrito
    shoppingCartItems.forEach((item, index) => {
      shoppingCart.innerHTML += `
        <div class='cart-item'>
          <div class='row-img'>
            <img class='rowimg' src=${item.thumbnail} alt=${item.title}>
          </div>
          <p>${item.title}</p>
          <p class="font-weight-bold">€${item.price}</p>
          <i class='fa-solid fa-trash' onclick='removeFromCart(${index})'></i> <!-- Botón para eliminar un producto -->
        </div>
      `
      total += item.price;
    });
    document.getElementById('cartTotal').innerHTML = `Total: €${total.toFixed(2)}`; // Mostrar el total del carrito
  }
}

// Cargar productos al inicio
loadProducts();
