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
                     <input type="text" id="phone" name="phone" required pattern="[0-9]+" title="Please enter numbers only"><br>

                     <label for="address">Address:</label>
                     <input type="text" id="address" name="address" required><br>

                     <label for="payment-method">Payment Method:</label>
                     <select id="payment-method" name="payment-method" required>
                         <option value="cash">Cash</option>
                         <option value="card">Card</option>
                     </select><br>

                     <div id="card-details" style="display:none;">
                         <label for="card-number">Card Number:</label>
                         <input type="text" id="card-number" name="card-number" 
                                pattern="[0-9]+" 
                                title="Card number must contain only numbers"
                                maxlength="16"><br>

                         <label for="expiry-date">Expiry Date (MM/YY):</label>
                         <input type="text" id="expiry-date" name="expiry-date" 
                                pattern="(0[1-9]|1[0-2])/[0-9]{2}" 
                                title="Please enter expiry date in MM/YY format"
                                placeholder="MM/YY"><br>

                         <label for="cvv">CVV:</label>
                         <input type="text" id="cvv" name="cvv" 
                                pattern="[0-9]{3,4}" 
                                title="CVV must be 3 or 4 digits"
                                maxlength="4"><br>
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
            
            // Additional validation for card details
            let paymentMethod = document.getElementById('payment-method').value;
            
            if (paymentMethod === 'card') {
                let cardNumber = document.getElementById('card-number').value;
                let expiryDate = document.getElementById('expiry-date').value;
                let cvv = document.getElementById('cvv').value;

                // Validate card number (must be 16 digits)
                if (!/^\d{16}$/.test(cardNumber)) {
                    alert('Card number must be exactly 16 digits');
                    return;
                }

                // Validate expiry date
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
                    alert('Invalid expiry date. Please use MM/YY format');
                    return;
                }

                // Validate CVV (must be 3 or 4 digits)
                if (!/^\d{3,4}$/.test(cvv)) {
                    alert('CVV must be 3 or 4 digits');
                    return;
                }
            }

            // If all validations pass
            cart.length = 0;
            localStorage.setItem('cart', JSON.stringify(cart));
            populateCart();
            window.location.href = 'thanks.html';
        });
    });

    populateCart();
});
