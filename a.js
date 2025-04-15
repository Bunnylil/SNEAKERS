document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.toggle-button');
    const filterList = document.querySelector('.filter-list');
    const caret = document.querySelector('.caret');

    toggleBtn.addEventListener('click', () => {
        filterList.classList.toggle('hidden');
        caret.classList.toggle('rotate');
    });
});


function changeMainVideo(event, thumb) {
    event.preventDefault(); // Prevent default behavior to avoid page movement

    let mainVideo = document.querySelector(".main-video video");
    let newSource = thumb.querySelector("source").src;

    // Set the new source and maintain the same dimensions
    mainVideo.src = newSource;
    mainVideo.style.height = "400px"; // Ensures height remains fixed

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumb.classList.add('active');
}
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

  function changeMainVideo(event, thumbnail) {
    // Remove active class from all thumbnails
    document.querySelectorAll('.thumbnail').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked thumbnail
    thumbnail.classList.add('active');
    
    // Get the video source from clicked thumbnail
    const videoSrc = thumbnail.querySelector('video source').src;
    
    // Set the main video source
    const mainVideo = document.getElementById('mainVideo');
    mainVideo.querySelector('source').src = videoSrc;
    mainVideo.load();
}

// Add to cart functionality
document.querySelector('.add-to-cart').addEventListener('click', function() {
    // Get product details
    const product = {
        title: document.querySelector('.product-title').textContent,
        price: document.querySelector('.product-price').textContent,
        color: document.querySelector('.color-options .selected').style.backgroundColor,
        size: document.querySelector('.size-options .selected').textContent,
        videoSrc: document.getElementById('mainVideo').querySelector('source').src,
        brandLogo: document.querySelector('.brand-logo img').src,
        brandName: document.querySelector('.brand-logo span').textContent
    };
    
    // Save to localStorage
    localStorage.setItem('cartItem', JSON.stringify(product));
    
    // Update cart badge
    const cartBadge = document.querySelector('.cart-badge');
    let currentCount = parseInt(cartBadge.textContent) || 0;
    cartBadge.textContent = currentCount + 1;
    
    // Redirect to cart page (or you could use a link with href)
    window.location.href = '';
});
