document.addEventListener('DOMContentLoaded', () => {
    let cartTableBody = document.querySelector('#cart-table tbody');
    let totalPriceElement = document.getElementById('total-price');
    let clearCartButton = document.getElementById('clear-cart');
    let payNowButton = document.getElementById('pay-now');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function populateCart() {
        cartTableBody.innerHTML = '';
        let totalPrice = 0;

        cart.forEach((item, index) => {
            let total = item.price * item.quantity;
            totalPrice += total;

            let row = document.createElement('tr');
            row.innerHTML = 
                `<td>${item.name}</td>
                 <td>${item.quantity}</td>
                 <td>$${item.price.toFixed(2)}</td>
                 <td>$${total.toFixed(2)}</td>
                 <td><button class="remove-item" data-index="${index}">Remove</button></td>`;
            cartTableBody.appendChild(row);
        });

        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    cartTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            let index = parseInt(e.target.dataset.index, 10);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            populateCart();
        }
    });

    clearCartButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart.length = 0;
            localStorage.setItem('cart', JSON.stringify(cart));
            populateCart();
        }
    });

    payNowButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Add items to proceed.');
            return;
        }

        let modal = document.createElement('div');
        modal.id = 'payment-modal';
        modal.innerHTML = 
            `<div class="modal-content">
                 <span class="close-modal">&times;</span>
                 <h2>Delivery and Payment Details</h2>
                 <form id="payment-form">
                     <label for="name">Name:</label>
                     <input type="text" id="name" name="name" required><br>

                     <label for="phone">Phone Number:</label>
                     <input type="text" id="phone" name="phone" required><br>

                     <label for="address">Address:</label>
                     <input type="text" id="country-code" name="country-code" required><br>

                     <label for="payment-method">Payment Method:</label>
                     <select id="payment-method" name="payment-method" required>
                         <option value="cash">Cash</option>
                         <option value="card">Card</option>
                     </select><br>

                     <div id="card-details" style="display:none;">
                         <label for="card-number">Card Number:</label>
                         <input type="text" id="card-number" name="card-number"><br>

                         <label for="expiry-date">Expiry Date:</label>
                         <input type="text" id="expiry-date" name="expiry-date"><br>

                         <label for="cvv">CVV:</label>
                         <input type="text" id="cvv" name="cvv"><br>
                     </div>

                     <button type="submit">Submit Payment</button>
                 </form>
             </div>`;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        document.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('payment-method').addEventListener('change', (e) => {
            let cardDetails = document.getElementById('card-details');
            if (e.target.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });

        document.getElementById('payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            cart.length = 0;
            localStorage.setItem('cart', JSON.stringify(cart));
            populateCart();
            window.location.href = 'thanks.html';
        });
    });

    populateCart();
});
