import { getLocalStorage, loadHeaderFooter, renderListWithTemplate, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
    return `<li class="cart-card divider">
  <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
  </a>
  <a href="../product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <button class="card-qty-change card-qty-down" data-id="${item.Id}">-</button>
  <p class="cart-card__quantity">qty: ${item.Quantity}</p>
  <button class="card-qty-change card-qty-up" data-id="${item.Id}">+</button>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-item-removal" data-id="${item.Id}">X</button>
</li>`;
}

export async function updateCartDisplayNumber() {
    const cartCount = document.querySelector(".cart-count");
    if (!cartCount) { return; }

    const count = ShoppingCart.getCartItems().reduce((total, item) => total + item.Quantity, 0);

    cartCount.textContent = count;
    Object.assign(cartCount.style, {
        backgroundColor: "var(--primary-color)",
        borderRadius: "10px",
        padding: "0 0.4rem",
        position: "absolute",
        left: "12px",
        top: "8px",
        display: count > 0 ? "inline-block" : "none"
    });
}

export default class ShoppingCart {
    constructor(listElement) {
        this.listElement = listElement;
    }

    init() {
        updateCartDisplayNumber();

        if (this.isCartEmpty()) {
            this.listElement.innerHTML = "<li class='cart-card'>Your cart is empty.</li>";
            document.querySelector(".cart-card").style.border = "none";

            // Hide the cart footer on the page
            document.querySelector(".cart-footer-hide").style.display = "none";
            return;
        }

        this.renderCart(ShoppingCart.getCartItems());
    }

    static getCartItems() {
        return getLocalStorage("so-cart") || [];
    }

    isCartEmpty() {
        return ShoppingCart.getCartItems().length === 0;
    }

    static getTotalPrice() {
        return ShoppingCart.getCartItems().reduce((total, item) => {
            return total + item.FinalPrice * item.Quantity;
        }, 0);
    }

    static clearOutCart() {
        setLocalStorage("so-cart", []);
        updateCartDisplayNumber();
    }

    renderCart(cartItems) {
        renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, "afterbegin", true);

        // Check if the shopping cart is empty
        if (!this.isCartEmpty()) {
            const cartFooter = document.querySelector(".cart-footer-hide");
            const cartTotal = document.querySelector(".cart-total");

            // Show the cart footer on the page
            cartFooter.style.display = "block";

            // Show total price of shopping cart
            cartTotal.textContent = `Total: $${ShoppingCart.getTotalPrice().toFixed(2)}`;
            cartTotal.style.fontSize = "1.5rem";
            cartTotal.style.textAlign = "center";
        }
    }

    itemRemovalHandler() {
        this.listElement.addEventListener("click", (e) => {
            const button = e.target.closest(".cart-item-removal");
            if (!button) { return; }

            const idToRemove = button.dataset.id;

            let cart = ShoppingCart.getCartItems();

            cart = cart.filter(item => item.Id !== idToRemove);

            setLocalStorage("so-cart", cart);

            this.init();
        });
    }

    itemQuantityHandler() {
        this.listElement.addEventListener("click", (e) => {
            const button = e.target.closest(".card-qty-change");
            if (!button) { return; }

            const idToModify = button.dataset.id;

            const cartItems = ShoppingCart.getCartItems();
            const product = cartItems.find(item => item.Id === idToModify);
            if (button.classList.contains("card-qty-up")) {
                product.Quantity++;
            } else if (product.Quantity > 1) {
                product.Quantity--;
            }

            setLocalStorage("so-cart", cartItems);

            this.init();
        });
    }
}
