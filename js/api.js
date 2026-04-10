// =================
// API Configuration
// =================
const API_BASE_URL = 'http://127.0.0.1:8000';

// ===================
// Core Fetch Function
// ===================
async function apiFetch(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (requiresAuth) {
        const token = sessionStorage.getItem('token');
        if (!token) {
            window.location.href = '/driver/login.html';
            return;
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (response.status === 401) {
        sessionStorage.clear();
        window.location.href = '/driver/login.html';
        throw new Error('Unauthorised - please log in again');
    }
    if (response.status === 403) throw new Error('You do not have permission');
    if (response.status === 404) throw new Error('Resource not found');
    if (response.status === 500) throw new Error('Server error - please try again later');

    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
}

// ==============
// Auth Endpoints
// ==============
async function loginUser(username, password) {
    try {
        // Your FastAPI uses /api/Login with form data
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/api/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.access_token) {
            return { success: true, token: data.access_token, tokenType: data.token_type };
        } else {
            return { success: false, message: data.detail || 'Invalid credentials' };
        }
    } catch (error) {
        return { success: false, message: 'Unable to connect to server' };
    }
}

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.detail || 'Registration failed' };
        }
    } catch (error) {
        return { success: false, message: 'Unable to connect to server' };
    }
}

// =====================
// Violations Endpoints
// =====================

// Driver - get their own violations
async function getMyViolations() {
    try {
        const result = await apiFetch('/api/violations/my-violations', 'GET');
        if (result.ok) {
            return { success: true, data: result.data };
        }
        return { success: false, message: 'Failed to load violations' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Admin - create a new correction notice
async function createCorrections(correctionsData) {
    try {
        const result = await apiFetch('/api/corrections/log-correction', 'POST', correctionsData);
        if (result.ok) {
            return { success: true, data: result.data };
        }
        return { success: false, message: 'Failed to create orrections notice' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Admin - delete a correction notice
async function deleteNotice(noticeId) {
    try {
        const result = await apiFetch(`/api/corrections/delete-notice/${noticeId}`, 'DELETE');
        if (result.ok) {
            return { success: true };
        }
        return { success: false, message: 'Failed to delete Notice' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ================
// Driver Endpoints
// ================

// Update driver last name
async function updateDriverLastName(newLastname) {
    try {
        const result = await apiFetch(
            `/api/drivers/update-lastname?new_lastname=${encodeURIComponent(newLastname)}`,
            'PUT'
        );
        if (result.ok) {
            return {success: true, data: result.data};
        }
        return {success: false, message: 'Failed to update last name'};
    } catch (error) {
        return {success: false, message: error.message}
    }
}

// Update driver's address
async function updateDriverAddress(driverLicense, newAddress) {
    try {
        const result = await apiFetch(
            `/api/drivers/update-address?driver_license${driverLicense}&new_address=${encodeURIComponent(newAddress)}`,
            'PUT'
        );
        if (result.ok) {
            return {success: true, data: result.data};
        }
        return {success: false, message: 'Failed to update address'};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

// Delete a driver
async function deleteDriver(driverLicense) {
    try {
        const result = await apiFetch(`/api/drivers/delete/${driverlicense}`, 'DELETE');
        if (result.ok) {
            return {success: true};
        }
        return {success: false, message: 'Failed to delete driver'};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

// ================
// Officer endpoint
// ================

// Get all officers
async function getAllOfficers() {
    try {
        const result = await apiFetch('/api/Officers', 'GET');
        if (result.ok) {
            return {success: true, data: result.data};
        }
        return {success: false, message: 'Failed to laod officers'};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

// Get officer by license
async function getOfficerByLicense(driversLicense) {
    try {
        const result = await apiFetch(`/api/officers/linked-to-license/${driversLicense}`, 'GET');
        if (result.ok) {
            return {success: true, data: result.data };
        }
        return {success: false, message: 'Officer not found'};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

// Update officer last name
async function updateOfficerLastName(newLastname) {
    try {
        const result = await apiFetch(
            `/api/officers/update-lastname?new_lastname=${encodeURIComponent(newLastname)}`,
            'PUT'
        );
        if (result.ok) {
            return {success: true, data: result.data};
        }
        return {success: false, message: 'Failed to update officers last name'};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

// =================
// Vehicle Endpoints
// =================

// Delete Vehicle by VIN
async function deleteVehicle(vin) {
    try {
        const result = await apiFetch(`/api/vehicles/delete/${vin}`, 'DELETE');
        if (result.ok) {
            return {success: true};
        }
        return {success: false, message: 'Failed to delete vehicle'};
    } catch (error) {
        return {success: false, message: error.message}
    }
}