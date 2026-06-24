let cart = JSON.parse(localStorage.getItem("nssCart")) || [];
let currentImageIndex = 0;
let currentProductImages = [];

function saveCart() {
  localStorage.setItem("nssCart", JSON.stringify(cart));
}

function getProduct(productId) {
  return products.find(p => p.id === productId);
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;

  const sizeSelect = document.getElementById("sizeSelect");
  const size = sizeSelect ? sizeSelect.value : product.sizes[0];

  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    size: size,
    image: product.image
  });

  saveCart();
  updateCart();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
  renderFullCart();
  renderCheckout();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");

  if (cartCount) cartCount.innerText = cart.length;
  if (cartTotalEl) cartTotalEl.innerText = cartTotal();

  if (!cartItems) return;

  cartItems.innerHTML = cart.length ? "" : "<p>Your cart is empty.</p>";

  cart.forEach((item, index) => {
    cartItems.innerHTML += `
      <div class="cart-item">
        <a href="product.html?id=${item.id}">
          <img src="${item.image}" alt="${item.name}">
        </a>
        <div>
          <a href="product.html?id=${item.id}"><strong>${item.name}</strong></a>
          <p>Size: ${item.size}</p>
          <p>$${item.price}</p>
          <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  });
}

function renderFullCart() {
  const fullCartItems = document.getElementById("fullCartItems");
  const fullCartTotal = document.getElementById("fullCartTotal");

  if (!fullCartItems || !fullCartTotal) return;

  fullCartTotal.innerText = cartTotal();
  fullCartItems.innerHTML = cart.length ? "" : "<p>Your cart is empty.</p>";

  cart.forEach((item, index) => {
    fullCartItems.innerHTML += `
      <div class="full-cart-item">
        <a href="product.html?id=${item.id}">
          <img src="${item.image}" alt="${item.name}">
        </a>
        <div>
          <a href="product.html?id=${item.id}"><h3>${item.name}</h3></a>
          <p>Size: ${item.size}</p>
          <p>$${item.price}</p>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  });
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
}

function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
}

function toggleMenu() {
  document.getElementById("sideMenu")?.classList.toggle("open");
}

function closeMenu() {
  document.getElementById("sideMenu")?.classList.remove("open");
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  window.location.href = "checkout.html";
}

function placeOrder() {
  alert("Demo checkout. Connect Stripe, Shopify, or Fourthwall to accept real payments.");
}

function renderCheckout() {
  const subtotalEl = document.getElementById("checkoutSubtotal");
  const shippingEl = document.getElementById("checkoutShipping");
  const totalEl = document.getElementById("checkoutTotal");

  if (!subtotalEl || !shippingEl || !totalEl) return;

  const subtotal = cartTotal();
  const shipping = subtotal > 0 ? 8 : 0;

  subtotalEl.innerText = subtotal;
  shippingEl.innerText = shipping;
  totalEl.innerText = subtotal + shipping;
}

