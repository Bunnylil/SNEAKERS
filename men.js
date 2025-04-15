document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.toggle-button');
    const filterList = document.querySelector('.filter-list');
    const caret = document.querySelector('.caret');

    toggleBtn.addEventListener('click', () => {
        filterList.classList.toggle('hidden');
        caret.classList.toggle('rotate');
    });
});

document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
  });

  // Toggle user dropdown
  document.querySelector('.user-dropdown').addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
    }
  });

  // Close menu when resizing to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
      document.querySelector('.nav-menu').classList.remove('active');
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Initialize favorites from localStorage or empty array
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Function to update favorite icon state
    function updateFavoriteIcons() {
        document.querySelectorAll('.wishlist-icon').forEach(icon => {
            const productCard = icon.closest('.product-card');
            const productId = productCard.getAttribute('data-id') || 
                             productCard.querySelector('.product-title').textContent;
            
            if (favorites.includes(productId)) {
                icon.innerHTML = '<i class="fas fa-heart" style="color: red;"></i>';
                icon.classList.add('favorited');
            } else {
                icon.innerHTML = '<i class="fas fa-heart"></i>';
                icon.classList.remove('favorited');
            }
        });
    }

    // Toggle favorite status
    function toggleFavorite(productId) {
        const index = favorites.indexOf(productId);
        if (index === -1) {
            favorites.push(productId);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteIcons();
    }

    // Add click event to all wishlist icons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.wishlist-icon')) {
            const icon = e.target.closest('.wishlist-icon');
            const productCard = icon.closest('.product-card');
            const productId = productCard.getAttribute('data-id') || 
                             productCard.querySelector('.product-title').textContent;
            toggleFavorite(productId);
        }
    });

    // Clear All button functionality
    const clearBtn = document.querySelector('.clear-btn');
    clearBtn.addEventListener('click', function() {
        // Clear all checkboxes
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear price inputs
        document.querySelectorAll('.price-input').forEach(input => {
            input.value = '';
        });
        
        // Remove active class from size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show all products
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = 'block';
        });
        
        // Reset sort to default
        document.querySelector('.sort-options select').value = 'Popularity';
        
        // Update product count
        updateProductCount();
    });

    // Brand filter functionality
    document.querySelectorAll('.filter-section:nth-child(7) input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const selectedBrands = Array.from(
                document.querySelectorAll('.filter-section:nth-child(7) input[type="checkbox"]:checked')
            ).map(cb => cb.nextElementSibling.textContent.trim());
            
            document.querySelectorAll('.product-card').forEach(card => {
                const cardBrand = card.getAttribute('data-brand');
                
                if (selectedBrands.length === 0) {
                    // If no brands selected, show all
                    card.style.display = 'block';
                } else {
                    // Only show cards that match selected brands
                    card.style.display = selectedBrands.includes(cardBrand) ? 'block' : 'none';
                }
            });
            
            // Apply current sort and update count
            sortProducts(document.querySelector('.sort-options select').value);
            updateProductCount();
        });
    });

    // Toggle filter sections
    document.querySelectorAll('.filter-header').forEach(header => {
        header.addEventListener('click', function() {
            const options = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon');
            
            if (options.style.display === 'none' || !options.style.display) {
                options.style.display = 'block';
                icon.textContent = '-';
            } else {
                options.style.display = 'none';
                icon.textContent = '+';
            }
        });
        
        // Initialize - hide all filter options except Price and Size (which have '-' initially)
        const icon = header.querySelector('.toggle-icon');
        if (icon.textContent === '+') {
            header.nextElementSibling.style.display = 'none';
        }
    });

    // Size filter functionality
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            filterProducts();
        });
    });

    // Price filter functionality
    const okBtn = document.querySelector('.ok-btn');
    okBtn.addEventListener('click', function() {
        filterProducts();
    });

    // Sort functionality
    const sortSelect = document.querySelector('.sort-options select');
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
    });

    // Main filtering function
    function filterProducts() {
        // Get selected brands
        const selectedBrands = Array.from(
            document.querySelectorAll('.filter-section:nth-child(7) input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.nextElementSibling.textContent.trim());
        
        // Get price range
        const minInput = document.querySelector('.price-input:first-child');
        const maxInput = document.querySelector('.price-input:last-child');
        const minPrice = parseFloat(minInput.value) || 0;
        const maxPrice = parseFloat(maxInput.value) || Infinity;
        
        // Filter products
        document.querySelectorAll('.product-card').forEach(card => {
            const brand = card.getAttribute('data-brand');
            const priceText = card.querySelector('.product-price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            
            // Brand filter - exact match
            const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(brand);
            
            // Price filter
            const priceMatch = price >= minPrice && price <= maxPrice;
            
            if (brandMatch && priceMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Apply current sort
        sortProducts(sortSelect.value);
        
        // Update product count
        updateProductCount();
    }

    // Sorting function
    function sortProducts(sortBy) {
        const productsContainer = document.querySelector('.products-grid');
        const products = Array.from(document.querySelectorAll('.product-card[style="display: block"], .product-card:not([style])'));
        
        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace(/[^0-9.]/g, ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace(/[^0-9.]/g, ''));
            
            switch(sortBy) {
                case 'Price: Low to High':
                    return priceA - priceB;
                case 'Price: High to Low':
                    return priceB - priceA;
                case 'Newest':
                    // Placeholder - would need actual date data
                    return 0;
                case 'Popularity':
                    // Placeholder - would need actual rating data
                    const ratingA = parseFloat(a.querySelector('.rating-count').textContent.replace(/[^0-9]/g, ''));
                    const ratingB = parseFloat(b.querySelector('.rating-count').textContent.replace(/[^0-9]/g, ''));
                    return ratingB - ratingA;
                default:
                    return 0;
            }
        });
        
        // Reattach sorted products
        products.forEach(product => {
            productsContainer.appendChild(product);
        });
    }

    // Update product count display
    function updateProductCount() {
        const visibleProducts = document.querySelectorAll('.product-card[style="display: block"], .product-card:not([style])').length;
        document.querySelector('.results-count span').textContent = `Displaying ${visibleProducts} products`;
    }

    // Initialize
    updateProductCount();
    updateFavoriteIcons(); // Initialize favorite icons
});