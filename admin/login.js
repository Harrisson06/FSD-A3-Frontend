// ======================
// Admin Login Page Logic
// ======================

// If already logged in as admin, redirect to dashboard
if (isLoggedIn() && getRole() === 'admin') {
    window.location.href = 'dashboard.html';
}

// Real-time validation
document.getElementById('username')
    .addEventListener('blur', () => validateRequired('username', 'Email / Officer ID'));

document.getElementById('password')
    .addEventListener('blur', () => validateRequired('password', 'Password'));

async function handleAdminLogin() {
    const apiMessage = document.getElementById('apiMessage');
    apiMessage.className = 'api-message';
    apiMessage.textContent = '';

    const isUsernameValid = validateRequired('username', 'Email / Officer ID');
    const isPasswordValid = validateRequired('password', 'Password');
    if (!isUsernameValid || !isPasswordValid) return;

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    showLoading(true);

    try {
        const result = await loginUser(username, password);

        if (result.success) {
            // Decode token to check role
            const decoded = decodeToken(result.token);
            const role = decoded?.role || 'user';

            // Check if user has admin/officer role
            if (role !== 'admin' && role !== 'officer') {
                apiMessage.textContent = 'Access denied. Admin credentials required.';
                apiMessage.className = 'api-message error';
                showLoading(false);
                return;
            }

            // Save session with admin role
            saveSession(result.token, 'admin');

            apiMessage.textContent = 'Login successful! Redirecting to admin dashboard...';
            apiMessage.className = 'api-message success';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } else {
            apiMessage.textContent = result.message || 'Invalid credentials';
            apiMessage.className = 'api-message error';
        }
    } catch (error) {
        apiMessage.textContent = 'Unable to connect to server. Please try again.';
        apiMessage.className = 'api-message error';
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    const btn = document.getElementById('loginBtn');
    if (show) {
        loader.style.display = 'flex';
        btn.disabled = true;
    } else {
        loader.style.display = 'none';
        btn.disabled = false;
    }
}

// Allow Enter key to submit
document.getElementById('password').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') handleAdminLogin();
});