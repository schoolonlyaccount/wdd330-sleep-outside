import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
} from "./utils.mjs";

loadHeaderFooter();

// Newsletter signup handler
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value.trim();
    if (!email) return;
    const subs = getLocalStorage("so-newsletter") || [];
    if (subs.includes(email)) {
      document.getElementById("newsletter-msg").textContent =
        "You are already subscribed!";
    } else {
      subs.push(email);
      setLocalStorage("so-newsletter", subs);
      document.getElementById("newsletter-msg").textContent =
        "✅ Thank you for subscribing!";
      newsletterForm.reset();
    }
  });
}
