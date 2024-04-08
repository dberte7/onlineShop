document.getElementById('applyFilter').addEventListener('click', loadProducts);

let shoppingCartItems = [];

function loadProducts() {
  const minPrice = document.getElementById('minPrice').value;
  const category = document.getElementById('category').value.toLowerCase();
  const brand = document.getElementById('brand').value.toLowerCase();

  fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
      const filteredProducts = data.products.filter(product => 
        product.price >= (minPrice || 0) &&
        (category ? product.category.toLowerCase().includes(category) : true) &&
        (brand ? product.brand.toLowerCase().includes(brand) : true)
      );

      displayProducts(filteredProducts);
    });
}

function displayProducts(products) {
  const productResults = document.getElementById('productResults');
  productResults.innerHTML = '';

  let cardsHtml = '<div class="row">';

  products.forEach((product, index) => {
    const productCard = `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.category} - ${product.price}$</p>
            <button onclick="addToCart(${product.id})" class="btn btn-primary mt-auto">Añadir a carrito</button>
          </div>
        </div>
      </div>
    `;

    cardsHtml += productCard;
  });

  cardsHtml += '</div>';

  productResults.innerHTML = cardsHtml;
}


function addToCart(productId) {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then(response => response.json())
    .then(product => {
      shoppingCartItems.push(product);
      updateCart();
      Swal.fire('Producto añadido', `${product.title} ha sido añadido al carrito.`, 'success');
    });
}

function removeFromCart(index) {
    shoppingCartItems.splice(index, 1);
    updateCart();
}
  
function updateCart() {
    const shoppingCart = document.getElementById('shoppingCart');
    shoppingCart.innerHTML = '<h4>Carrito</h4>';
    shoppingCartItems.forEach((item, index) => {
        shoppingCart.innerHTML += `<p>${item.title} - ${item.price}$ <span class="remove-item" onclick="removeFromCart(${index})" style="cursor:pointer;color:red;">X</span></p>`;
    });
}

loadProducts();
