import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartDisplayNumber } from "./ShoppingCart.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

await loadHeaderFooter();
updateCartDisplayNumber();

const category = getParam("category");

const dataSource = new ProductData();

const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);

productList.init();
