import { getLocalStorage, setLocalStorage, renderListWithTemplate, alertMessage } from "./utils.mjs";

function productCardTemplate(product) {
    return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.Name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
    <button class="quick-view-btn" data-id="${product.Id}">Quick View</button>
  </li>`;
}

function buildQuickViewModal(product) {
    return `
    <div class="modal-overlay" id="quick-view-modal">
      <div class="modal-box">
        <button class="modal-close" id="modal-close-btn">&times;</button>
        <div class="modal-content">
          <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
          <div class="modal-info">
            <h3>${product.Brand.Name}</h3>
            <h2>${product.Name}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
            <p>${product.Colors[0].ColorName}</p>
            <button class="modal-add-cart" data-id="${product.Id}">Add to Cart</button>
            <a href="../product_pages/index.html?product=${product.Id}" class="modal-view-full">View Full Details</a>
          </div>
        </div>
      </div>
    </div>`;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.products = [];
    }

    async init() {
        const list = await this.dataSource.getData(this.category);
        this.products = list;
        this.renderList(list);

        let titleCategory;
        switch (this.category) {
            case "tents": titleCategory = "Tents"; break;
            case "backpacks": titleCategory = "Backpacks"; break;
            case "sleeping-bags": titleCategory = "Sleeping Bags"; break;
            case "hammocks": titleCategory = "Hammocks"; break;
            default: titleCategory = this.category || "Products";
        }
        const titleEl = document.querySelector(".title");
        if (titleEl) titleEl.textContent = titleCategory;

        this.addQuickViewListeners();
    }

    renderList(list) {
        this.products = list;
        renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
        this.addQuickViewListeners();
    }

    addQuickViewListeners() {
        this.listElement.querySelectorAll(".quick-view-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                const product = this.products.find(p => p.Id === id);
                if (product) this.openQuickView(product);
            });
        });
    }

    openQuickView(product) {
        // Remove existing modal if any
        const existing = document.getElementById("quick-view-modal");
        if (existing) existing.remove();

        document.body.insertAdjacentHTML("beforeend", buildQuickViewModal(product));

        const modal = document.getElementById("quick-view-modal");

        // Close on overlay click or X button
        document.getElementById("modal-close-btn").addEventListener("click", () => modal.remove());
        modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });

        // Add to cart from modal
        modal.querySelector(".modal-add-cart").addEventListener("click", () => {
            const cartItems = getLocalStorage("so-cart") || [];
            const existing = cartItems.find(item => item.Id === product.Id);
            if (existing) {
                existing.Quantity += 1;
            } else {
                product.Quantity = 1;
                cartItems.push(product);
            }
            setLocalStorage("so-cart", cartItems);
            alertMessage(`${product.Name} added to cart!`);

            // Animate cart icon
            const cartIcon = document.querySelector(".cart svg");
            if (cartIcon) {
                cartIcon.classList.add("cart-animate");
                setTimeout(() => cartIcon.classList.remove("cart-animate"), 600);
            }

            modal.remove();
        });
    }
}
