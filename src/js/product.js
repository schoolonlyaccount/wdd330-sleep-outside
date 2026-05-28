// W02
import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { updateCartDisplayNumber } from "./ShoppingCart.mjs";
import ExternalServices from "./ExternalServices.mjs";

loadHeaderFooter();
updateCartDisplayNumber();

const dataSource = new ExternalServices();
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);
product.init();
