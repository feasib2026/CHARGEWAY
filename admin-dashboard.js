// ChargeWay Admin Dashboard JavaScript

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    requireAdminAuth();
    loadDashboardStats();
    loadRecentBookings();
});

// Load dashboard statistics
function loadDashboardStats() {
    try {
        const bookings = getBookings();
        const chargers = getChargers();
        
        // Calculate statistics
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
        const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
        const completedBookings = bookings.filter(b => b.status === 'Completed').length;
        const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
        const availableChargers = chargers.filter(c => c.status === 'Available').length;
        
        // Update DOM
        document.getElementById('totalBookings').textContent = totalBookings;
        document.getElementById('pendingBookings').textContent = pendingBookings;
        document.getElementById('confirmedBookings').textContent = confirmedBookings;
        document.getElementById('completedBookings').textContent = completedBookings;
        document.getElementById('cancelledBookings').textContent = cancelledBookings;
        document.getElementById('availableChargers').textContent = `${availableChargers} / ${chargers.length}`;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load recent bookings
function loadRecentBookings() {
    try {
        const tableBody = document.getElementById('recentBookingsTable');
        if (!tableBody) return;

        const bookings = getBookings();
        
        // Sort by creation date (newest first) and get top 5
        const recentBookings = bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        if (recentBookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No bookings yet</td></tr>';
            return;
        }
        
        tableBody.innerHTML = recentBookings.map(booking => {
            // Handle both old chargerId and new portId for backward compatibility
            const chargerId = booking.portId || booking.chargerId;
            const charger = getChargers().find(c => c.id === chargerId || c.ports.some(p => p.id === chargerId));
            const statusClass = getStatusClass(booking.status);
            
            return `
                <tr>
                    <td>${booking.id}</td>
                    <td>${booking.customerName}</td>
                    <td>${formatDisplayDate(booking.date)}</td>
                    <td>${formatTimeRange(booking.startTime, booking.endTime)}</td>
                    <td>${charger ? charger.name : 'Unknown'}</td>
                    <td><span class="booking-status ${statusClass}">${booking.status}</span></td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading recent bookings:', error);
        const tableBody = document.getElementById('recentBookingsTable');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error loading bookings</td></tr>';
        }
    }
}

// Get status class for styling
function getStatusClass(status) {
    switch (status) {
        case 'Confirmed':
            return 'status-available';
        case 'Pending':
            return 'status-reserved';
        case 'Completed':
            return 'status-charging';
        case 'Cancelled':
            return 'status-offline';
        default:
            return 'status-available';
    }
}