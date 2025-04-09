const categoriesContainer = document.querySelector('#categories');
const productsContainer = document.querySelector('#products');
const paginationContainer = document.querySelector('#pagination');
const loader = document.querySelector('#loader');
const modeToggle = document.querySelector('#mode-toggle');

const imageModal = document.querySelector('#image-modal');
const modalImg = document.querySelector('#modal-img');
const closeModalBtn = document.querySelector('#close-modal');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');

let allProducts = [];
let currentPage = 1;
let currentImageIndex = 0;
const productsPerPage = 6;

modeToggle.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
});

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function getCategories() {
  axios.get('https://fakestoreapi.com/products/categories')
    .then(function (response) {
      let categories = response.data;
      displayCategories(categories);
    });
}

function displayCategories(categories) {
  categoriesContainer.innerHTML = '';
  for (let i = 0; i < categories.length; i++) {
    let box = document.createElement('div');
    box.className = 'category-box';
    box.textContent = categories[i];
    box.addEventListener('click', function () {
      getProductsByCategory(categories[i]);
    });
    categoriesContainer.appendChild(box);
  }
}

function getProducts() {
  showLoader();
  axios.get('https://fakestoreapi.com/products')
    .then(function (response) {
      allProducts = response.data;
      currentPage = 1;
      hideLoader();
      displayProducts();
      displayPagination();
    });
}

function getProductsByCategory(category) {
  showLoader();
  axios.get(`https://fakestoreapi.com/products/category/${category}`)
    .then(function (response) {
      allProducts = response.data;
      currentPage = 1;
      hideLoader();
      displayProducts();
      displayPagination();
    });
}

function displayProducts() {
  productsContainer.innerHTML = '';
  let start = (currentPage - 1) * productsPerPage;
  let end = start + productsPerPage;
  let currentProducts = [];

  for (let i = start; i < end && i < allProducts.length; i++) {
    currentProducts.push(allProducts[i]);
  }

  for (let i = 0; i < currentProducts.length; i++) {
    let product = currentProducts[i];
    let card = document.createElement('div');
    card.className = 'product-card';

    let img = document.createElement('img');
    img.src = product.image;
    img.addEventListener('click', function () {
      openModal(product.image);
    });

    let title = document.createElement('h3');
    title.textContent = product.title;

    let price = document.createElement('p');
    price.textContent = '$' + product.price;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    productsContainer.appendChild(card);
  }
}

function displayPagination() {
  paginationContainer.innerHTML = '';
  let totalPages = Math.ceil(allProducts.length / productsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    let btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', function () {
      currentPage = i;
      displayProducts();
      displayPagination();
    });

    paginationContainer.appendChild(btn);
  }
}

function openModal(imgSrc) {
  currentImageIndex = getImageIndex(imgSrc);
  modalImg.src = imgSrc;
  imageModal.style.display = 'block';
}

function getImageIndex(imgSrc) {
  for (let i = 0; i < allProducts.length; i++) {
    if (allProducts[i].image === imgSrc) {
      return i;
    }
  }
  return 0;
}

closeModalBtn.addEventListener('click', function () {
  imageModal.style.display = 'none';
});

prevBtn.addEventListener('click', function () {
  currentImageIndex = (currentImageIndex - 1 + allProducts.length) % allProducts.length;
  modalImg.src = allProducts[currentImageIndex].image;
});

nextBtn.addEventListener('click', function () {
  currentImageIndex = (currentImageIndex + 1) % allProducts.length;
  modalImg.src = allProducts[currentImageIndex].image;
});

getCategories();
getProducts();
