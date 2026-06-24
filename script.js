let cart = JSON.parse(localStorage.getItem('nssCart')) || [];

function saveCart() {
  localStorage.setItem('nssCart', JSON.stringify(cart));
  renderCart();
}

function addToCart(name, price, sizeSelectId) {
  let size = 'One Size';
  if (sizeSelectId) size = document.getElementById(sizeSelectId).value;
  cart.push({ name, price, size });
  saveCart();
  document.getElementById('cartDrawer').classList.add('open');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <strong>${item.name}</strong><br>
        <span>Size: ${item.size}</span><br>
        <span>$${item.price}</span><br>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });
  cartCount.textContent = cart.length;
  cartTotal.textContent = total;
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  alert('Checkout is ready to connect. Replace this alert with your Shopify, Stripe, or Fourthwall checkout link.');
  // Example later:
  // window.location.href = 'https://your-shopify-store.com/cart';
}

function closePopup() {
  document.getElementById('emailPopup').classList.remove('show');
  localStorage.setItem('nssPopupClosed', 'true');
}

function subscribeEmail(event) {
  event.preventDefault();
  const email = document.getElementById('emailInput').value;
  localStorage.setItem('nssSubscriberEmail', email);
  document.getElementById('subscribeMessage').textContent = 'You are now inside the society.';
  setTimeout(closePopup, 1300);
}

window.addEventListener('load', () => {
  renderCart();
  if (!localStorage.getItem('nssPopupClosed')) {
    setTimeout(() => {
      document.getElementById('emailPopup').classList.add('show');
    }, 1200);
  }
});
