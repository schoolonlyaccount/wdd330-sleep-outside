import ShoppingCart from "./ShoppingCart.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
    const formData = new FormData(formElement), convertedJSON = {};

    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON;
}

function packageItems(items) {
    return items.map((item) => {
        return {
            id: item.Id,
            name: item.Name,
            price: item.FinalPrice,
            quantity: item.Quantity
        };
    });
}

export default class CheckoutProcess {
    constructor(outputSelector) {
        this.outputSelector = outputSelector;
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.calculateItemSummary();
        this.calculateOrderTotal();
    }

    calculateItemSummary() {
        document.querySelector(`${this.outputSelector} #num-items`).textContent = ShoppingCart.getCartItems().length;

        this.itemTotal = ShoppingCart.getTotalPrice();
        document.querySelector(`${this.outputSelector} #cartTotal`).textContent = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;
        const totalItems = ShoppingCart.getCartItems().reduce((sum, item) => sum + item.Quantity, 0);
        this.shipping = totalItems ? 10 + (totalItems - 1) * 2 : 0;
        this.orderTotal = parseFloat(this.itemTotal) + parseFloat(this.tax) + parseFloat(this.shipping);

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        document.querySelector(`${this.outputSelector} #tax`).textContent = `$${this.tax.toFixed(2)}`;
        document.querySelector(`${this.outputSelector} #shipping`).textContent = `$${this.shipping.toFixed(2)}`;
        document.querySelector(`${this.outputSelector} #orderTotal`).textContent = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout() {
        const formElement = document.forms["checkout"];
        const order = formDataToJSON(formElement);

        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        order.items = packageItems(ShoppingCart.getCartItems());

        try {
            const response = await services.checkout(order);
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }
}