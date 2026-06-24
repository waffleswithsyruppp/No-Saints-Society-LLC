let cart = [];

function addToCart(product, price){

cart.push({
product,
price
});

updateCart();

document.getElementById("cart").classList.add("open");
}

function updateCart(){

let cartItems = document.getElementById("cartItems");

let cartCount = document.getElementById("cartCount");

let cartTotal = document.getElementById("cartTotal");

cartItems.innerHTML="";

let total = 0;

cart.forEach(item=>{

total += item.price;

cartItems.innerHTML += `
<p>${item.product} - $${item.price}</p>
`;
});

cartCount.innerText = cart.length;

cartTotal.innerText = total;
}

function toggleCart(){

document.getElementById("cart").classList.toggle("open");
}

function checkout(){

alert("Connect Shopify, Stripe, or Fourthwall to enable payments.");
}

function closePopup(){

document.getElementById("popup").style.display="none";
}
