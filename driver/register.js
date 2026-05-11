// ===================
// Register Page Logic
// ===================

// Real-time validation as user types
document.getElementById('email')
    .addEventListener('blur', () => validateEmail('email'));

document.getElementById('password')
    .addEventListener('input', () => validatePassword('password'));

document.getElementById('confirmPassword')
    .addEventListener('blur', () => validateConfirmPassword('password', 'confirmPassword'));

// Form submit
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateRegistrationForm()) {
        return;
    }

    const apiMessage = document.getElementById('apiMessage');
    apiMessage.className = 'api-message';
    apiMessage.textContent = '';

    // Only send what the API expects
    const userData = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        role: 'Citizen',
        OfficerID: null,
        DriversLicense: parseInt(document.getElementById('licenseNumber').value) || 0
    };

    const registerBtn = document.getElementById('registerBtn');
    registerBtn.disabled = true;
    registerBtn.textContent = 'Creating account...';

    const result = await registerUser(userData);

    if (result.success) {
        apiMessage.textContent = 'Registration successful! Redirecting to login...';
        apiMessage.className = 'api-message success';
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        apiMessage.textContent = result.message || 'Registration failed';
        apiMessage.className = 'api-message error';
        registerBtn.disabled = false;
        registerBtn.textContent = 'Create Account';
    }
});