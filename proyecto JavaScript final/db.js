const API_URL = 'https://fakestoreapi.com/products';

const productsContainer = document.getElementById('products');
const cartContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const searchInput = document.getElementById('search');

let products = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || {};

async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    products = await res.json();
    filteredProducts = [...products];
    renderProducts(filteredProducts);
    loadCategories();
  } catch (error) {
    console.error('Error al cargar productos', error);
      }
}

function renderProducts(list) {
  productsContainer.innerHTML = '';
  list.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${product.image}">
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <small>${product.category}</small>
      <button onclick="addToCart(${product.id})">Agregar</button>
    `;

    productsContainer.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (cart[id]) {
    cart[id].quantity++;
  } else {
    cart[id] = { ...product, quantity: 1 };
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  renderCart();
}