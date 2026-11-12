// =====================================
// SWEET DREAMS - BAKERY WEBSITE
// =====================================

// PRODUCT DATABASE

const products = [
    {
        id: 1,
        name: "Chocolate Dream",
        category: "Birthday",
        price: 699,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
        description: "Rich chocolate cream cake."
    },
    {
        id: 2,
        name: "Pink Celebration",
        category: "Birthday",
        price: 899,
        image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600",
        description: "Elegant pink birthday cake."
    },
    {
        id: 3,
        name: "Wedding Elegance",
        category: "Wedding",
        price: 2499,
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
        description: "Beautiful wedding celebration cake."
    },
    {
        id: 4,
        name: "Love Forever",
        category: "Anniversary",
        price: 1299,
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600",
        description: "Special anniversary cake."
    },
    {
        id: 5,
        name: "Royal Designer",
        category: "Designer",
        price: 1799,
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600",
        description: "Premium designer cake."
    },
    {
        id: 6,
        name: "Strawberry Delight",
        category: "Birthday",
        price: 799,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600",
        description: "Fresh strawberry flavour."
    }
];

// =====================================
// LOCAL STORAGE
// =====================================

let cart = JSON.parse(localStorage.getItem("bakeryCart")) || [];

let wishlist = JSON.parse(localStorage.getItem("bakeryWishlist")) || [];

let orders = JSON.parse(localStorage.getItem("bakeryOrders")) || [];

let discountApplied = false;

function saveData() {
    localStorage.setItem("bakeryCart", JSON.stringify(cart));
    localStorage.setItem("bakeryWishlist", JSON.stringify(wishlist));
    localStorage.setItem("bakeryOrders", JSON.stringify(orders));
}

// =====================================
// DISPLAY PRODUCTS
// =====================================

const productGrid = document.getElementById("productGrid");

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function displayProducts(items) {

    productGrid.innerHTML = "";

    if (items.length === 0) {
        productGrid.innerHTML = "<p>No cakes found.</p>";
        return;
    }

    items.forEach(product => {

        const liked = wishlist.includes(product.id);

        productGrid.innerHTML += `
            <div class="product-card">

                <div class="product-image">
                    <img src="${product.image}"
                         alt="${escapeHTML(product.name)}"
                         loading="lazy">
                </div>

                <div class="product-info">

                    <h3>${escapeHTML(product.name)}</h3>

                    <p>${escapeHTML(product.description)}</p>

                    <div class="product-price">
                        ₹${product.price}
                    </div>

                    <div class="product-actions">

                        <button class="add-btn"
                            onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>

                        <button class="wish-btn"
                            onclick="toggleWishlist(${product.id})">
                            ${liked ? "♥" : "♡"}
                        </button>

                    </div>
                </div>
            </div>
        `;
    });
}

displayProducts(products);

// =====================================
// SEARCH
// =====================================

document.getElementById("searchInput").addEventListener(
    "input", function() {

        const search = this.value.toLowerCase();

        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        );

        displayProducts(filtered);
    }
);

// =====================================
// SORT PRODUCTS
// =====================================

document.getElementById("sortSelect").addEventListener(
    "change", function() {

        let sorted = [...products];

        if (this.value === "low") {
            sorted.sort((a, b) => a.price - b.price);
        }

        if (this.value === "high") {
            sorted.sort((a, b) => b.price - a.price);
        }

        if (this.value === "name") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }

        displayProducts(sorted);
    }
);

// =====================================
// CATEGORY FILTER
// =====================================

document.querySelectorAll(".category-card").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".category-card")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        const category = button.dataset.category;

        const filtered = category === "all"
            ? products
            : products.filter(p => p.category === category);

        displayProducts(filtered);

        document.getElementById("shop")
            .scrollIntoView({ behavior: "smooth" });
    });
});

// =====================================
// WISHLIST
// =====================================

function toggleWishlist(id) {

    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }

    saveData();

    const search = document.getElementById("searchInput").value.toLowerCase();

    displayProducts(products.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    ));
}

// =====================================
// ADD TO CART
// =====================================

