import ShoppingCart from "./ShoppingCart.mjs";

export default class CheckoutProcess {
    init() {
        this.calculateAndDisplaySubTotal();
        this.calculateAndDisplaySalesTax();
        this.calculateAndDisplayShipping();
        this.calculateAndDisplayOrderTotal();
    }

    calculateAndDisplaySubTotal() {
        const subTotalPrice = ShoppingCart.getTotalPrice();
        document.querySelector(".order-summary .subtotal").textContent += subTotalPrice;
    }

    calculateAndDisplaySalesTax() {
        const salesTax = ShoppingCart.getTotalPrice() * 0.06;
        document.querySelector(".order-summary .tax").textContent += (salesTax).toFixed(2);
    }

    calculateAndDisplayShipping() {
        const cartLength = ShoppingCart.getCartItems().length;
        const shippingCost = 10 + (cartLength > 1 ? 2 * (cartLength - 1) : 0);
        document.querySelector(".order-summary .shipping-estimate").textContent += shippingCost;
    }

    calculateAndDisplayOrderTotal() {
        const subTotalPrice = ShoppingCart.getTotalPrice();
        const salesTax = ShoppingCart.getTotalPrice() * 0.06;
        const cartLength = ShoppingCart.getCartItems().length;
        const shippingCost = 10 + (cartLength > 1 ? 2 * (cartLength - 1) : 0);
        document.querySelector(".order-summary .total").textContent += (subTotalPrice + salesTax + shippingCost).toFixed(2);
    }
}