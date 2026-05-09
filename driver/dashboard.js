// ====================
// Dashboard Page Logic
// ====================

// Load Notices on page load
document.addEventListener("DOMContentLoaded", async function () {
    requireDriverAuth();
    await loadNotices();
});

async function loadNotices() {
    showLoading(true);
    const apiMessage = document.getElementById('apiMessage');
    apiMessage.className = 'api-message';
    apiMessage.textContent = '';

    try {
        const result = await getMyViolations();

        if (result.success) {
            renderNotices(result.data);
            updateStats(result.data);
        } else {
            apiMessage.textContent = result.message || 'Failed to load notices';
            apiMessage.className = 'api-message error';
        }
    } catch (error) {
        apiMessage.textContent = 'Unable to connect to server'+ error.message;
        apiMessage.className = 'api-message error';
    } finally {
        showLoading(false);
    }
} 

function renderNotices(notices) {
    const tbody = document.getElementById('noticesBody');
    const noData = document.getElementById('noData');
    const table = document.getElementById('noticesTable')

    tbody.innerHTML = '';

    if (!notices || notices.length === 0) {
        table.style.display = 'none';
        noData.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    noData.style.display = 'none';

    notices.forEach(notice => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${notice.NoticeID || 'N/A'}</td>
        <td>${formatDate(notice.noticeIssueDate)}</td>
        <td>${notice.Location || 'N/A'}</td>
        <td>${notice.ViolationDesc || 'N/A'}</td>
        <td>${notice.OfficerID || 'N/A'}</td>
        <td><span class="status-badge ${getStatusClass(notice.Status)}">${notice.Status || 'Pending'}</span></td>
        <td>
            <button class="btn-small btn-view" onclick="viewNotice(${JSON.stringify(notice).replace(/"/g, '&quot;')})">
                View
            </button>
        </td>
    `;
    tbody.appendChild(row);
    });
}
function countByStatus(notices, statusName) {
    return notices.filter(n =>
    (n.Status || n.status || '').toLowerCase() === statusName.toLowerCase()
    ).length;
}

function updateStats(notices) {
    if (!notices) return;
    const total = document.getElementById('totalNotices');
    const pending = document.getElementById('pendingNotices');
    const resolved = document.getElementById('resolvedNotices');

    if (total) total.textContent = notices.length;
    if (pending) pending.textContent = countByStatus(notices, 'pending');
    if (resolved) resolved.textContent = countByStatus(notices, 'resolved');
}

function viewNotice(notice) {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Notice Number</span>
                    <span class="detail-value">${notice.NoticeID ||'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Violation Date</span>
                    <span class="detail-value">${formatDate(notice.noticeIssueDate)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">${notice.Location || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Violation Description</span>
                    <span class="detail-value">${notice.ViolationDesc || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Officer</span>
                    <span class="detail-value">${notice.OfficerID || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Drivers License</span>
                    <span class="detail-value">${notice.DriversLicense || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">${notice.Status || Pending}</span>
                </div>
            </div>
        `;
        document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}