// =================
// API Configuration
// =================

const API_BASE_URL = 'https://127.0.0.1:800'

// ====================
// Core fetch functions
// ====================

async function apiFetch(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/Json'
    };

    // Attach JWT token if required
    if (requiresAuth) {
        const token = sessionStorage.getItem('token');
        if (!token) {
            window.location.href = '/driver/login.html'
            return;
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

    // Handle common HTTP errors
    if (response.status === 401) {
        sessionStorage.clear();
        window.location.href = '/driver/login.html';
        throw new Error('Unauthorised = Please log in again');
    }

    if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
    }

    if (response.status === 404) {
        throw new Error('The requested resource was not found');
    }

    if (response.status === 500) {
        throw new Error('Server error - Please try again later');
    }

    // Return parsed JSON
    const data = await response.json();
    return { ok: response.ok, status: response.status, data};
}


// ==============
// Auth Endpoints
// ==============
async function loginUser(username, password) {
    try {
        //FastAPI OAuth2 expects from data not JSON
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL/token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.access_token) {
            return { success: true, token: data.access_token, tokeyType: data.token_type };
        } else {
            return { success: false, message: data.detail || 'Invalid credentials '};
        }
    } catch (error) {
        return {success: false, message: 'Unable to connect to server' };
    }
}

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            return {success: true, data };
        } else {
            return {success: false, message: data.detail || 'Registration failed' }
        }
    } catch (error) {
        return {success: false, mesage: 'Unable to connect to server' };
    }
}

// =================
// Citation endpoint
// =================
async function getCitation() {
    try {
        const result = await apiFetch('/citation/my', 'GET');
        if (result.ok) {
            return {success: true, data: result.data };
        }
        return {success: false, mesage: 'Failed to load citations'};
    } catch (error) {
        return {success: false, message: error.message}
    }
}

async function getALLCitations() {
    try {
        const result = await apiFetch('/citations', 'GET');
        if (result.ok) {
            return {sucess: true, data: result.data };
        }
        return {success: false, message: 'Failed to load citations' };
    } catch (error) {
        return {success: false, message: error.message };
    }
}

async function getCitationById(id) {
    try {
        const result = await apiFetch(`/citations/${id}`, 'GET');
        if (result.ok) {
            return {success: true, data: result.data };
        }
        return {success: false, message: 'Citation not found'};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

async function createCitation(citationData) {
    try {
        const result = await apiFetch('/citations', 'POST', citationData);
        if (result.ok) {
            return {sucess: true, data: result.data };
        }
        return {success: false, message: 'Failed to create citation' };
    } catch (error) {
        return {success: false, message: error.mesage };
    }
}

async function updateCitation(id, citationData) {
    try {
        const result = await apiFetch(`/citations/${id}`, 'PUT', citationData);
        if (result.ok) {
            return {success: true, data: result.data };
        }
        return {success: true, data: result.data };
    } catch (error) {
        return {success: false, message: error.message };
    }
}

async function deleteCitation(id) {
    try {
        const result = await apiFetch(`/citations/${id}`, 'DELETE');
        if (result.ok) {
            return {success: true };
        }
        return {success: false, message: 'Failed to delete citation'};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

// ==============
// User Endpoints
// ==============
async function getUserProfile() {
    try {
        const result = await apiFetch('/users/me', 'GET');
        if (result.ok) {
            return {success: true, data: result.data};
        }
        return {success: false, message: 'Failed to load profile' };
    } catch (error) {
        return {success: false, message: error.message };
    }
}

async function updateUserProfile(profileData) {
    try {
        const result = await apiFetch('users/me', 'PUT', profileData);
        if (result.ok) {
            return {success: true, data: result.data };
        }
        return {success: false, message: 'Failed to update profile'};
    } catch (error) {
        return {success: false, message: error.message };
    }
}

// ===============
// Admin Endpoints
// ===============
async function getAdminStats() {
    try {
        const result = await apiFetch('/admin/stats', 'GET');
        if (result.ok) {
            return {success: true, data: result.data };
        }
        return {success: false, message: 'Failed to load statistics'};
    } catch (error) {
        return {success: false, message: error.message};
    }
}

async function getAllUsers() {
    try {
        const result = await apiFetch('/admin/users', 'GET');
        if (result.ok) {
            return {success: true, data: result.data};
        }
        return {success: false, message: 'Failed to load users'};
    } catch (error) {
        return {success: false, message: error.message };
    }
}