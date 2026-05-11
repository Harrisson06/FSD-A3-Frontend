// ============================
// Validation Utility Functions
// ============================

// Show error message for a field
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`)
    if (field) field.classList.add('error');
    if (field) field.classList.remove('success');
    if (error) error.textContent = message;
}

// Show success state for a field
function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (field) field.classList.remove('error');
    if (field) field.classList.add('success');
    if (error) error.textContent = '';
}

// Validates password
 function validateConfirmPassword(passwordId, confirmId) {
    const password = document.getElementById(passwordId)?.value;
    const confirmPass = document.getElementById(confirmId)?.value;
    if (!confirmPass) {
        showError(confirmId, 'Please confirm your password');
        return false;
    }
    if (password !== confirmPass) {
        showError(confirmId, 'Passwords do not match');
        return false;
    }
    showSuccess(confirmId);
    return true;
 }

// Clear all errors on a form
function clearErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    form.querySelectorAll('input').forEach(el => {
        el.classList.remove('error', 'success');
    });
}

// ======================
// Individual Validators
// ======================

function validateRequired(fieldId, label) {
    const value = document.getElementById(fieldId)?.value.trim();
    if (!value) {
        showError(fieldId, `${label} is required`);
        return false;
    }
    showSuccess(fieldId);
    return true;
 }

 function validateEmail(fieldId) {
    const value = document.getElementById(fieldId)?.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
        showError(fieldId, 'Please enter a valid email address')
        return false;
    }
    if (!emailRegex.test(value)) {
        showError(fieldId, 'Please enter a valid email address');
        return false;
    }
    showSuccess(fieldId);
    return true;
 }

 function validatePassword(fieldId) {
    const value = document.getElementById(fieldId)?.value;
    const strengthEl = document.getElementById('password-strength');

    if (!value) {
        showError(fieldId, 'Password is required');
        if (strengthEl) strengthEl.textContent = '';
        return false;
    }
    if (value.length < 8) {
        showError(fieldId, 'Password must be at least 8 characters');
        if (strengthEl) {
            strengthEl.textContent = 'Strength: Weak';
            strengthEl.className = 'password-strength strength-weak';
        }
        return false;
    }

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    if (!hasUpper || !hasLower || !hasNumber) {
        showError(fieldId, 'Password must contain, uppercase, lowercase and a number');
        if (strengthEl) {
            strengthEl.textContent = 'Strength: Medium'
            strengthEl.className = 'password-strength strength-medium'
        }
        return false;
    }

    showSuccess(fieldId);
    if (strengthEl) {
        strengthEl.textContent = 'Strength: Strong';
        strengthEl.className = 'password-strength strength-strong';
    }
    return true;

 }

 // ============================
 // Full Register Form Validator
 // ============================

 function validateRegistrationForm() {
    const results = [
        validateEmail('email'),
        validatePassword('password'),
        validateConfirmPassword('password', 'confirmPassword'),
        validateRequired('licenseNumber', 'License number'),
    ];
    return results.every(result => result === true);
 }