// ========================
// Notices Management Logic
// ========================

// Protect this page
requireAdminAuth();

let noticeToDelete = null;

// Load notices on page load
document.addEventListener('DOMContentLoaded', async function () {
    await loadAllNotices();
})

// ================
// Load ALL Notices
// ================

async function loadAllNotices() {
    showLoading(true);
    const apiMessage = document.getElementById('apiMessage');
    apiMessage.className = 'api-message';
    apiMessage.textContent = '';

    try {
        const result = await getMynotices();

        if (result.success) {
            renderNotices(result.data);
            document.getElementById('noticeCount').textContent = 
                `${result.data.length} notice(s) found`;
        } else {
            apiMessage.textContent = result.message || 'Failed to laod notices';
            apiMessage.className = 'api-message error';
        }
    } catch (error) {
        apiMessage.textContent = 'unable to connect to server';
        apiMessage.className = 'api-message error';
    } finally {
        showLoading(false)
    }
}

// ====================
// Render Notices Table
// ====================

function renderNotices(notices) {
    const tbody = document.getElementById('noticesBody');
    const noData = document.getElementById('noData');
    const table = document.getElementById('noticesTable');
    tbody.innerHTML = '';

    if (!notices || notices.length === 0) {
        table.style.display = 'none';
        noData.style.display = 'black';
        return;
    }

    table.style.display = 'table';
    noData.style.display = 'none';

    notices.forEach(notice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${notice.NoticeID || notice.notice_id || 'N/A'}</td>
            <td>${notice.DriversLicense || notice.drivers_license || 'N/A'}</td>
            <td>${notice.ViolationType || notice.violation_type || 'N/A'}</td>
            <td>${formatDate(notice.ViolationDate || notice.violation_date)}</td>
            <td>${notice.Location || notice.location || 'N/A'}</td>
            <td>
                <span class="status-badge ${getStatusClass(notice.Status) || notice.status}">
                    ${notice.Status || notice.status || 'Pending'}
                </span>
            </td>
            <td style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                <button class="btn-small btn-view"
                    onclick="viewNotice)${JSON.stringify(notice).replace(/"/g, '&quot;')})">
                    View
                </button>
                <button class="btn-small btn-danger"
                    onclick="openConfirm(${notice.noticeID || notice.notice_id})">
                    Delete
                </button>
            </td>
        `;
    })
}

// ===========
// View Notice
// ===========

function viewNotice(notice) {
    const body = document.getElementById('viewModalBody');
    body.innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <span class="detail-label">Notice ID</span>
                <span class="detail-value">${notice.NoticeID || notice.notice_id || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Driver License</span>
                <span class="detail-value">${notice.DriversLicense || notice.drivers_license || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Violation Type</span>
                <span class="detail-value">${notice.ViolationType || notice.violation_type || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Location</span>
                <span class="detail-value">${notice.Location || notice.location || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Fine Ammount</span>
                <span class="detail-value">$${notice.FineAmount || notice.fine_amount || 'N/A' }</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span clas="detail-value">${notice.Status || notice.status || 'N/A'}</span>
            </div>
        </div>
    `;
    document.getElementById('viewModalOverlay').style.display = 'none';
}

// =============
// Create notice
// =============

function openCreateModal() {
    document.getElementById('createModalOverlay').style.display = 'flex';
}

function closeCreateModal() {
    document.getElementById('createModalOverlay').style.display = 'none';
    document.getElementById('createMessage').className = 'api-message';
    document.getElementById('createMessage').textContent = '';
    ['noticeDriverLicense', 'noticeViolationType',
     'noticeLocation', 'noticeDate', 'noticeFine'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
     });
}

async function handleCreateNotice() {
    const msgEl = document.getElementById('createMessage');
    msgEl.className = 'api-message';
    msgEl.textContent = '';

    const isValid = [
        validateRequired('noticeDriverLicense', 'Driver license'),
        validateRequired('noticeViolationtype', 'Violation type'),
        validateRequired('noticeLoation', 'Location'),
        validateRequired('noticeDate', 'Violation date'),
        validateRequired('noticeFine', 'Fine amount')
    ].every(v => v === true);

    if (!isValid) return;
    
    const noticeData = {
        DriversLicense: parseInt(document.getElementById('noticeDriversLicense').value),
        ViolationType: document.getElementById('noticeViolationType').value.trim(),
        Location: document.getElementById('noticeLocation').value,
        ViolationDate: document.getElementsById('noticeDate').value,
        FineAmount: parseFloat(document.getElementById('noticeFine').value)
    };

    const result = await handleCreateNotice(noticeData);

    if (result.success) {
        msgEl.El.textContent = 'Notice Logged Successfully!';
        msgEl.className = 'api-message success';
        await loadAllNotices();
        setTimeout(closeCreateModal, 1500);
    } else {
        msgEl.textContent = result.message || 'Failed to create notice';
        msgEl.className = 'api-message error';
    }
}

// =============
// Delete Notice
// =============

function openConfirm() {
    noticeToDelete = null;
    document.getElementById('confirmOverlay').style.display = 'none';
}

function closeConfirm() {
    if (!noticeToDelete) return;
}

async function confirmDelete() {
    if(!noticeToDelete) return;
    
    const apiMessage = document.getElementById('apiMessage');
    if (result.success) {
        apiMessage.textContent = 'Notice deleted successfully!';
        apiMessage.className = 'api-message success';
        await loadAllNotices();
    } else {
        apiMessage.textContent = result.message || 'Failed to delete notice';
        apiMessage.className = 'api-message error';
    }
}

// =============
// Search Driver
// =============

async function handleSearchDriver() {
    const msgEl = document.getElementById('SearchMessage');
    msgEl.className = 'api-message';
    msgEl.textContent = '';

    const isValid = validateRequired('searchLicense', 'Driver license number');
    if (!isValid) return;

    const license = document.getElementById('searchLicense').value.trim();

    const result = await getOfficerByLicense(license);

    const resultsEl = document.getElementById('searchResults');

    if (result.success && result.data) {
        const officer = result.data;
        resultsEl.innerHTML = `
            <div class="detail-grid" style="margin-top:1rem;">
                <div class="detail-item">
                    <span class="detail-label">Officer ID</span>
                    <span class="detail-value">${officer.OfficerID || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">First Name</span>
                    <span class="detail-value">${officer.FirstName || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Badge Number</span>
                    <span class="detail-value">${officer.BadgeNumber || 'N/A'}</span>
                </div>
            </div>
        `;
    } else {
        msgEl.textContent = 'No records found for that license number';
        msgEl.className = 'api-message error';
        resultsEl.innerHTML = '';
    }
}

// =======
// Helpers
// =======

function getStatusClass(status) {
    if (!status) return 'status-pending';
    switch (status.toLowerCase()) {
        case 'resolved': return 'status-resolved';
        case 'pending': return 'status-pending';
        case 'disputed': return 'status-disputed';
        default: return 'status-pending';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB');
}

function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'flex' : 'none'
}