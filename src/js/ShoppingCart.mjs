import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
    return `<li class="cart-card divider">
    <span class="cart-card__remove" data-id="${item.Id}">❌</span>
  <a href="#" class="cart-card__image">
    <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

export default class ShoppingCart {
    constructor(listElement) {
        this.listElement = listElement;
        this.key = "so-cart";
    }

    init() {
        const cartItems = getLocalStorage(this.key);
        if (cartItems && cartItems.length > 0) {
            this.renderCart(cartItems);
        } else {
            this.listElement.innerHTML = "<li class='cart-card'>Your cart is empty.</li>";
        }
    }

    renderCart(cartItems) {
        // 1. Draw the HTML using your team's awesome utility function
        renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, "afterbegin", true);

        // 2. NOW attach the listeners right after the HTML is drawn!
        const removeButtons = document.querySelectorAll(".cart-card__remove");

        removeButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const itemId = event.target.dataset.id;
                this.removeItem(itemId);
            });
        });
    }

    removeItem(id) {
        let cartItems = getLocalStorage(this.key);

        const itemIndex = cartItems.findIndex((item) => item.Id === id);

        if (itemIndex !== -1) {
            cartItems.splice(itemIndex, 1);
        }

        setLocalStorage(this.key, cartItems);

        this.init();
    }

}
