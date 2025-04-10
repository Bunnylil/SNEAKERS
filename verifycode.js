document.addEventListener('DOMContentLoaded', function() {
    const verifyForm = document.getElementById('verify-form');
    const emailDisplay = document.getElementById('email-display');
    const codeDisplay = document.getElementById('code-display');
    
    // Get email and code from session storage
    const email = sessionStorage.getItem('resetEmail');
    const resetCode = sessionStorage.getItem('resetCode');
    
    // Display the email and code in the message
    if (email && resetCode) {
        emailDisplay.textContent = email;
        codeDisplay.textContent = resetCode;
    } else {
        // No email or code found, redirect back to forgot password
        window.location.href = 'forgotpassword.html';
    }
    
    verifyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const enteredCode = document.getElementById('code').value;
        const verifyBtn = document.getElementById('verify-btn');
        
        // Verify the entered code matches the stored code
        if (enteredCode === resetCode) {
            verifyBtn.disabled = true;
            verifyBtn.textContent = 'Verifying...';
            
            // Code is correct, proceed to password reset page
            setTimeout(() => {
                window.location.href = `resetpassword.html?email=${encodeURIComponent(email)}`;
            }, 1000);
        } else {
            alert('Invalid code. Please try again.');
        }
    });
});