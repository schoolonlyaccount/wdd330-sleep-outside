import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const order = new CheckoutProcess(".checkout-summary");
order.init();

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.forms[0];
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) {
    order.checkout();
  }
});
