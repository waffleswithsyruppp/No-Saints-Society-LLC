let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
  document.getElementById("cart").classList.add("open");
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <p>${item.name}</p>
        <p>$${item.price}</p>
      </div>
    `;
  });

  cartTotal.textContent = total;
  cartCount.textContent = cart.length;
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function checkout() {
  alert("Checkout is ready visually. Connect Shopify, Stripe, or Fourthwall for real payments.");
}

function closePopup() {
  document.getElementById("popup").classList.add("hide");
}
