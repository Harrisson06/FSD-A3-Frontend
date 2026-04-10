// ====================
// Dashboard Page Logic
// ====================

// Protect this page
requireDriverAuth();

// Load Notices on page load
document.addEventListener("DOMContentLoaded", async function () {
    await loadNotices();
});

async function loadNotices() {
    showloading(true);
    const apiMessage = document.getElementById('apiMessage');

    try {
        const result = await getMyCitations();

        if (result.success) {
            renderNotices(result.data);
            updateStats(result.data);
        } else {
            apiMessage.textContent = result.message || 'Failed to load notices';
            apiMessage.className = 'api-message error';
        }
    } catch (error) {
        apiMessage.textContent = 'Unable to connect to server';
        apiMessage.className = 'api-message error';
    } finally {
        showLoading(false);
    }
} 

function renderNotices(notices) {
    const tbody = document.getElementById('citationsBody');
    const noData = document.getElementById('noData');
    const table = document.getElementById('NoticeTable')

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
        <td>${notice.NoticeID || notice.notice_id || 'N/A'}</td>
        <td>${formatDate(notice.ViolationDate || notice.violation_date)}</td>
        <td>${notice.Location || notice.location || 'N/A'}</td>
        <td>${noticeViolationType || notice.violation_type || 'N/A'}</td>
        <td>${notice.OfficerName || notice.officer_name || 'N/A'}</td>
        <td><span class="status-badge ${getStatusClass(notice.Status || notice.Status)}">${notice.status || 'Pending'}</span></td>
        <td>
            <button class="btn-small btn-view" onclick="viewNotice(${JSON.stringify(notice).replace(/"/g, '&quot;')})">
                View
            </button>
        </td>
    `;
    tbody.appendChild(row);
    });
}

function updateStats(notices) {
    if (!notices) return;
        document.getElementById('totalnotices').textContent = notices.length;
        document.getElementById('pendingnotices').textContent = 
            notices.filter(c => (c.Status || c.status || '').toLowerCase() === 'pending').length;
        document.getElementById('resolvedNotices').textContent = 
            notices.filter(c => (c.Status || c.status || '').toLowerCase() === 'Resolved').length
}

function viewNotice(notice) {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
            <div class="detail-grid">
            <div class="detail-item">
                <span class="detail-label">Notice Number</span>
                <span class="detail-value">${notice.NoticeID || notice.notice_id || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Violation Date</span>
                <span class="detail-value">${formatDate(notice.ViolationDate || notice.violation_date)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Location</span>
                <span class="detail-value">${notice.Location || notice.location || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Violation Type</span>
                <span class="detail-value">${notice.ViolationType || notice.violation_type || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Officer</span>
                <span class="detail-value">${notice.OfficerName || notice.officer_name || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Vehicle</span>
                <span class="detail-value">${notice.VehiclePlate || notice.vehicle_plate || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value">${notice.Status || notice.status || 'Pending'}</span>
            </div>
        </div>
    `;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'flex';
}

function getStatusClass(status) {
    if (!status) return 'status-pending';
    switch (!status.toLowerCase()) {
        case 'resolved': return 'status-resolved';
        case 'pending': return 'status-pending';
        case 'displuted': return 'status-disputed';
        default: return 'status-pending';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
}

function showLoading(show) {
    const loader = document.getElementById('loadingindicator');
    loader.style.display = show ? 'flex' : 'none';
}