document.addEventListener('DOMContentLoaded', () => {
    let medicinesList = document.getElementById('medicines-list');
    let cartTableBody = document.querySelector('#cart-table tbody');
    let totalPriceElement = document.getElementById('total-price');
    let clearCartButton = document.getElementById('clear-cart');
    let addToFavoritesButton = document.getElementById('add-to-favorites');
    let applyFavoritesButton = document.getElementById('apply-favorites');
    let cart = [];

    // Fetch medicines data from JSON file
    fetch('meds.json')
        .then(response => response.json())
        .then(data => {
            populateMedicines(data);
        })
        .catch(error => {
            console.error("Error loading medicines JSON:", error);
        });

    // Function to populate medicines dynamically
    function populateMedicines(categories) {
        categories.forEach(category => {
            let categoryDiv = document.createElement('div');
            categoryDiv.classList.add('medicine-category');
            categoryDiv.innerHTML = `<h3>${category.category}</h3>`;
            category.medicines.forEach(medicine => {
                let itemDiv = document.createElement('div');
                itemDiv.classList.add('medicine-item');
                itemDiv.innerHTML = `
                    <div class="medicine-box">
                        <img src="${medicine.image}" alt="${medicine.name}" class="medicine-image">
                        <p>${medicine.name}</p>
                        <p>$${medicine.price.toFixed(2)}</p>
                        <label>Quantity:</label>
                        <input type="number" class="quantity-input" data-name="${medicine.name}" data-price="${medicine.price}" min="1" value="1">
                        <button data-name="${medicine.name}" data-price="${medicine.price}">Add to Cart</button>
                    </div>
                `;
                categoryDiv.appendChild(itemDiv);
            });
            medicinesList.appendChild(categoryDiv);
        });
    }

    // Add to cart functionality
    medicinesList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            const quantityInput = e.target.previousElementSibling;
            const quantity = parseInt(quantityInput.value, 10);

            // Validation: Check if quantity is less than 1 or not a number
            if (isNaN(quantity) || quantity <= 0) {
                alert('Please enter a valid quantity greater than 0.');
                quantityInput.focus(); // Focus back on the input field
                return;
            }

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ name, price, quantity });
            }
            updateCart();
        }
    });

    // Update cart functionality
    function updateCart() {
        cartTableBody.innerHTML = '';
        let totalPrice = 0;
        cart.forEach((item, index) => {
            const total = item.price * item.quantity;
            totalPrice += total;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${total.toFixed(2)}</td>
                <td>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </td>
            `;
            cartTableBody.appendChild(row);
        });
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    // Remove individual item from cart
    cartTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.dataset.index, 10);
            cart.splice(index, 1);
            updateCart();
        }
    });

    // Clear all items from cart
    clearCartButton.addEventListener('click', () => {
        cart = [];
        updateCart();
    });

    // Save favorites
    addToFavoritesButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Add items to save as favorites.');
            return;
        }
        localStorage.setItem('favorites', JSON.stringify(cart));
        alert('Favorites saved successfully!');
    });

    // Apply favorites
    applyFavoritesButton.addEventListener('click', () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.length === 0) {
            alert('No favorites found. Add items to your cart and save as favorites first.');
            return;
        }
        cart = favorites;
        updateCart();
    });

    // Redirect to Billing Summary Page
    document.getElementById('buy-now').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission
        if (cart.length === 0) {
            alert('Your cart is empty! Please add medicines before proceeding.');
            return;
        }

        // Save cart data to localStorage for access on the billing page
        localStorage.setItem('cart', JSON.stringify(cart));

        // Redirect to the Billing Summary Page
        window.location.href = 'billing-summary.html';
    });
});
