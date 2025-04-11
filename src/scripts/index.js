import { fetchProducts, addProducts, checkAdmin, getCategories, updateProduct } from "../utils/api.js";
import { cartBalanceUpdate, updateLoginLink } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", async function () {
  let isAdmin = await checkAdmin();;
  loadProducts(isAdmin);
  updateCartItems();
  updateLoginLink();
  testCheckAdmin();
  addProductForm(isAdmin);
});


async function testCheckAdmin() {
  let test = JSON.parse(localStorage.getItem("user"));

}

async function loadProducts(isAdmin) {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>Loading products...</p>";

  try {
    const products = await fetchProducts();
    productsContainer.innerHTML = "";

    if (products.length > 0) {
      products.forEach((product) => {
        const card = isAdmin
          ? createAdminProductCard(product)
          : createProductCard(product);
        productsContainer.appendChild(card);
      });

      // Setup kategori-filter efter att produkter laddats
      setupCategoryFilters(products, isAdmin);
    } else {
      productsContainer.innerHTML = "<p>No products available.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Failed to load products.</p>";
  }
}


function createAdminProductCard(product) {
  const element = document.createElement("div");
  let productStock = "Lager: " + product.stock + "st";
  element.className = "product-card";
  element.innerHTML = `
    <img src="${product.imageUrl}" alt="Bild på ${product.name}" class="prod-card-img">
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <p>${productStock}</p>
    <button class="view-product-btn">Visa produkt</button>
    <button class="edit-product-btn">Redigera produkt</button>
    <button class="add-to-cart-btn">Lägg i varukorg</button>
  `;

  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    addToCart(product);
  });
  element.querySelector(".edit-product-btn").addEventListener("click", () => {
    editProduct(product);
  });
  element.querySelector(".view-product-btn").addEventListener("click", () => {
    window.location.href = `product.html?id=${product._id}`;
  });

  return element;
}

function createProductCard(product) {
  const element = document.createElement("div");
  let productStock = "Lager: " + product.stock + "st";
  element.className = "product-card";
  element.innerHTML = `
    <img src="${product.imageUrl}" alt="Bild på ${product.name}" class="prod-card-img">
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <p>${productStock}</p>
    <button class="view-product-btn">Visa produkt</button>
    <button class="add-to-cart-btn">Lägg i varukorg</button>
  `;

  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    addToCart(product);
  });
  element.querySelector(".view-product-btn").addEventListener("click", () => {
    window.location.href = `product.html?id=${product._id}`;
  });

  return element;
}


function addProductForm(isAdmin) {
  if (isAdmin) {
    try {
      let formContainer = document.getElementById("addProductContainer");
      let form = document.createElement("form")
      form.setAttribute("id", "addProduct");
      form.innerHTML = `
        <label for="name">Namn på produkt</label>
        <input type="text" name="name" id="name" class="prodInp" required>
        <label for="ImgUrl">Bild url</label>
        <input type="text" class="prodInp" id="imageUrl" required>
        <label for="price">Pris</label>
        <input type="number" name="price" id="price" class="prodInp" min="0.01" value="0" step="any" required>
        <label for="category">Kategori</label>
        <select name="category" id="category" class="prodInp">
        <option value=""></option>
        </select>
        <label for="description">Beskrivning</label>
        <textarea name="description" id="description" class="prodInp"></textarea>
        <label for="stock">Lager</label>
        <input type="number" name="stock" id="stock" class="prodInp" min="0" value="0">
        <button type="submit">Lägg till</button>
    `
      formContainer.innerHTML = ""
      formContainer.appendChild(form);
      fillCategory();

      document.getElementById("addProduct").addEventListener("submit", function (e) {
        e.preventDefault();
        addProduct();
        loadProducts();
      });

    } catch (error) {
      console.error("Error showing product form: ", error)
    }
  }

}
/* Ändrat lite för kategorier */
async function fillCategory() {
  try {
    let categories = await getCategories();
    let categoryContainer = document.getElementById("category")
    categories.forEach(category => {
      let element = document.createElement("option");
      element.innerHTML = `${category.name}`;
      element.value = `${category._id}`
      categoryContainer.appendChild(element);
    });
  } catch (error) {
    console.error("Error storing categories", error)
  }
}

async function addProduct() {
  try {
    const product = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      imageUrl: document.getElementById("imageUrl").value,
      category: document.getElementById("category").value,
      stock: document.getElementById("stock").value
    };
    addProducts(product);
    loadProducts();
    document.getElementById("addProduct").reset();
  } catch (error) {
    console.error("Error adding product: ", error);
  }
}

async function editProduct(product) {
  let name = product.name;
  let description = product.description;
  let price = product.price;

  if (confirm("Vill du byta namn på produkten?")) {
    let newName = prompt(`Skriv in nytt namn för produkten. ${product.name}`, product.name);
    if (newName) {
      name = newName;
    }
  }
  if (confirm("Vill du byta beskrivning för produkten?")) {
    let newDesc = prompt(`Skriv in ny beskrivning för produkten. ${product.description}`, product.description);
    if (newDesc) {
      description = newDesc;
    }
  }
  if (confirm("Vill du byta pris på produkten?")) {
    let newPrice = prompt(`Skriv in nytt pris för produkten. ${product.price}`, product.price);
    if (newPrice && !isNaN(newPrice)) {
      price = parseFloat(newPrice);
    }
  }
  let editedProduct = { name, description, price };
  await updateProduct(editedProduct, product._id);
  loadProducts();
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProductId = cart.findIndex(item => JSON.stringify(item.product) === JSON.stringify(product));
  console.log(cart)
  if (existingProductId !== -1) {
    let existingProduct = cart[existingProductId];
    let updatedQuantity = existingProduct.quantity + 1;
    if (updatedQuantity > product.stock) {
      alert("You already have all the stock in your cart");
      existingProduct.quantity = product.stock;
    } else {
      existingProduct.quantity = updatedQuantity;
    }
    cart[existingProductId] = existingProduct;
    console.log(cart)
  } else {
    if (product.stock > 0) {
      cart.push({
        product: product,
        quantity: 1
      });
      console.log(cart)
    } else {
      alert("out of stock")
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  cartBalanceUpdate();
}
/* Fixed for Category---------------------- */
async function updateCartItems() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = await fetchProducts();

  cart = cart.filter(item => {
    let exists = products.some(product => item.product._id === product._id);
    return exists;
  });

  cart.forEach(item => {
    products.forEach(product => {
      if (item.product._id === product._id) {
        item.product = product;
        if (item.quantity > item.product.stock) {
          item.quantity = item.product.stock;
        }
      }
    });
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  cartBalanceUpdate();
}

// Filtrera produkter utifrån kategori
function setupCategoryFilters(products, isAdmin) {
  const categoryLinks = document.querySelectorAll(".category-menu a");

  categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedCategory = link.dataset.category;

      const productsContainer = document.getElementById("products");
      productsContainer.innerHTML = "";

      const filtered = selectedCategory === "Alla"
        ? products
        : products.filter(product => product.category?.name === selectedCategory);
         /*ändrat på product.filter-------------------------- */

      if (filtered.length > 0) {
        filtered.forEach((product) => {
          const card = isAdmin
            ? createAdminProductCard(product)
            : createProductCard(product);
          productsContainer.appendChild(card);
        });
      } else {
        productsContainer.innerHTML = "<p>Inga produkter i den kategorin.</p>";
      }
    });
  });
}
