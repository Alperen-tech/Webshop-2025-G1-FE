export function getBaseUrl() {
  if (!window.location.href.includes('localhost')) {
    return "https://webshop-2025-be-g7-temp.vercel.app/";
  }
  return "http://localhost:3000/";
}

export function updateLoginLink() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loginLink = document.querySelector(".icon-link[href='login.html']");

  if (user && loginLink) {
    loginLink.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logga ut`;
    loginLink.href = "#";

    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
}

export function cartBalanceUpdate() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart.length > 0) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let sum = 0;
    cart.forEach(item => {
      sum += item.product.price * item.quantity;
    });

    const cartBalanceEl = document.getElementById("cartBalance");
    if (cartBalanceEl) {
      cartBalanceEl.textContent = `$${sum.toFixed(2)}`;
    }
  } else {
    const cartBalanceEl = document.getElementById("cartBalance");
    if (cartBalanceEl) {
      cartBalanceEl.textContent = `$0`;
    }
  }
}
