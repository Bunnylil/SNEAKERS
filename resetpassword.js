document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const togglePasswordIcons = document.querySelectorAll(".toggle-password");
    const form = document.querySelector("form");
    const passwordStrengthIndicators = document.querySelectorAll(".password-strength");
    
    // Get email from URL parameters or session storage
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || sessionStorage.getItem('resetEmail');

    // If no email found, redirect back (you might want to handle this differently)
    if (!email) {
        alert('No email associated with this password reset. Please start the reset process again.');
        window.location.href = 'signin.html';
        return;
    }

    // Toggle password visibility
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            const input = this.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                this.classList.remove("fa-eye-slash");
                this.classList.add("fa-eye");
            } else {
                input.type = "password";
                this.classList.remove("fa-eye");
                this.classList.add("fa-eye-slash");
            }
        });
    });

    // Password strength checker
    function checkPasswordStrength(password, strengthIndicator) {
        const strengthDots = strengthIndicator.querySelectorAll(".strength-dot");
        let strength = 0;

        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        // Cap at 4 for our dots
        strength = Math.min(strength, 4);

        strengthDots.forEach((dot, index) => {
            if (index < strength) {
                // Color based on strength level
                const colors = ['#ff0000', '#ff9900', '#ffff00', '#99ff00', '#00ff00'];
                dot.style.backgroundColor = colors[strength];
            } else {
                dot.style.backgroundColor = "#ccc";
            }
        });

        return strength;
    }

    passwordInput.addEventListener("input", function () {
        checkPasswordStrength(passwordInput.value, passwordStrengthIndicators[0]);
    });

    confirmPasswordInput.addEventListener("input", function () {
        checkPasswordStrength(confirmPasswordInput.value, passwordStrengthIndicators[1]);
    });

    // Form submission validation
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        // Validate passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // Check password strength (minimum 2/4)
        const strength = checkPasswordStrength(passwordInput.value, passwordStrengthIndicators[0]);
        if (strength < 2) {
            alert("Password is too weak. Please choose a stronger password.");
            return;
        }

        // Validate terms checkbox
        if (!document.getElementById('terms').checked) {
            alert("You must agree to the Terms and Conditions");
            return;
        }

        try {
            // Show loading state (optional)
            const submitBtn = document.getElementById('signup-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            // Send reset request to backend
            const response = await fetch('http://localhost:5000/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: passwordInput.value
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Password has been reset successfully!");
                // Clear any reset-related session data
                sessionStorage.removeItem('resetEmail');
                // Redirect to login page
                window.location.href = "signin.html";
            } else {
                alert(data.error || "Failed to reset password. Please try again.");
                submitBtn.disabled = false;
                submitBtn.textContent = 'Confirm';
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred while resetting the password. Please try again.");
            const submitBtn = document.getElementById('signup-btn');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirm';
        }
    });
});