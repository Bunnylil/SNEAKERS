// hamburger.js

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const hamburgerMenu = document.querySelector(".hamburger-menu");

  hamburger.addEventListener("click", function () {
    // Toggle the visibility of the hamburger menu
    if (hamburgerMenu.style.display === "block") {
      hamburgerMenu.style.display = "none";
    } else {
      hamburgerMenu.style.display = "block";
    }
  });

  // Close the hamburger menu when clicking outside of it
  document.addEventListener("click", function (event) {
    if (
      !hamburger.contains(event.target) &&
      !hamburgerMenu.contains(event.target)
    ) {
      hamburgerMenu.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  const colorButtons = document.querySelectorAll(".color-options button");

  // Load wishlist state from localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};

  wishlistButtons.forEach((button, index) => {
      const productCard = button.closest(".product-card");
      const productId = index; // Using index as a simple identifier

      // Restore state
      if (wishlist[productId]) {
          button.classList.add("favorited");
          button.innerHTML = '<i class="fa-solid fa-heart"></i>';
      }

      button.addEventListener("click", function () {
          if (wishlist[productId]) {
              delete wishlist[productId];
              button.classList.remove("favorited");
              button.innerHTML = '<i class="fa-regular fa-heart"></i>';
          } else {
              wishlist[productId] = true;
              button.classList.add("favorited");
              button.innerHTML = '<i class="fa-solid fa-heart"></i>';
          }
          localStorage.setItem("wishlist", JSON.stringify(wishlist));
      });
  });

  colorButtons.forEach(button => {
      button.addEventListener("click", function () {
          const productCard = button.closest(".product-card");
          const productImage = productCard.querySelector(".product-image img");
          const newImageSrc = button.getAttribute("data-image");
          if (newImageSrc) {
              productImage.src = newImageSrc;
          }
      });
  });
});
