import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

loadHeaderFooter();

const services = new ExternalServices();

document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("register-error");
    const successEl = document.getElementById("register-success");
    errorEl.style.display = "none";
    successEl.style.display = "none";

    const userData = {
      fname: document.getElementById("fname").value.trim(),
      lname: document.getElementById("lname").value.trim(),
      email: document.getElementById("email").value.trim(),
      street: document.getElementById("street").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value.trim(),
      zip: document.getElementById("zip").value.trim(),
      password: document.getElementById("password").value,
      avatar: document.getElementById("avatar").value.trim(),
    };

    try {
      await services.registerUser(userData);
      successEl.textContent =
        "🎉 Account created! You have been entered in our giveaway. Redirecting to login...";
      successEl.style.display = "block";
      document.getElementById("register-form").reset();
      setTimeout(() => {
        window.location.href = "/login/index.html";
      }, 2500);
    } catch (err) {
      errorEl.textContent = "Registration failed. Please try again.";
      errorEl.style.display = "block";
    }
  });
