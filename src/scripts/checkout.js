import { buyItems } from "../utils/api.js";
import { cartBalanceUpdate, updateLoginLink } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", function () {
    checkLoggedIn();
    loadOrderItems();
    cartBalanceUpdate();
    updateLoginLink();
})

function checkLoggedIn() {
    let user = localStorage.getItem("user");
    if (user === null) {
        alert("Please log in before ordering!.")
        window.location.href = "login.html"
    }
}

function loadOrderItems() {
    const orderContainer = document.getElementById("order-container");
    const paymentText = document.getElementById("order-sum-payment");
    orderContainer.innerHTML = "";
    let itemSum = 0;
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length > 0) {
            cart.forEach((item) => {
                let itemProd = item.product;
                let itemDisplay = document.createElement("div");
                let name = itemProd.name;
                let img = itemProd.imageUrl;
                let price = itemProd.price;
                let quantity = item.quantity;
                itemDisplay.innerHTML = `
                <div class="order-item">
                <img src="${img}" alt="Bild på ${name}" class="checkout-img">
                <h3>${quantity}st</h3>
                <h3>${name}</h3>
                <h3>$${(price * quantity).toFixed(2)}</h3>
                </div>
                `
                orderContainer.appendChild(itemDisplay);
                itemSum += item.product.price * item.quantity;
            });
        }

        paymentText.innerHTML = "$" + itemSum.toFixed(2);
        cartBalanceUpdate();
    } catch (error) {
        console.error("Error fetching items:", error);
        orderContainer.innerHTML = "<p>Failed to load items.</p>";
    }
}

document.getElementById("purchase-button").addEventListener("click", async function () {
    const confirmed = window.confirm("Vill du slutföra köpet?");
    if (confirmed) {
        let cart = localStorage.getItem("cart");
        if (cart && cart.length > 0) {
            let cartItems = JSON.parse(cart) || [];
            let formattedCart = {
                items: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                }))
            };

            const orderSuccess = await buyItems(formattedCart);

            if (orderSuccess) {
                alert("Köp slutfört! Tack för att du handlade hos Hakims Liv.");
                localStorage.setItem("cart", "[]");
                cartBalanceUpdate();
                window.location.href = "index.html";
            } else {
                alert("There has been an error with your order, please try again later.");
            }
        } else {
            alert("Your cart is empty.");
        }
    } else {
        console.log("Purchase was canceled.");
    }
});
