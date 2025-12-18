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

function renderCart() {
  cartContainer.innerHTML = '';
  let total = 0;

  Object.values(cart).forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <span>${item.title} x${item.quantity}</span>
      <button onclick="removeFromCart(${item.id})">X</button>
    `;

    cartContainer.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCategories() {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

categoryFilter.addEventListener('change', () => {
  filteredProducts = categoryFilter.value === 'all'
    ? products
    : products.filter(p => p.category === categoryFilter.value);
  renderProducts(filteredProducts);
});

sortFilter.addEventListener('change', () => {
  const value = sortFilter.value;
  let sorted = [...filteredProducts];

  if (value === 'price-asc') sorted.sort((a,b)=>a.price-b.price);
  if (value === 'price-desc') sorted.sort((a,b)=>b.price-a.price);
  if (value === 'name-asc') sorted.sort((a,b)=>a.title.localeCompare(b.title));
  if (value === 'name-desc') sorted.sort((a,b)=>b.title.localeCompare(a.title));

  renderProducts(sorted);
});

searchInput.addEventListener('input', e => {
  const text = e.target.value.toLowerCase();
  const result = products.filter(p =>
    p.title.toLowerCase().includes(text)
  );
  renderProducts(result);
});

fetchProducts();
renderCart();