// ========================
// Notices Management Logic
// ========================

// Protect this page
requireAdminAuth();

let noticeToDelete = null;

// Load notices on page load
document.addEventListener('DOMContentLoaded', async function () {
    await loadAllNotices();
});

// ================
// Load ALL Notices
// ================
async function loadAllNotices() {
    showLoading(true);
    const apiMessage = document.getElementById('apiMessage');
    apiMessage.className = 'api-message';
    apiMessage.textContent = '';

    try {
        const result = await getAllNotices();

        if (result.success) {
            renderNotices(result.data);
            document.getElementById('noticeCount').textContent =
                `${result.data.length} notice(s) found`;
        } else {
            apiMessage.textContent = result.message || 'Failed to load notices';
            apiMessage.className = 'api-message error';
        }
    } catch (error) {
        console.log('Error:', error);
        apiMessage.textContent = 'Unable to connect to server';
        apiMessage.className = 'api-message error';
    } finally {
        showLoading(false);
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
        noData.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    noData.style.display = 'none';

    notices.forEach(notice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${notice.NoticeID || 'N/A'}</td>
            <td>${notice.DriversLicense || 'N/A'}</td>
            <td>${notice.ViolationDesc || 'N/A'}</td>
            <td>${formatDate(notice.noticeIssueDate)}</td>
            <td>${notice.Location || 'N/A'}</td>
            <td>
                <span class="status-badge ${getStatusClass(notice.Status)}">
                    ${notice.Status || 'Pending'}
                </span>
            </td>
            <td style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                <button class="btn-small btn-view"
                    onclick="viewNotice(${JSON.stringify(notice).replace(/"/g, '&quot;')})">
                    View
                </button>
                <button class="btn-small btn-danger"
                    onclick="openConfirm(${notice.NoticeID})">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
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
                <span class="detail-value">${notice.NoticeID || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Driver License</span>
                <span class="detail-value">${notice.DriversLicense || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Violation</span>
                <span class="detail-value">${notice.ViolationDesc || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date</span>
                <span class="detail-value">${formatDate(notice.noticeIssueDate)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Location</span>
                <span class="detail-value">${notice.Location || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">District</span>
                <span class="detail-value">${notice.District || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Officer ID</span>
                <span class="detail-value">${notice.OfficerID || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value">${notice.Status || 'Pending'}</span>
            </div>
        </div>
    `;
    document.getElementById('viewModalOverlay').style.display = 'flex';
}

function closeViewModal() {
    document.getElementById('viewModalOverlay').style.display = 'none';
}

// =============
// Create Notice
// =============
function openCreateModal() {
    document.getElementById('createModalOverlay').style.display = 'flex';
}

function closeCreateModal() {
    document.getElementById('createModalOverlay').style.display = 'none';
    document.getElementById('createMessage').className = 'api-message';
    document.getElementById('createMessage').textContent = '';
    ['noticeDriverLicense', 'noticeViolationDesc',
     'noticeDate', 'noticeLocation'].forEach(id => {
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
        validateRequired('noticeViolationDesc', 'Violation Description'),
        validateRequired('noticeDate', 'Violation date'),
        validateRequired('noticeLocation', 'Location')
    ].every(v => v === true);

    if (!isValid) return;

    const noticeData = {
        DriversLicense: parseInt(document.getElementById('noticeDriverLicense').value),
        ViolationDesc: document.getElementById('noticeViolationDesc').value.trim(),
        Location: document.getElementById('noticeLocation').value.trim(),
        noticeIssueDate: document.getElementById('noticeDate').value,
        OfficerID: 1
    };

    const result = await createNotice(noticeData);

    if (result.success) {
        msgEl.textContent = 'Notice logged successfully!';
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
function openConfirm(noticeId) {
    noticeToDelete = noticeId;
    document.getElementById('confirmOverlay').style.display = 'flex';
}

function closeConfirm() {
    noticeToDelete = null;
    document.getElementById('confirmOverlay').style.display = 'none';
}

async function confirmDelete() {
    if (!noticeToDelete) return;

    const result = await deleteNotice(noticeToDelete);
    closeConfirm();

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
    const msgEl = document.getElementById('searchMessage');
    const resultEl = document.getElementById('searchResults');
    msgEl.className = 'api-message';
    msgEl.textContent = '';
    resultEl.innerHTML = '';

    const isValid = validateRequired('searchLicense', 'Driver license number');
    if (!isValid) return;

    const license = document.getElementById('searchLicense').value.trim();
    const result = await getViolationsByLicense(license);

    if (!result.success) {
        msgEl.textContent = result.message || 'Search failed';
        msgEl.className = 'api-message error';
        return;
    }

    const notices = result.data || [];
    if (notices.length === 0) {
        msgEl.textContent = `No notices found for license ${license}`;
        msgEl.className = 'api-message';
        return;
    }

    // Render notices as a table
    resultEl.innerHTML = `
        <table class="data-table" style="margin-top:1rem;">
            <thead>
                <tr> 
                    <th>Notice ID</th>
                    <th>Date</th>
                    <th>Violation</th>
                    <th>Location</th>
                    <th>District</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${notices.map(n => `
                    <tr>
                        <td>${n.NoticeID || 'N/A'}</td>
                        <td>${formatDate(n.noticeIssueDate)}</td>
                        <td>${n.ViolationDesc || 'N/A'}</td>
                        <td>${n.Location || 'N/A'}</td>
                        <td>${n.District || 'N/A'}</td>
                        <td><span class="status-badge ${getStatusClass(n.Status)}">${n.Status || 'Pending'}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    msgEl.textContent = `Found ${notices.length} notice${notices.length === 1 ? '' : 's'} for license ${license}`;
    msgEl.className = 'api-message success';                       
}