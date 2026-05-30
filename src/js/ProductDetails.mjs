import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import { updateCartDisplayNumber } from "./ShoppingCart.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails(this.product);
        document.getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
        document.getElementById("addToWishlist")
            .addEventListener("click", this.addToWishlist.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        const existing = cartItems.find(item => item.Id === this.product.Id);
        if (existing) {
            existing.Quantity += 1;
        } else {
            this.product.Quantity = 1;
            cartItems.push(this.product);
        }
        setLocalStorage("so-cart", cartItems);
        updateCartDisplayNumber();

        // Animate cart icon
        const cartIcon = document.querySelector(".cart svg");
        if (cartIcon) {
            cartIcon.classList.add("cart-animate");
            setTimeout(() => cartIcon.classList.remove("cart-animate"), 600);
        }

        alertMessage(`${this.product.Name} has been added to the cart!`);
    }

    addToWishlist() {
        const wishlist = getLocalStorage("so-wishlist") || [];
        const exists = wishlist.find(item => item.Id === this.product.Id);
        if (exists) {
            alertMessage(`${this.product.Name} is already in your wishlist!`);
            return;
        }
        wishlist.push(this.product);
        setLocalStorage("so-wishlist", wishlist);
        alertMessage(`${this.product.Name} added to your wishlist! ❤️`);
        document.getElementById("addToWishlist").textContent = "❤️ In Wishlist";
    }

    renderProductDetails(product) {
        document.querySelector("h2").textContent = product.Name;
        document.querySelector("h3").textContent = product.Brand.Name;

        // Image carousel
        const allImages = [product.Images.PrimaryLarge];
        if (product.Images.ExtraImages) {
            product.Images.ExtraImages.forEach(img => allImages.push(img.Src));
        }
        this.buildImageCarousel(allImages, product.Name);

        document.querySelector(".product-card__price").textContent = `$${product.FinalPrice}`;
        document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple;
        document.getElementById("addToCart").dataset.id = product.Id;

        // Color swatches
        this.buildColorSwatches(product.Colors);

        // Check wishlist
        const wishlist = getLocalStorage("so-wishlist") || [];
        if (wishlist.find(item => item.Id === product.Id)) {
            document.getElementById("addToWishlist").textContent = "❤️ In Wishlist";
        }

        // Comments
        this.renderComments(product.Id);
    }

    buildImageCarousel(images, name) {
        const container = document.querySelector(".product__image-container");
        if (images.length <= 1) {
            container.innerHTML = `<img class="product__image" src="${images[0]}" alt="${name}" />`;
            return;
        }

        const thumbs = images.map((src, i) =>
            `<img class="carousel-thumb${i === 0 ? " active" : ""}" src="${src}" alt="${name} view ${i + 1}" data-index="${i}" />`
        ).join("");

        container.innerHTML = `
      <div class="carousel-main">
        <button class="carousel-btn carousel-prev">&#8249;</button>
        <img class="product__image carousel-img" src="${images[0]}" alt="${name}" />
        <button class="carousel-btn carousel-next">&#8250;</button>
      </div>
      <div class="carousel-thumbs">${thumbs}</div>`;

        let current = 0;
        const mainImg = container.querySelector(".carousel-img");
        const thumbEls = container.querySelectorAll(".carousel-thumb");

        const goTo = (i) => {
            current = (i + images.length) % images.length;
            mainImg.src = images[current];
            thumbEls.forEach((t, idx) => t.classList.toggle("active", idx === current));
        };

        container.querySelector(".carousel-prev").addEventListener("click", () => goTo(current - 1));
        container.querySelector(".carousel-next").addEventListener("click", () => goTo(current + 1));
        thumbEls.forEach((t, i) => t.addEventListener("click", () => goTo(i)));
    }

    buildColorSwatches(colors) {
        const container = document.querySelector(".product__colors");
        if (!colors || colors.length === 0) return;

        container.innerHTML = `<p class="colors-label">Select Color:</p>` +
            colors.map((c, i) => `
        <label class="color-swatch${i === 0 ? " selected" : ""}" title="${c.ColorName}">
          <input type="radio" name="color" value="${c.ColorName}" ${i === 0 ? "checked" : ""}/>
          <img src="${c.ColorChipImageSrc || c.ColorPreviewImageSrc || ""}" alt="${c.ColorName}" />
          <span>${c.ColorName}</span>
        </label>`
            ).join("");

        container.querySelectorAll(".color-swatch").forEach(label => {
            label.addEventListener("click", () => {
                container.querySelectorAll(".color-swatch").forEach(l => l.classList.remove("selected"));
                label.classList.add("selected");
            });
        });
    }

    renderComments(productId) {
        const key = `so-comments-${productId}`;
        const comments = getLocalStorage(key) || [];
        const section = document.querySelector(".product__comments");

        const list = comments.length > 0
            ? comments.map(c => `<li class="comment-item"><strong>${c.name}</strong><span>${c.date}</span><p>${c.text}</p></li>`).join("")
            : `<li class="no-comments">No comments yet. Be the first!</li>`;

        section.innerHTML = `
      <h3>Customer Comments</h3>
      <ul class="comment-list">${list}</ul>
      <form class="comment-form" id="comment-form">
        <input type="text" id="comment-name" placeholder="Your name" required />
        <textarea id="comment-text" placeholder="Write your comment..." required></textarea>
        <button type="submit">Post Comment</button>
      </form>`;

        document.getElementById("comment-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("comment-name").value.trim();
            const text = document.getElementById("comment-text").value.trim();
            if (!name || !text) return;

            const updated = getLocalStorage(key) || [];
            updated.push({ name, text, date: new Date().toLocaleDateString() });
            setLocalStorage(key, updated);
            this.renderComments(productId);
            alertMessage("Comment posted!");
        });
    }
}
