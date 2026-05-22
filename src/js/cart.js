import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

const cartElement = document.querySelector(".product-list");
const cart = new ShoppingCart(cartElement);
cart.init();
