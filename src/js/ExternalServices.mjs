const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() { }

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }

  async login(email, password) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };
    return await fetch(`${baseURL}login`, options).then(convertToJson);
  }

  async registerUser(userData) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    };
    return await fetch(`${baseURL}users`, options).then(convertToJson);
  }

  async searchProducts(query) {
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    const results = await Promise.all(categories.map((cat) => this.getData(cat)));
    const allProducts = results.flat();
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.Name.toLowerCase().includes(q) ||
        p.Brand.Name.toLowerCase().includes(q) ||
        (p.DescriptionHtmlSimple && p.DescriptionHtmlSimple.toLowerCase().includes(q))
    );
  }
}
