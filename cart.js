// Global variables
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const FREE_SHIPPING_THRESHOLD = 200.0;

// Function to calculate the subtotal
function calculateSubtotal() {
  let subtotal = 0;
  cartItems.forEach((item) => {
    subtotal += parseFloat(item.price) * item.quantity;
  });
  return subtotal;
}

// Function to update the cart summary (subtotal, total, and progress bar)
function updateCartSummary() {
  const subtotal = calculateSubtotal();

  // Calculate shipping cost
  const shippingOption = document.querySelector(
    'input[name="shipping"]:checked'
  )?.value;
  let shippingCost = 0;

  if (shippingOption === "express") {
    shippingCost = 15.0;
  }

  // Calculate total
  const total = subtotal + shippingCost;

  // Update the DOM
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;

  // Update the progress bar
  updateProgressBar(subtotal);
}

// Function to update the progress bar for free shipping
function updateProgressBar(subtotal) {
  const progressBar = document.getElementById("progress-bar");
  const progressAmount = document.getElementById("progress-amount");

  const remainingAmount = FREE_SHIPPING_THRESHOLD - subtotal;

  if (remainingAmount <= 0) {
    progressBar.style.width = "100%";
    progressAmount.textContent = "You have free shipping!";
  } else {
    const progressPercentage = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressAmount.textContent = `Shop for $${remainingAmount.toFixed(
      2
    )} more to enjoy FREE Shipping`;
  }
}

// Function to remove an item from the cart
function removeItem(index) {
  cartItems.splice(index, 1);
  saveCartToLocalStorage();
  renderCartItems();
  updateCartSummary();
}

// Function to update the quantity of an item
function updateQuantity(index, change) {
  cartItems[index].quantity = Math.max(cartItems[index].quantity + change, 1);
  saveCartToLocalStorage();
  renderCartItems();
  updateCartSummary();
}

document.addEventListener('DOMContentLoaded', function() {
    // Get cart item from localStorage
    let cartItem = JSON.parse(localStorage.getItem('cartItem'));

    // Function to render cart item or empty message
    function renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        
        if (cartItem) {
            cartItemsContainer.innerHTML = `
                <tr class="cart-item-row">
                    <td class="product-column">
                        <div class="product-info">
                            <video autoplay loop muted playsinline>
                                <source src="${cartItem.videoSrc}" type="video/mp4">
                            </video>
                            <div class="details">
                                <div class="brand-info">
                                    <img src="${cartItem.brandLogo}" alt="${cartItem.brandName}">
                                    <span>${cartItem.brandName}</span>
                                </div>
                                <h3>${cartItem.title}</h3>
                                <div class="product-attributes">
                                    <span>Color: <span style="background-color:${cartItem.color}" class="color-swatch"></span></span>
                                    <span>Size: ${cartItem.size}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="quantity-column">
                        <div class="quantity-control">
                            <button class="decrement">-</button>
                            <input type="number" value="1" min="1">
                            <button class="increment">+</button>
                        </div>
                    </td>
                    <td class="price-column">${cartItem.price}</td>
                    <td class="subtotal-column">${cartItem.price}</td>
                    <td class="remove-column">
                        <button class="remove-btn" aria-label="Remove item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        } else {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-cart">Your cart is empty</td>
                </tr>
            `;
        }
        
        // Update cart summary and progress bar
        updateCartSummary();
        updateProgressBar();
        
        // Setup event listeners
        setupEventListeners();
    }

    // Function to setup all event listeners
    function setupEventListeners() {
        // Quantity controls
        const quantityControls = document.querySelectorAll('.quantity-control');
        if (quantityControls.length > 0) {
            quantityControls.forEach(control => {
                const decrement = control.querySelector('.decrement');
                const increment = control.querySelector('.increment');
                const input = control.querySelector('input');
                
                decrement?.addEventListener('click', () => {
                    if (parseInt(input.value) > 1) {
                        input.value = parseInt(input.value) - 1;
                        updateCartSummary();
                    }
                });
                
                increment?.addEventListener('click', () => {
                    input.value = parseInt(input.value) + 1;
                    updateCartSummary();
                });
                
                input?.addEventListener('change', () => {
                    if (input.value < 1) input.value = 1;
                    updateCartSummary();
                });
            });
        }
        
        // Remove button
        const removeBtn = document.querySelector('.remove-btn');
        removeBtn?.addEventListener('click', removeItem);
    }

    // Function to remove item from cart
    function removeItem() {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            // Remove from localStorage
            localStorage.removeItem('cartItem');
            cartItem = null;
            
            // Re-render the cart
            renderCart();
            
            // Update cart badge in header if it exists
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                cartBadge.textContent = '0';
            }
            
            // Show success message (optional)
            showToast('Item removed from cart');
        }
    }

    // Function to update cart summary
    function updateCartSummary() {
        if (!cartItem) {
            document.getElementById('subtotal').textContent = '$0.00';
            document.getElementById('total').textContent = '$0.00';
            return;
        }

        const priceText = document.querySelector('.price-column')?.textContent || '$0.00';
        const price = parseFloat(priceText.replace('$', ''));
        const quantity = parseInt(document.querySelector('.quantity-column input')?.value || '1');
        const subtotal = price * quantity;
        
        const shippingCost = document.querySelector('input[name="shipping"]:checked')?.value === 'free' ? 0 : 15;
        const total = subtotal + shippingCost;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        
        updateProgressBar();
    }

    // Function to update progress bar
    function updateProgressBar() {
        const subtotalText = document.getElementById('subtotal').textContent;
        const subtotal = parseFloat(subtotalText.replace('$', '')) || 0;
        const progress = (subtotal / 200) * 100;
        
        const progressBar = document.getElementById('progress-bar');
        const progressAmount = document.getElementById('progress-amount');
        
        if (progressBar && progressAmount) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
            progressAmount.textContent = `$${subtotal.toFixed(2)} of $200`;
        }
    }

    // Function to show toast message (optional)
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 2000);
        }, 100);
    }

    // Function to apply coupon (demo)
    function applyCoupon() {
        const couponCode = document.getElementById('coupon-input').value;
        showToast(`Coupon code "${couponCode}" applied! (Demo)`);
    }

    // Initialize the cart
    renderCart();
    
    // Setup coupon button
    document.querySelector('.cart-summary button')?.addEventListener('click', applyCoupon);
});