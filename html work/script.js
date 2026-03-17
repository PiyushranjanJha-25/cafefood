// Firebase config (replace with your own)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Add shop items (first time)
async function seedData() {
  await db.collection("shops").add({
    name: "Shop A",
    items: [
      { name: "Burger", price: 50, rating: 4.5 },
      { name: "Maggi", price: 40, rating: 4.6 }
    ]
  });
}

// Fetch & display shops
async function loadShops() {
  const snapshot = await db.collection("shops").get();
  const container = document.getElementById("shops");
  container.innerHTML = "";

  snapshot.forEach(doc => {
    const shop = doc.data();

    let html = `<div class="card"><h3>${shop.name}</h3>`;

    shop.items.forEach(item => {
      html += `
        <p>${item.name} - ₹${item.price} ⭐${item.rating}
        <button onclick="order('${item.name}', '${shop.name}')">Order</button>
        </p>
      `;
    });

    html += `</div>`;
    container.innerHTML += html;
  });
}

// Order function
async function order(itemName, shopName) {
  await db.collection("orders").add({
    item: itemName,
    shop: shopName,
    time: new Date()
  });

  alert("Order placed!");
  loadOrders();
}

// Load orders
async function loadOrders() {
  const snapshot = await db.collection("orders").get();
  const container = document.getElementById("orders");

  container.innerHTML = "";

  snapshot.forEach(doc => {
    const order = doc.data();
    container.innerHTML += `
      <div class="card">
        ${order.item} from ${order.shop}
      </div>
    `;
  });
}

// Smart Recommendation
async function recommend() {
  let input = document.getElementById("userInput").value.toLowerCase();
  const snapshot = await db.collection("shops").get();

  let allItems = [];

  snapshot.forEach(doc => {
    doc.data().items.forEach(item => {
      allItems.push(item);
    });
  });

  let filtered = allItems.filter(item => {
    if (input.includes("50")) return item.price <= 50;
    return true;
  });

  filtered.sort((a, b) => b.rating - a.rating);

  alert(
    "Best choices:\n" +
    filtered.slice(0, 3).map(i =>
      `${i.name} ₹${i.price} ⭐${i.rating}`
    ).join("\n")
  );
}

// Init
loadShops();
loadOrders();