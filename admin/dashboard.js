// =====================
// Admin Dashboard Logic
// =====================

// Protect this page
requireAdminAuth();

let allCitations = [];
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
            getMyNotices(),
            getAllOfficers()
        ]);

        if (noticesResult.success) {
            allNotices = noticesResult.data || [];
            updateStats(allNotices, allOfficers);
            renderCharts(allNotices);
        } else {
            apiMessage.textContent = 'Failed to load notices: ' +noticesResult.message;
            apiMessage.className = 'api-message error';
        }

        if (officersResult.success) {
            allOfficers = officersResult.data || [];
            updateStats(allnotices, allOfficers);
        }

    } catch (error) {
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
    document.getElementById('totalNotices').textContent = notices.length;
    document.getElementById('totalOfficers').textContent = officers.length;
    document.getElementById('pendingNotices').textContent =
        notices.filter(n => (n.Status || n.status || '').toLowerCase() === 'pending').length;
    document.getElementById('resolvedNotices').textContent =
        notices.filter(n => (n.Status || n.status || '').toLowerCase() === 'resolved').length;
}

// ======
// Charts
// ======
function renderCharts(notices) {
    renderStatusChart(notices);
    renderViolationChart(notices);
}

function renderStatusChart(notices) {
    const pending = notices.filter(c =>
        (n.Status || n.status || '').toLowerCase() === 'pending').length;
    const resolved = notices.filter(c =>
        (n.Status || n.status || '').toLowerCase() === 'resolved').length;
    const disputed = notices.filter(c =>
        (n.Status || n.status || '').toLowerCase() === 'disputed').length;
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
    // Count Notice by violation type
    const violationCounts = {};
    notices.forEach(n => {
        const type = n.ViolationType || n.violation_type || 'Unknown';
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
                label: 'Citations',
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
            <td>${officer.OfficerID || officer.officer_id || 'N/A'}</td>
            <td>${officer.FirstName || officer.first_name || 'N/A'}</td>
            <td>${officer.LastName || officer.last_name || 'N/A'}</td>
            <td>${officer.BadgeNumber || officer.badge_number || 'N/A'}</td>
            <td>${officer.District || officer.district || 'N/A'}</td>
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

// =======
// Loading
// =======
function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'flex' : 'none';
}