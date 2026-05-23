// W02
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails(this.product);
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
        document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails(product) {
        document.querySelector("h2").textContent = product.BrandWithoutBrand;
        document.querySelector("h3").textContent = product.Brand.Name;

        const productImage = document.querySelector(".product__image");
        productImage.src = product.Images.PrimaryLarge;
        productImage.alt = product.NameWithoutBrand;

        document.querySelector(".product-card__price").textContent = product.FinalPrice;
        document.querySelector(".product__color").textContent = product.Colors[0].ColorName;
        document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple;

        document.getElementById("addToCart").dataset.id = product.Id;
    }
}