import { loadHeaderFooter, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

loadHeaderFooter();

const services = new ExternalServices();

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("login-error");
  errorEl.style.display = "none";

  try {
    const response = await services.login(email, password);
    if (response.token) {
      setLocalStorage("so-token", response.token);
      window.location.href = "/index.html";
    } else {
      errorEl.textContent = "Login failed. Please check your credentials.";
      errorEl.style.display = "block";
    }
  } catch (err) {
    errorEl.textContent = "Invalid email or password. Please try again.";
    errorEl.style.display = "block";
  }
});
