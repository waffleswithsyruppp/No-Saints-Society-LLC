let cart = JSON.parse(localStorage.getItem("nssCart")) || [];

function saveCart() {
  localStorage.setItem("nssCart", JSON.stringify(cart));
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const sizeSelect = document.getElementById("sizeSelect");
  const size = sizeSelect ? sizeSelect.value : product.sizes[0];

  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    size: size
  });

  saveCart();
  updateCart();
  document.getElementById("cart").classList.add("open");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartCount || !cartTotal) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <p><strong>${item.name}</strong></p>
        <p>Size: ${item.size}</p>
        <p>$${item.price}</p>
        <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  cartCount.innerText = cart.length;
  cartTotal.innerText = total;
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function checkout() {
  alert("Demo checkout. Connect Shopify, Stripe, or Fourthwall to accept real payments.");
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function renderHomeProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
      </a>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <p class="stock">${product.stock}</p>
        <a href="product.html?id=${product.id}">
          <button>View Product</button>
        </a>
      </div>
    </div>
  `).join("");
}

function renderProductPage() {
  const page = document.getElementById("productPage");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = products.find(p => p.id === productId);

  if (!product) {
    page.innerHTML = "<h1>Product not found.</h1>";
    return;
  }

  document.title = product.name + " | No Saints Society";

  page.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="product-details">
      <h1>${product.name}</h1>
      <p class="price">$${product.price}</p>
      <p class="stock">${product.stock}</p>
      <p>${product.description}</p>

      <h2>Details</h2>
      <ul>
        <li><strong>Material:</strong> ${product.material}</li>
        <li><strong>Fit:</strong> ${product.fit}</li>
        <li><strong>Color:</strong> ${product.color}</li>
        ${product.details.map(detail => `<li>${detail}</li>`).join("")}
        <li><strong>Care:</strong> ${product.care}</li>
      </ul>

      <label>Size</label>
      <select id="sizeSelect">
        ${product.sizes.map(size => `<option>${size}</option>`).join("")}
      </select>

      <button onclick="addToCart('${product.id}')">Add To Cart</button>
    </div>
  `;
}

renderHomeProducts();
renderProductPage();
updateCart();
