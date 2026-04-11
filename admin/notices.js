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