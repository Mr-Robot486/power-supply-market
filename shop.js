//Initials (I will take them to local storage once i see my groups work)
const  goods = JSON.parse(localStorage.getItem('goods-view')) || [];
const  dashboard = document.getElementById('dashboard-view');
const  cart = JSON.parse(localStorage.getItem('cart-view')) || [];
const  orders = document.getElementById('orders-view');
const  completeOrders = document.getElementById('complete-view');
const  electricBill = document.getElementById('elec-view');
const  payment = document.getElementById('payment-modal');
const  sideBar = document.getElementById('sidebar');
 
//the view functionl
function showView(viewId){
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.style.display = 'none');
    const target = document.getElementById(viewId + '-view');
    if (target) target.style.display = 'block';
}

//RENDERING PRODUCTS FROM ADMIN PANNEL
function renderUserProducts(){
    const container = document.getElementById('appear');
    if (!container)
        return;

    if (goods.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding: 20px;">No products available yet. Check back soon!</p>`;
        return;
    }

    container.innerHTML = `
        <div class="product-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; padding: 20px;">
            ${goods.map(item => `
                <div class="product-card" style="background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                    <img src="${item.img}" alt="${item.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                    <h3 style="margin: 10px 0; color: #333;">${item.name}</h3>
                    <p style="color: #2ecc71; font-weight: bold; font-size: 1.1rem;">Ksh ${item.price}</p>
                    <button onclick="addToCart(${item.id})" style="width: 100%; margin-top: 10px; background: #1E90FF;">Add to Cart</button>
                    <button onclick="openPaymentModal('${item.name}', ${item.price})" style="width: 100%; margin-top: 5px; background: #2ecc71;">Buy Now</button>
                </div>
            `).join('')}
        </div>
    `;
}

//toggle the side bar
document.addEventListener("DOMContentLoaded", () => {
    //goods stays by default
    showView('goods');

    renderUserProducts();

    renderCart();

    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.querySelector('.sidebar');

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
});

//adding to cart function
function addToCart(productId){
    const  goods = JSON.parse(localStorage.getItem('goods-view')) || [];
    const product = goods.find(item => item.id === productId);
    let cart = JSON.parse(localStorage.getItem('cart-view')) || [];

    if (product){
        cart.push(product);
        localStorage.setItem('cart-view', JSON.stringify(cart));
        alert(`${product.name} is added to cart successfully!`)
    }
}

//rendering to cart
function renderCart(){
    const listContainer = document.getElementById('user-cart');
    const totalDisplay = document.getElementById('cart-tatal')
    let cart = JSON.parse(localStorage.getItem('cart-view')) || [];

    if (cart.length === 0){
        listContainer.innerHTML = `<p>Your cart is empty!</p>`;
        totalDisplay.textContent = "0";
        return;
    }
    listContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" style="display:flex; align-items:center; gap:15px; margin-bottom:10px; border-bottom:1px solid #ddd; padding:10px;">
                <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                <div>
                    <strong>${item.name}</strong>
                    <p>Ksh ${item.price}</p>
              </div>
            <button onclick="removeFromCart(${index})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
                Remove
            </button>
        </div>
        `).join('');
 
        const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
        totalDisplay.textContent = total.toLocaleString();
}

///removing from cart function
function removeFromCart(index){
    const  cart = JSON.parse(localStorage.getItem('cart-view')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart-view', JSON.stringify(cart));
    renderCart();
}

//cart logic
function completeCart(){
    const  cart = JSON.parse(localStorage.getItem('cart-view')) || [];
    if(cart.length === 0){
        alert("your cart is empty!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const itemNames = cart.map(item => item.name).join(", ");

    openPaymentModal(itemNames, total, true);
}

//payment part
let activeOrder = null;
//I will put my arguments for products here according to my group preference
function openPaymentModal(productName, price, isFromCart = false){
    activeOrder = {
        orderId: Date.now(),
        productName,
        price,
        status: "pending",
        isCartPurchase: isFromCart,
        orderAt: new Date().toLocaleString()
    };

    const modal = document.getElementById('payment-modal');
    if(modal) modal.style.display = "block";
}

//MPESA
function payWithMpesa(){
    const phone = prompt("Enter your M-pesa phone number (+2547xxxxxxxxx):");
    if(!phone) return;

    activeOrder.paymentMethod = "M-Pesa";
    activeOrder.paymentRef = "MPESA" + Math.floor(Math.random() * 1000000);
    activeOrder.status = "paid";
    alert("M-Pesa payment successful!");
}

//PAYPAL
function payWithPaypal(){
    activeOrder.paymentMethod = "Paypal";
    activeOrder.paymentRef = "PAYPAL" + Date.now();
    activeOrder.status = "paid";

    alert("Redirecting payment to your paypal account....");
}

//BANK TRANSFER
function payWithBank(){
    const ref = prompt("Enter your reference number:");
    if(!ref) return;
    activeOrder.paymentMethod = "Bank transfer";
    activeOrder.paymentRef = ref;
    activeOrder.status = "paid";
    alert("Bank transfer complete.Awaiting confirmation!");
}

function closePayment(){
    document.getElementById('payment-modal').style.display = "none";
    activeOrder = null;
}