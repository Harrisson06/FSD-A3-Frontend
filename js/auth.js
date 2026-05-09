// ==============
// Auth Functions
// ==============

// Save token and user info after login
function saveSession(token, role) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
}

// Clear session on logout
function clearSession() {
    sessionStorage.clear();
}

// Check if user is logged in
function isLoggedIn() {
    return !!sessionStorage.getItem('token');
}

// Get current user role
function getRole() {
    return sessionStorage.getItem('role');
}

// protect driver pages - redirect to login if not logged in
function requireDriverAuth() {
    if (!isLoggedIn()) {
        window.location.href= '/driver/login.html';
    }
}

// Protect admin pages - redirect if not admin
function requireAdminAuth() {
    const role = getRole();
    if (!isLoggedIn() || (role !== 'Admin' && role !== 'Officer')) {
        window.location.href = '/admin/login.html';
    }
}

// Logout Driver
function logoutDriver() {
    clearSession();
    window.location.href = '/driver/login.html';
}

// Logout Admin
function logoutAdmin() {
    clearSession();
    window.location.href = '/admin/login.html';
}

// Decode JWT token to get user info
function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
}

// Check if token is expired
function isTokenExpired() {
    const token = sessionStorage.getItem('token')
    if (!token) return true;

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
}

// Auto logout if token expired
function checkTokenExpiry() {
    if (isLoggedIn() && isTokenExpired()) {
        clearSession();
        alert('Your session has expired, Please log in again.');
        window.location.href = '/driver/login.html';
    }
}