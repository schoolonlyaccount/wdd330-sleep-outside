import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartDisplayNumber } from "./ShoppingCart.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();
updateCartDisplayNumber();

const category = getParam("category");

const dataSource = new ExternalServices();

const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);

productList.init();
