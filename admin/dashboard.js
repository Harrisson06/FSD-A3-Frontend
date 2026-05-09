// =====================
// Admin Dashboard Logic
// =====================

// Protect this page
requireAdminAuth();

let allNotices = [];
let allOfficers = [];

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', async function () {
    await loadDashboardData();
});

async function loadDashboardData() {
    showLoading(true);
    const apiMessage = document.getElementById('apiMessage');

    try {
        // Load notices and officers in parallel
        const [noticesResult, officersResult] = await Promise.all([
            getAllNotices(),
            getAllOfficers()
        ]);

        const errors = [];
        if (noticesResult.success) {
            allNotices = noticesResult.data || [];
        } else {
            errors.push('notices: ' + noticesResult.message);
        }

        if (officersResult.success) {
            allOfficers = officersResult.data || [];
        } else {
            errors.push('officers: ' + officersResult.message)
        }

        updateStats(allNotices, allOfficers);
        renderCharts(allNotices);

        if (errors.length > 0) {
            apiMessage.textContent = 'Failed to load: ' + errors.join('; ');
            apiMessage.className = 'api-message error';
        }
    } catch (error) {
        console.log('Dashboard error:', error);
        apiMessage.textContent = 'Unable to connect to server';
        apiMessage.className = 'api-message error';
    } finally {
        showLoading(false);
    }
}

// =====
// Stats
// =====
function updateStats(notices, officers) {
    const total = document.getElementById('totalNotices');
    const totalOff = document.getElementById('totalOfficers');
    const pending = document.getElementById('pendingNotices');
    const resolved = document.getElementById('resolvedNotices');

    if (total) total.textContent = notices.length;
    if (totalOff) totalOff.textContent = officers.length;
    if (pending) pending.textContent = countByStatus(notices, 'pending');
    if (resolved) resolved.textContent = countByStatus(notices, 'resolved');
}

// ======
// Charts
// ======
function renderCharts(notices) {
    renderStatusChart(notices);
    renderViolationChart(notices);
}

function renderStatusChart(notices) {
    const pending = countByStatus(notices, 'pending');
    const resolved = countByStatus(notices, 'resolved');
    const disputed = countByStatus(notices, 'disputed');
    const other = notices.length - pending - resolved - disputed;

    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'Resolved', 'Disputed', 'Other'],
            datasets: [{
                data: [pending, resolved, disputed, other],
                backgroundColor: ['#ffc107', '#28a745', '#dc3545', '#6c757d'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function renderViolationChart(notices) {
    // Count Notice by violation Description
    const violationCounts = {};
    notices.forEach(n => {
        const type = n.ViolationDesc || 'Unknown';
        violationCounts[type] = (violationCounts[type] || 0) + 1;
    });

    const labels = Object.keys(violationCounts);
    const data = Object.values(violationCounts);

    const ctx = document.getElementById('violationChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Notices',
                data,
                backgroundColor: '#003087',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// ==============
// Officers Table
// ==============
async function loadOfficers() {
    const section = document.getElementById('officersSection');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });

    if (allOfficers.length > 0) {
        renderOfficers(allOfficers);
        return;
    }

    const result = await getAllOfficers();
    if (result.success) {
        allOfficers = result.data;
        renderOfficers(allOfficers);
    }
}

function renderOfficers(officers) {
    const tbody = document.getElementById('officersBody');
    tbody.innerHTML = '';

    if (!officers || officers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No officers found</td></tr>';
        return;
    }

    officers.forEach(officer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${officer.OfficerID || 'N/A'}</td>
            <td>${officer.FirstName || 'N/A'}</td>
            <td>${officer.LastName || 'N/A'}</td>
            <td>${officer.PersonnelNumber || 'N/A'}</td>
            <td>
                <button class="btn-small btn-warning" onclick="openOfficerModal()">
                    Edit Name
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function hideOfficers() {
    document.getElementById('officersSection').style.display = 'none';
}

// =============
// Officer Modal
// =============
function openOfficerModal() {
    document.getElementById('officerModalOverlay').style.display = 'flex';
}

function closeOfficerModal() {
    document.getElementById('officerModalOverlay').style.display = 'none';
    document.getElementById('newOfficerLastname').value = '';
    document.getElementById('officerModalMessage').className = 'api-message';
    document.getElementById('officerModalMessage').textContent = '';
}

async function handleUpdateOfficerLastname() {
    const msgEl = document.getElementById('officerModalMessage');
    msgEl.className = 'api-message';
    msgEl.textContent = '';

    const isValid = validateRequired('newOfficerLastname', 'Last name');
    if (!isValid) return;

    const newLastname = document.getElementById('newOfficerLastname').value.trim();

    const result = await updateOfficerLastname(newLastname);
    if (result.success) {
        msgEl.textContent = 'Officer last name updated successfully!';
        msgEl.className = 'api-message success';
        await loadDashboardData();
        setTimeout(closeOfficerModal, 1500);
    } else {
        msgEl.textContent = result.message || 'Failed to update officer';
        msgEl.className = 'api-message error';
    }
}