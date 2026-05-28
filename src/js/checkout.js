import CheckoutProcess from "./CheckOutProcess.mjs";
import ShoppingCart, { updateCartDisplayNumber } from "./ShoppingCart.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();
updateCartDisplayNumber();

const checkout = new CheckoutProcess;
checkout.init();