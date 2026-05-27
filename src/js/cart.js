import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";
import { updateCartDisplayNumber } from "./ShoppingCart.mjs";

await loadHeaderFooter();

const cartElement = document.querySelector(".product-list");
const cart = new ShoppingCart(cartElement);
cart.init();
cart.itemRemovalHandler();