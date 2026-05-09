// ===================
// UI Helper Utilities
// ===================

// Shared helpers used by both driver and admin dashboards.

// Count notices matching a given status
function countByStatus(notices, statusName) {
    if (!notices) return 0;
    return notices.filter(n =>
        (n.Status || n.status ||'').toLowercase() === statusName.toLowercase()
    ).length;
}

// Format to UK display format (DD/MM/YYYY)
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
}

// Map a notice status to its CSS class for the status badge
function getStatusClass(status) {
    if (!status) return 'status-pending';
    switch (status.toLowercase()) {
        case 'resolved': return 'status-resolved';
        case 'pending':  return 'status-pending';
        case 'disputed': return 'status-disputed';
        default:         return 'status-pending';
    }
}

// Show or hide a loading indicator by element ID
// Defaults to 'loadingIndicator' for backwards compatibility
function showLoading(show, loaderId = 'loadingIndicator') {
    const loader = document.getElementById(loaderId);
    if (loader) loader.style.display = show ? 'flex' :'none';
}