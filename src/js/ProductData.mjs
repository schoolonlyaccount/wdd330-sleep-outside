const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
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

  async searchProducts(query) {
    // Search across all categories and filter by query
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    const results = await Promise.all(
      categories.map((cat) => this.getData(cat))
    );
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