function addToCart(id, custom = false) {

    let item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {

        const product = custom ? id : products.find(p => p.id === id);

        cart.push({
            id: custom ? "custom-" + Date.now() : product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveData();
    updateCart();

    alert("Cake successfully added to your cart!");
}

// =====================================
// UPDATE CART
// =====================================

function updateCart() {

    const cartItems = document.getElementById("cartItems");

    let subtotal = 0;
    let count = 0;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty. Add some delicious cakes!</p>";
    }

    cart.forEach((item, index) => {

        subtotal += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <div>
                    <strong>${escapeHTML(item.name)}</strong>
                    <p>₹${item.price} × ${item.quantity}</p>
                    <strong>₹${item.price * item.quantity}</strong>
                </div>

                <div>
                    <button onclick="changeQuantity(${index},-1)">−</button>
                    <button onclick="changeQuantity(${index},1)">+</button>
                    <button onclick="removeItem(${index})">✕</button>
                </div>

            </div>
        `;
    });

    const discount = discountApplied ? subtotal * 0.10 : 0;

    document.getElementById("cartCount").innerText = count;

    document.getElementById("subtotal").innerText =
        "₹" + subtotal.toFixed(2);

    document.getElementById("discount").innerText =
        "₹" + discount.toFixed(2);

    document.getElementById("grandTotal").innerText =
        "₹" + (subtotal - discount).toFixed(2);
}

// =====================================
// CHANGE QUANTITY
// =====================================

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveData();
    updateCart();
}

// =====================================
// REMOVE ITEM
// =====================================

function removeItem(index) {

    cart.splice(index, 1);

    saveData();
    updateCart();
}

// =====================================
// CART OPEN / CLOSE
// =====================================

const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function openCart() {
    drawer.classList.add("open");
    overlay.classList.add("show");
}

function closeCart() {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
}

document.getElementById("openCart").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
overlay.onclick = closeCart;

// =====================================
// COUPON SYSTEM
// =====================================

document.getElementById("applyCoupon").onclick = function() {

    const code = document.getElementById("couponInput")
        .value.trim().toUpperCase();

    if (code === "SWEET10") {

        discountApplied = true;

        document.getElementById("couponMessage").innerText =
            "Congratulations! 10% discount applied.";

    } else {

        document.getElementById("couponMessage").innerText =
            "Invalid coupon code.";
    }

    updateCart();
};

// =====================================
// CUSTOM CAKE DESIGNER
// =====================================

const flavor = document.getElementById("designFlavor");
const size = document.getElementById("designSize");
const color = document.getElementById("designColor");
const message = document.getElementById("designMessage");

function updateDesigner() {

    document.getElementById("previewText").textContent =
        message.value || "Your Celebration!";

    document.getElementById("previewFlavor").textContent =
        flavor.value;

    document.getElementById("cakePreview").style.backgroundColor =
        color.value;

    document.getElementById("designPrice").innerText =
        size.value;
}

[flavor, size, color, message].forEach(input => {
    input.addEventListener("input", updateDesigner);
});

updateDesigner();

// ADD CUSTOM CAKE

document.getElementById("addCustomCake").onclick = function() {

    const customCake = {

        name: document.getElementById("designOccasion").value +
              " " + flavor.value + " Designer Cake",

        price: Number(size.value),

        quantity: 1
    };

    addToCart(customCake, true);

    openCart();
};

// =====================================
// MOBILE MENU
// =====================================

document.getElementById("menuBtn").onclick = function() {

    document.getElementById("navLinks")
        .classList.toggle("active");
};

// =====================================
// DARK / LIGHT THEME
// =====================================

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("bakeryTheme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀";
}

themeBtn.onclick = function() {

    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    themeBtn.textContent = dark ? "☀" : "☾";

    localStorage.setItem("bakeryTheme", dark ? "dark" : "light");
};

// =====================================
// CHECKOUT
// =====================================

const checkoutModal = document.getElementById("checkoutModal");

document.getElementById("checkoutBtn").onclick = function() {

    if (cart.length === 0) {
        alert("Please add a cake to your cart first!");
        return;
    }

    closeCart();
    checkoutModal.classList.add("show");
};

document.getElementById("closeCheckout").onclick = function() {
    checkoutModal.classList.remove("show");
};

// Set minimum delivery date

const dateInput = document.getElementById("buyerDate");

const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.min = localToday;

// Submit order

document.getElementById("checkoutForm").onsubmit = function(event) {

    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const phone = document.getElementById("buyerPhone").value;

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Enter a valid 10-digit mobile number.");
        return;
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const discount = discountApplied ? subtotal * 0.10 : 0;

    const order = {

        id: "SD" + Date.now(),

        customer: document.getElementById("buyerName").value,

        phone: phone,

        address: document.getElementById("buyerAddress").value,

        date: dateInput.value,

        note: document.getElementById("buyerNote").value,

        items: [...cart],

        total: subtotal - discount,

        status: "Order Received",

        createdAt: new Date().toISOString()
    };

    orders.push(order);

    saveData();

    alert(
        "Order prepared successfully!\n\n" +
        "Your Order ID: " + order.id +
        "\nTotal: ₹" + order.total
    );

    cart = [];
    discountApplied = false;

    saveData();
    updateCart();

    this.reset();

    checkoutModal.classList.remove("show");
};

// =====================================
// ORDER TRACKING
// =====================================

document.getElementById("trackBtn").onclick = function() {

    const id = document.getElementById("trackingInput")
        .value.trim();

    const result = document.getElementById("trackingResult");

    const order = orders.find(item => item.id === id);

    if (order) {

        result.innerHTML = `
            <h3>Order Found!</h3>
            <p>Order ID: ${escapeHTML(order.id)}</p>
            <p>Customer: ${escapeHTML(order.customer)}</p>
            <p>Total: ₹${order.total}</p>
            <p>Status: ${escapeHTML(order.status)}</p>
            <p>Delivery Date: ${escapeHTML(order.date)}</p>
        `;

    } else {

        result.innerText = "Order not found. Please check your Order ID.";
    }
};

// =====================================
// INITIALIZE
// =====================================

updateCart();

console.log("Sweet Dreams Bakery Website Loaded!");