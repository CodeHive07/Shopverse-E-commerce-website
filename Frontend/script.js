// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to Cart
function addToCart(productName, price, image) {

    const existingProduct = cart.find(item => item.name === productName);

    if(existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const product = {
            name: productName,
            price: price,
            image: image,
            quantity: 1
        };

        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("Product added to cart!");
}

// Load Cart Items
function loadCart() {

    const cartItemsContainer = document.querySelector(".cart-items");
    const totalElement = document.querySelector(".cart-summary p");

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    if(cart.length === 0){
    cartItemsContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
    totalElement.innerText = "Total: $0";
    return;
}

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}">
            <div>
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
            </div>

            <input type="number" value="${item.quantity}" min="1" class="qty-input">

            <button class="remove-btn">Remove</button>
        `;

        // Remove item
        cartItem.querySelector(".remove-btn").addEventListener("click", () => {
            removeItem(index);
        });

        // Update quantity
        const qtyInput = cartItem.querySelector(".qty-input");

        qtyInput.addEventListener("change", (e) => {

            cart[index].quantity = parseInt(e.target.value);

            localStorage.setItem("cart", JSON.stringify(cart));

            loadCart();
        });

        cartItemsContainer.appendChild(cartItem);

    });

    totalElement.innerText = "Total: $" + total;
}

// Remove Item
function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    loadCart();
}

// Product Search
function searchProducts() {

    let input = document.getElementById("searchInput").value.toLowerCase();

    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        let title = card.querySelector("h3").innerText.toLowerCase();

        if(title.includes(input)) {
            card.style.display = "block";
        }
        else {
            card.style.display = "none";
        }

    });

}

// Update Cart Counter
function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    if(!cartCount) return;

    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
    });

    cartCount.innerText = totalItems;
}

// Run on page load
updateCartCount();
loadCart();
function placeOrder(event){

event.preventDefault();

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

let orderId = Math.floor(Math.random() * 100000);

let order = {
id: orderId,
date: new Date().toLocaleString(),
items: cartItems
};

orders.push(order);

localStorage.setItem("orders", JSON.stringify(orders));

localStorage.removeItem("cart");

updateCartCount();

window.location.href = "success.html";

}
function filterProducts(category){

let products = document.querySelectorAll(".card");

products.forEach(product => {

if(category === "all"){
product.style.display = "block";
}
else if(product.dataset.category === category){
product.style.display = "block";
}
else{
product.style.display = "none";
}

});

}
function loginUser(event){

event.preventDefault();

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

if(email === "user@example.com" && password === "1234"){

alert("Login Successful!");

window.location.href = "index.html";

}else{

alert("Invalid email or password");

}

}
// Register User
function registerUser(event){

event.preventDefault();

let name = document.getElementById("reg-name").value;
let email = document.getElementById("reg-email").value;
let password = document.getElementById("reg-password").value;
let role = document.getElementById("reg-role").value;

let user = {
name:name,
email:email,
password:password,
role:role
};

localStorage.setItem("user", JSON.stringify(user));

alert("Registration successful!");

window.location.href="login.html";

}

// Login User
function loginUser(event){

event.preventDefault();

let email=document.getElementById("login-email").value;
let password=document.getElementById("login-password").value;

let savedUser=JSON.parse(localStorage.getItem("user"));

if(savedUser && email===savedUser.email && password===savedUser.password){

localStorage.setItem("loggedIn","true");

if(savedUser.role==="admin"){
window.location.href="admin.html";
}
else{
window.location.href="index.html";
}

}else{

alert("Invalid email or password");

}

}

// Logout
function logoutUser(){

localStorage.removeItem("loggedIn");

window.location.href = "index.html";

}
function updateAuthNavbar(){

const authLink = document.getElementById("auth-link");

if(!authLink) return;

let savedUser = JSON.parse(localStorage.getItem("user"));

if(localStorage.getItem("loggedIn") === "true" && savedUser){

authLink.innerHTML = `
<span>Hello, ${savedUser.name}</span> 
<a href="#" onclick="logoutUser()">Logout</a>
`;

}else{

authLink.innerHTML = `<a href="login.html">Login</a>`;

}

}
function updateAdminNavbar(){

let adminLink = document.getElementById("admin-link");

if(!adminLink) return;

let user = JSON.parse(localStorage.getItem("user"));

if(localStorage.getItem("loggedIn") === "true" && user && user.role === "admin"){

adminLink.innerHTML = `<a href="admin.html">Admin</a>`;

}else{

adminLink.innerHTML = "";

}

}

function addProduct(event){

event.preventDefault();

let name = document.getElementById("product-name").value;
let price = document.getElementById("product-price").value;

let imageInput = document.getElementById("product-image");

let file = imageInput.files[0];

let reader = new FileReader();

reader.onload = function(){

let imageData = reader.result;

let products = JSON.parse(localStorage.getItem("products")) || [];

products.push({
name:name,
price:price,
image:imageData
});

localStorage.setItem("products",JSON.stringify(products));

alert("Product added!");

event.target.reset();

loadAdminProducts();
loadProducts();
loadAdminStats();
loadProductChart();

}

reader.readAsDataURL(file);

}
function loadProducts(){

let productContainer=document.getElementById("product-list");

if(!productContainer) return;

let products=JSON.parse(localStorage.getItem("products"))||[];

productContainer.innerHTML="";

products.forEach((product,index)=>{

productContainer.innerHTML+=`

<div class="card">

<img src="${product.image}">

<h3>${product.name}</h3>

<p>$${product.price}</p>

<button onclick="addToCart('${product.name}',${product.price},'${product.image}')">
Add to Cart
</button>

<button class="edit-btn" onclick="editProduct(${index})">
Edit
</button>

<button class="delete-btn" onclick="deleteProduct(${index})">
Delete
</button>

</div>

`;

});

}
function deleteProduct(index){

let products = JSON.parse(localStorage.getItem("products")) || [];

products.splice(index,1);

localStorage.setItem("products",JSON.stringify(products));

loadAdminProducts();
loadProducts();
loadAdminStats();
loadProductChart();

}
function editProduct(index){

let products = JSON.parse(localStorage.getItem("products")) || [];

let product = products[index];

let newName = prompt("Edit product name", product.name);

let newPrice = prompt("Edit price", product.price);

if(newName && newPrice){

products[index].name = newName;
products[index].price = newPrice;

localStorage.setItem("products", JSON.stringify(products));

loadAdminProducts();
loadProducts();
loadAdminStats();
loadProductChart();

}

}
function loadAdminStats(){

let products = JSON.parse(localStorage.getItem("products")) || [];

let users = JSON.parse(localStorage.getItem("user")) || [];

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let productCount = products.length;

let userCount = users ? 1 : 0;

let orderCount = orders.length;

let productElement = document.getElementById("total-products");
let userElement = document.getElementById("total-users");
let orderElement = document.getElementById("total-orders");

if(productElement) productElement.innerText = productCount;
if(userElement) userElement.innerText = userCount;
if(orderElement) orderElement.innerText = orderCount;

}
function loadOrders(){

let orderContainer = document.getElementById("order-list");

if(!orderContainer) return;

let orders = JSON.parse(localStorage.getItem("orders")) || [];

orderContainer.innerHTML = "";

orders.forEach(order => {

let productList = "";

order.items.forEach(item => {

productList += `<li>${item.name} - $${item.price}</li>`;

});

orderContainer.innerHTML += `

<div class="order-card">

<h3>Order #${order.id}</h3>
<p>Order Date: ${order.date}</p>

<ul>
${productList}
</ul>

</div>

`;

});
}
function loadAdminProducts(){

let productTable = document.getElementById("admin-product-list");

if(!productTable) return;

let products = JSON.parse(localStorage.getItem("products")) || [];

productTable.innerHTML = "";

products.forEach((product,index)=>{

productTable.innerHTML += `

<tr>

<td>
<img src="${product.image}" class="admin-product-img">
</td>

<td>${product.name}</td>

<td>$${product.price}</td>

<td>
<button class="edit-btn" onclick="editProduct(${index})">
Edit
</button>
</td>

<td>
<button class="delete-btn" onclick="deleteProduct(${index})">
Delete
</button>
</td>

</tr>

`;

});

}
function loadAdminName(){

let user = JSON.parse(localStorage.getItem("user"));

let nameElement = document.getElementById("admin-name");

if(user && nameElement){

nameElement.innerText = user.name;

}

}
function loadProductChart(){

let products = JSON.parse(localStorage.getItem("products")) || [];

let productCount = products.length;

let ctx = document.getElementById("productChart");

if(!ctx) return;

new Chart(ctx, {

type: "doughnut",

data: {

labels: ["Products"],

datasets: [{

data: [productCount],

backgroundColor: ["#4CAF50"]

}]

},

options: {

responsive: true

}

});

}
updateAuthNavbar();
updateAdminNavbar();
updateCartCount();
loadCart();
loadProducts();
loadAdminStats();
loadOrders();
loadAdminProducts();
loadAdminName();
loadProductChart();

function toggleSidebar(){

let sidebar = document.getElementById("adminSidebar");

sidebar.classList.toggle("collapsed");

}