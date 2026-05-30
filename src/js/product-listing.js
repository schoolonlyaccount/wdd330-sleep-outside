import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const search = getParam("search");
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");

if (search) {
  // Search mode
  document.querySelector(".title").textContent =
    `Search results for "${search}"`;
  dataSource
    .searchProducts(search)
    .then((results) => {
      if (results.length === 0) {
        element.innerHTML = `<li class="no-results">No products found for "${search}".</li>`;
      } else {
        const productList = new ProductList(null, dataSource, element);
        productList.renderList(results);
      }
    })
    .catch(() => {
      element.innerHTML = `<li class="no-results">Something went wrong. Please try again.</li>`;
    });
} else if (category) {
  // Category mode
  const productList = new ProductList(category, dataSource, element);
  productList.init();
} else {
  document.querySelector(".title").textContent = "All Products";
  element.innerHTML = `<li class="no-results">Please select a category or search for a product.</li>`;
}
