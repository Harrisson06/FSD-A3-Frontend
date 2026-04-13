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
// Individual Validatiors
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

 function validateDate(fieldId, label, mustBePast = false, mustBeFuture = false) {
    const value = document.getElementById(fieldId)?.value;
    if (!value) {
        showError(fieldId, `${label} is Required`);
        return false;
    }
    const date = new Date(value);
    const today = new Date();
    if (mustBePast && date >= today) {
        showError(fieldId, `${label} must be in the past`);
        return false;
    }
    if (mustBeFuture && date <= today) {
        showError(fieldId, `${label} must be in the future`);
        return false;
    }
    showSuccess(fieldId);
    return true;
 }

 function validatePhone(fieldId) {
    const field = document.getElementById(fieldId);
    const value =  field ? field.value.trim() : '';
    const phoneRegex = /^[\d\s\+\-\(\)]{7,15}$/;
    if (!value) {
        showError(fieldId, 'Phone number is required');
        return false;
    }
    if (!phoneRegex.test(value)) {
        showError(fieldId, 'Please enter a valid phone number');
        return false;
    }
    showSuccess(fieldId);
    return true;
 }

 function validateYear(fieldId) {
    const value = document.getElementById(fieldId)?.value;
    const year = parseInt(value);
    const currentYear = new Date().getFullYear();
    if (!value) {
        showError(fieldId, 'Year is required');
        return false;
    }
    if (year < 1900 || year > currentYear) {
        showError(fieldId, `Year must be between 1900 and ${currentYear}`);
        return false;
    }
    showSuccess(fieldId);
    return true;
 }

 // ============================
 // Full Register Form Validator
 // ============================

 function validateRegistrationForm() {
    const results = [
        validateRequired('username', 'Username'),
        validateEmail('email'),
        validateConfirmPassword('password', 'confirmPassword'),
        validateRequired('firstName', 'First name'),
        validateRequired('lastName', 'last name'),
        validateDate('dob', 'Date of birth', true),
        validatePhone('phone'),
        validateRequired('address', 'Address'),
        validateRequired('licenseNumber', 'License number'),
        validateDate('licenseExpiry', 'License expiry', false, true),
        validateRequired('licenseState', 'Issuing state'),
        validateRequired('plateNumber', 'Plate number'),
        validateRequired('vehicleMake', 'Vehicle make'),
        validateRequired('vehicleModel','Vehicle model'),
        validateYear('vehicleYear'),
        validateRequired('vehicleColour', 'Vehicle colour')
    ];
    return results.every(result => result === true);
 }