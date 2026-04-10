// ===================
// Register Page logic
// ===================

// real-time validation as user types
document.getElementById('username')
    .addEventListener('blur', () => validateRequired('username', 'Username'));

document.getElementById('email')
    .addEventListener('blur', () => validateEmail('email'));

document.getElementById('password')
    .addEventListener('input', () => validatePassword('password'));

document.getElementById('confirmPassword')
    .addEventListener('blur', () => validateConfirmPassword('password', 'confirmPassword'));

document.getElementById('dob')
    .addEventListener('blur', () => validateDate('dob', 'Date of birth', true));

document.getElementById('phone')
    .addEventListener('blur', () => validatePhone('phone'));

// Form submit
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateRegistrationForm()) {
        return;
    }

    // We'll hook this up to the API later
    const apiMessage = document.getElementById('apiMessage');
    apiMessage.textContent = 'Registration successful! Redirecting to login...';
    apiMessage.className = 'api-message success';

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});