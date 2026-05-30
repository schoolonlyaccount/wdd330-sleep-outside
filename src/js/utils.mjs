import { updateCartDisplayNumber } from "./ShoppingCart.mjs";

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// W02
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// W03
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}
export async function loadHeaderFooter() {
  renderWithTemplate(await loadTemplate("../partials/header.html"), document.getElementById("main-header"));
  renderWithTemplate(await loadTemplate("../partials/footer.html"), document.getElementById("main-footer"));

  if (window.location.pathname === "/checkout/index.html" || window.location.pathname === "/cart/index.html" || window.location.pathname === "/checkout/success.html") {
    document.querySelector(".search-form").remove();
  }

  updateCartDisplayNumber();
}

// W04
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");

  alert.classList.add("alert");

  alert.innerHTML = `<p>${message}<span class="close">X</span></p>`;

  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("close")) {
      main.removeChild(this);
    }
  });

  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }

  setTimeout(function () {
    main.removeChild(alert);
  }, 1000 * 5);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((element) => document.querySelector("main").removeChild(element));
}