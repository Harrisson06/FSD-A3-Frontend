// ================
// Login Page Logic
// ================

// Real-time validation
document.getElementById('username')
    .addEventListener('blur', () => validateRequired('username', 'Username'));

document.getElementById('password')
    .addEventListener('blur', () => validateRequired('password', 'Password'));

async function handleLogin() {
    // Clear previous messages
    const apiMessage = document.getElementById('apiMessage');
    apiMessage.className = 'api-message';
    apiMessage.textContent = '';

    // Validate Fields
    const isUsernameValid = validateRequired('username', 'Username');
    const isPasswordValid = validateRequired('password', 'Password');
    if (!isUsernameValid || !isPasswordValid) return;

    const username = document.getElementById('username').value.trim()
    const password = document.getElementById('password').value;

    // Show loading
    showLoading(true);

    try {
        const result = await loginUser(username, password);

        if (result.success) {
            // Decode token to get role
            const decoded = decodeToken(result.token);
            const role = decoded?.role || decoded?.sub || 'driver';

            // Save session
            saveSession(result.token, role)

            apiMessage.textContent = 'Login sucessful! Redirecting...';
            apiMessage.className = 'api-message successful';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            apiMessage.textContent = result.message || 'Invalid username or password';
            apiMessage.className = 'api-message error';
        }
    } catch (error) {
        apiMessage.textcontent = 'Unable to connect to server. PLease try again.';
        apiMessage.className = 'api-message error';
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    const btn = document.getElementById('loginBtn');
    if (show) {
        loader.style.display = 'flex'
        btn.disabled = false;
    } else {
        loader.style.display = 'none';
        btn.disabled = false;
    }
}

// Allow pressing enter to submit
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key ==='Enter') handleLogin();
});