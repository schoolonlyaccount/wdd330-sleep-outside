import { updateCartDisplayNumber } from "./ShoppingCart.mjs";

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

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

  const path = window.location.pathname;
  if (path.includes("/checkout/") || path.includes("/cart/") || path.includes("/login/") || path.includes("/register/")) {
    const sf = document.querySelector(".search-form");
    if (sf) sf.remove();
  }

  updateCartDisplayNumber();
  showRegistrationBanner();
}

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
  if (scroll) window.scrollTo(0, 0);
  setTimeout(function () {
    if (main.contains(alert)) main.removeChild(alert);
  }, 1000 * 5);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((element) => document.querySelector("main").removeChild(element));
}

export function showRegistrationBanner() {
  const dismissed = getLocalStorage("so-reg-banner-dismissed");
  if (dismissed) return;

  const banner = document.createElement("div");
  banner.id = "reg-banner";
  banner.innerHTML = `
    <div class="reg-banner-content">
      <div class="reg-banner-text">
        <strong>🎁 Win Free Gear!</strong>
        Register with SleepOutside for a chance to win $500 in outdoor gear. 
        New members entered in our monthly giveaway!
      </div>
      <div class="reg-banner-actions">
        <a href="/register/index.html" class="reg-banner-btn">Register Now</a>
        <button class="reg-banner-close" id="reg-banner-close">&times;</button>
      </div>
    </div>`;

  document.body.prepend(banner);

  document.getElementById("reg-banner-close").addEventListener("click", () => {
    setLocalStorage("so-reg-banner-dismissed", true);
    banner.remove();
  });
}
