import CheckoutProcess from "./CheckOutProcess.mjs";
import ShoppingCart, { updateCartDisplayNumber } from "./ShoppingCart.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();
updateCartDisplayNumber();

const order = new CheckoutProcess(".checkout-summary");
order.init();

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
    e.preventDefault();

    order.checkout();
});