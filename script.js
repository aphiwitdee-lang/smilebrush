
const API_URL = "https://script.google.com/macros/s/AKfycbyCJGfwPRbclbUZNaTt5qZw7LVZ_7pZSXBbS3mCr5JFMsL5uhxkoJSjlWb-2rKHb_X-Ng/exec";

let products = [];
let cart = [];

async function loadProducts() {
  const productList = document.getElementById("product-list");

  productList.innerHTML = "กำลังโหลดสินค้า...";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("ไม่สามารถโหลดข้อมูลสินค้าได้");
    }

    products = await response.json();

    if (!Array.isArray(products)) {
      throw new Error("รูปแบบข้อมูลสินค้าไม่ถูกต้อง");
    }

    displayProducts();

  } catch (error) {
    productList.innerHTML =
      "<p>โหลดสินค้าไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อ</p>";

    console.error(error);
  }
}

function displayProducts() {
  const productList = document.getElementById("product-list");

  productList.innerHTML = products.map(product => `
    <div class="product-card">
      <img
        src="images/${encodeURIComponent(product.image)}"
        alt="${product.name}"
        onerror="this.style.display='none'"
      >

      <h3>${product.name}</h3>

      <p>รหัสสินค้า: ${product.sku}</p>

      <p class="price">${product.price} บาท</p>

      <p>คงเหลือ ${product.stock} ชิ้น</p>

      <button
        class="buy-btn"
        onclick="addToCart('${product.sku}')"
        ${product.stock <= 0 ? "disabled" : ""}
      >
        เพิ่มลงตะกร้า
      </button>
    </div>
  `).join("");
}

function addToCart(sku) {
  const product = products.find(item => item.sku === sku);

  if (!product || product.stock <= 0) return;

  const existing = cart.find(item => item.sku === sku);

  if (existing) {
    if (existing.quantity >= product.stock) {
      alert("สินค้าในสต็อกไม่เพียงพอ");
      return;
    }
    existing.quantity++;
  } else {
    cart.push({
      sku: sku,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  updateCart();
}

function updateCart() {
  const count = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  document.getElementById("cart-count").textContent = count;

  console.log("ตะกร้าสินค้า:", cart);
}

loadProducts();
