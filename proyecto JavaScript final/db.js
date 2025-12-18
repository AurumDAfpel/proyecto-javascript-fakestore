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