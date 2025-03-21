document.addEventListener("DOMContentLoaded", function () {
    const menu = [
        { name: "Clam Chowder", price: 8.49, image: "images/chowder.webp", category: "soups" },
        { name: "Vegetarian Salad", price: 7.99, image: "images/salad.jpeg", category: "veg-starters" },
        { name: "French Fries", price: 3.99, image: "images/fries.jpg", category: "veg-starters" },
        { name: "Chicken Wings", price: 9.99, image: "images/wings.jpeg", category: "nonveg-starters" },
        { name: "Buffalo Chicken", price: 14.99, image: "images/buffalo.jpg", category: "nonveg-starters" },
        { name: "Creamy Pasta", price: 12.99, image: "images/pasta.webp", category: "veg-meals" },
        { name: "Pancakes", price: 9.99, image: "images/pancakes.jpg", category: "veg-meals" },
        { name: "Pepperoni Pizza", price: 10.99, image: "images/pizza.jpg", category: "nonveg-meals" },
        { name: "Cheese Burger", price: 8.99, image: "images/burger.jpeg", category: "nonveg-meals" },
        { name: "Tandoori", price: 18.99, image: "images/tandoori.jpg", category: "nonveg-meals" },
        { name: "Grilled Steak", price: 20.99, image: "images/steak.jpeg", category: "nonveg-meals" },
        { name: "BBQ Ribs", price: 15.99, image: "images/ribs.jpeg", category: "nonveg-meals" },
        { name: "Tacos", price: 6.99, image: "images/tacos.jpeg", category: "nonveg-meals" },
        { name: "Grilled Salmon", price: 16.99, image: "images/salmon.jpg", category: "nonveg-meals" },
        { name: "Lobster Roll", price: 22.99, image: "images/lobster.jpg", category: "nonveg-meals" },
        { name: "Shrimp Scampi", price: 17.99, image: "images/scampi.jpeg", category: "nonveg-meals" },
        { name: "Hot Dog", price: 5.49, image: "images/hotdog.jpeg", category: "nonveg-meals" },
        { name: "Cheesecake", price: 6.99, image: "images/cheesecake.jpg", category: "desserts" },
        { name: "Chocolate Cake", price: 7.99, image: "images/chocolatecake.jpg", category: "desserts" },
        { name: "Milkshake", price: 4.99, image: "images/milkshake.jpeg", category: "desserts" }
    ];

    const menuContainer = document.getElementById("menu-container");
    const cartItemsList = document.querySelector(".cart-items");
    const cartTotal = document.getElementById("cart-total");

    // Function to display menu items
    function displayMenu(items) {
        menuContainer.innerHTML = ""; // Clear existing menu
        items.forEach(item => {
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">$${item.price.toFixed(2)}</p>
                            <button class="btn btn-primary add-to-cart" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            menuContainer.innerHTML += card;
        });
    }

    // Show all items initially
    displayMenu(menu);

    // Add to cart functionality
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart")) {
            const name = event.target.getAttribute("data-name");
            const price = parseFloat(event.target.getAttribute("data-price"));

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            // Show confirmation popup after adding the item
            showConfirmationPopup(name);
            updateCart();
        }
    });

    // Show a custom popup when an item is added to the cart
    function showConfirmationPopup(name) {
        const popup = document.createElement('div');
        popup.classList.add('confirmation-popup');
        popup.innerHTML = `
            <div class="popup-content">
                <h4>${name} has been added to the cart!</h4>
                <button class="close-popup">Close</button>
            </div>
        `;
        document.body.appendChild(popup);

        // Close the popup when clicking the close button
        document.querySelector(".close-popup").addEventListener("click", function () {
            document.body.removeChild(popup);
        });
    }

    // Update Cart UI (for the cart page)
    function updateCart() {
        cartItemsList.innerHTML = ""; // Clear the cart display
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = 0;

        // Loop through the cart items and update the UI
        cart.forEach((item, index) => {
            let li = document.createElement("li");
            li.innerHTML = `
                ${item.name} (${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2); // Update total price
    }

    updateCart(); // Update cart when page loads (in case of page refresh)

    // Remove item from the cart
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-item")) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const index = event.target.getAttribute("data-index");

            if (cart[index].quantity > 1) {
                cart[index].quantity--; // Decrease quantity
            } else {
                cart.splice(index, 1); // Remove item if quantity = 1
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart(); // Refresh the cart display
        }
    });

    // Clear cart functionality
    document.getElementById("clear-cart").addEventListener("click", function () {
        localStorage.removeItem("cart");
        updateCart();
    });

    // Confirm order functionality
    document.getElementById("confirm-order").addEventListener("click", function () {
        if (cartItemsList.children.length === 0) {
            alert("Cart is empty!");
            return;
        }

        // Show order confirmation popup
        showOrderConfirmationPopup();

        // Clear cart after confirming order
        localStorage.removeItem("cart");
        updateCart();
    });

    // Show a custom popup when order is confirmed
    function showOrderConfirmationPopup() {
        const popup = document.createElement('div');
        popup.classList.add('confirmation-popup');
        popup.innerHTML = `
            <div class="popup-content">
                <h4>Your order has been confirmed!</h4>
                <button class="close-popup">Close</button>
            </div>
        `;
        document.body.appendChild(popup);

        // Close the popup when clicking the close button
        document.querySelector(".close-popup").addEventListener("click", function () {
            document.body.removeChild(popup);
        });
    }

    // Open cart page when clicking "View Cart"
    document.getElementById("open-cart").addEventListener("click", function () {
        window.open("cart.html", "_blank", "width=400,height=600");
    });
});