function renderHeaderFooter() {
  const header = document.getElementById("siteHeader");

  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <button class="hamburger" onclick="toggleMenu()">☰</button>

        <nav class="top-nav">
          <a href="shop.html">SHOP</a>
          <a href="collections.html">LIMITED COLLECTIONS</a>
          <a href="about.html">ABOUT US</a>
          <a href="contact.html">CONTACT</a>
          <a href="signin.html">SIGN IN</a>
        </nav>

        <button class="cart-link" onclick="window.location.href='cart.html'">
          CART (<span id="cartCount">0</span>)
        </button>
      </header>

      <aside class="side-menu" id="sideMenu">
        <button class="side-close" onclick="closeMenu()">×</button>
        <a href="shop.html">SHOP</a>
        <div class="side-sub">
          <a href="collections.html">LIMITED COLLECTIONS</a>
          <a href="shop.html?category=tshirts">T-SHIRTS</a>
          <a href="shop.html?category=hoodies">HOODIES</a>
          <a href="shop.html?category=keychains">KEYCHAINS</a>
        </div>
        <a href="about.html">ABOUT US</a>
        <a href="contact.html">CONTACT</a>
        <a href="signin.html">SIGN IN</a>
        <a href="cart.html">CART</a>
      </aside>

      <aside class="cart-drawer" id="cartDrawer">
        <button class="cart-close" onclick="closeCart()">×</button>
        <h2>YOUR CART</h2>
        <div id="cartItems"></div>
        <h3>Total: $<span id="cartTotal">0</span></h3>
        <button class="checkout-btn" onclick="checkout()">CHECKOUT</button>
        <button class="view-cart-btn" onclick="window.location.href='cart.html'">OPEN CART PAGE</button>
      </aside>
    `;
  }

  const footer = document.getElementById("siteFooter");

  if (footer) {
    footer.innerHTML = `
      <footer>
        <h3>NO SAINTS SOCIETY</h3>
        <p>
          Operated by WAFFLES CREATIVE LLC<br>
          PO BOX 60063<br>
          PALM BAY, FL 32906
        </p>
        <p>Exclusive. Private. No Exceptions.</p>
      </footer>
    `;
  }
}

function productCard(product) {
  return `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
      </a>
      <div class="product-info">
        <p class="eyebrow">${product.collectionName}</p>
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <p class="stock">${product.stock}</p>
        <a href="product.html?id=${product.id}">
          <button>VIEW PRODUCT</button>
        </a>
      </div>
    </div>
  `;
}

function renderHomeProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const path = window.location.pathname;
  const isHome = path.endsWith("/") || path.endsWith("index.html");
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  let filtered = products;

  if (category) {
    filtered = products.filter(p => p.category === category);
  }

  if (isHome) {
    filtered = products.filter(p => p.featured === true);
  }

  grid.innerHTML = filtered.map(productCard).join("");
}

function renderProductPage() {
  const page = document.getElementById("productPage");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = getProduct(productId);

  if (!product) {
    page.innerHTML = "<h1>Product not found.</h1>";
    return;
  }

  currentProductImages = product.images;
  currentImageIndex = 0;

  document.title = product.name + " | No Saints Society";

  page.innerHTML = `
    <div class="product-gallery">
      <button class="gallery-arrow left" onclick="changeImage(-1)">‹</button>
      <img id="mainProductImage" src="${product.images[0]}" alt="${product.name}">
      <button class="gallery-arrow right" onclick="changeImage(1)">›</button>

      <div class="thumbnail-row">
        ${product.images.map((img, index) => `
          <img src="${img}" onclick="setImage(${index})">
        `).join("")}
      </div>
    </div>

    <div class="product-details">
      <p class="eyebrow">${product.collectionName}</p>
      <h1>${product.name}</h1>
      <p class="price">$${product.price}</p>
      <p class="stock">${product.stock}</p>
      <p>${product.description}</p>

      <h2>DETAILS</h2>
      <ul>
        <li><strong>Material:</strong> ${product.material}</li>
        <li><strong>Fit:</strong> ${product.fit}</li>
        <li><strong>Color:</strong> ${product.color}</li>
        ${product.details.map(detail => `<li>${detail}</li>`).join("")}
        <li><strong>Care:</strong> ${product.care}</li>
      </ul>

      <label>SIZE</label>
      <select id="sizeSelect">
        ${product.sizes.map(size => `<option>${size}</option>`).join("")}
      </select>

      <button onclick="addToCart('${product.id}')">ADD TO CART</button>
    </div>
  `;
}

function setImage(index) {
  currentImageIndex = index;
  document.getElementById("mainProductImage").src = currentProductImages[currentImageIndex];
}

function changeImage(direction) {
  currentImageIndex += direction;

  if (currentImageIndex < 0) currentImageIndex = currentProductImages.length - 1;
  if (currentImageIndex >= currentProductImages.length) currentImageIndex = 0;

  document.getElementById("mainProductImage").src = currentProductImages[currentImageIndex];
}

renderHeaderFooter();
renderHomeProducts();
renderProductPage();
renderFullCart();
renderCheckout();
updateCart();
