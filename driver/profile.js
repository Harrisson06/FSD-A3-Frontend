// ==================
// Profile Page Logic
// ==================

// Protect this page
requireDriverAuth();

// ================
// Update Last Name
// ================
async function handleUpdateLastname() {
    const apiMessage = document.getElementById('apiMessage');
    apiMessage.className = 'api-message';
    apiMessage.textContent = '';

    const isValid = validateRequired('newLastname', 'Last name');
    if (!isValid) return;

    const newLastname = document.getElementById('newLastname').value.trim();

    // Show loading
    document.getElementById('lastnameLoader').style.display = 'flex';

    try {
        const result = await updateDriverLastname(newLastname);

        if (result.success) {
            apiMessage.textContent = 'Last name updated successfully!';
            apiMessage.className = 'api-message success';
            document.getElementById('newLastname').value = '';
            showSuccess('newLastname');
        } else {
            apiMessage.textContent = result.message || 'Failed to update last name';
            apiMessage.className = 'api-message error';
        }
    } catch (error) {
        apiMessage.textContent = 'Unable to connect to server';
        apiMessage.className = 'api-message error';
    } finally {
        document.getElementById('lastnameLoader').style.display = 'none';
    }
}

// ==============
// Update Address
// ==============
async function handleUpdateAddress() {
    const apiMessage = document.getElementById('apiMessage');
    apiMessage.className = 'api-message';
    apiMessage.textContent = '';

    const isLicenseValid = validateRequired('driverLicense', 'Driver license number');
    const isAddressValid = validateRequired('newAddress', 'Address');

    if (!isLicenseValid || !isAddressValid) return;

    const driverLicense = document.getElementById('driverLicense').value.trim();
    const newAddress = document.getElementById('newAddress').value.trim();

    // Show loading
    document.getElementById('addressLoader').style.display = 'flex';

    try {
        const result = await updateDriverAddress(driverLicense, newAddress);

        if (result.success) {
            apiMessage.textContent = 'Address updated successfully!';
            apiMessage.className = 'api-message success';
            document.getElementById('newAddress').value = '';
            showSuccess('newAddress');
        } else {
            apiMessage.textContent = result.message || 'Failed to update address';
            apiMessage.className = 'api-message error';
        }
    } catch (error) {
        apiMessage.textContent = 'Unable to connect to server';
        apiMessage.className = 'api-message error';
    } finally {
        document.getElementById('addressLoader').style.display = 'none';
    }
}

// Real-time validation
document.getElementById('newLastname')
    .addEventListener('blur', () => validateRequired('newLastname', 'Last name'));

document.getElementById('driverLicense')
    .addEventListener('blur', () => validateRequired('driverLicense', 'Driver license number'));

document.getElementById('newAddress')
    .addEventListener('blur', () => validateRequired('newAddress', 'Address'));