// ChargeWay Admin Bookings Management JavaScript

// Initialize admin bookings page
document.addEventListener('DOMContentLoaded', function() {
    requireAdminAuth();
    loadBookingsTable();
});

// Load bookings table
function loadBookingsTable(filterStatus = 'all', filterDate = '') {
    try {
        const tableBody = document.getElementById('bookingsTable');
        if (!tableBody) return;

        let bookings = getBookings();
        
        // Apply status filter
        if (filterStatus !== 'all') {
            bookings = bookings.filter(b => b.status === filterStatus);
        }
        
        // Apply date filter
        if (filterDate) {
            bookings = bookings.filter(b => b.date === filterDate);
        }
        
        // Sort by date (newest first)
        bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (bookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10" style="text-align: center;">No bookings found</td></tr>';
            return;
        }
        
        tableBody.innerHTML = bookings.map(booking => {
            // Handle both old chargerId and new portId for backward compatibility
            const chargerId = booking.portId || booking.chargerId;
            const charger = getChargers().find(c => c.id === chargerId || c.ports.some(p => p.id === chargerId));
            const statusClass = getStatusClass(booking.status);
            
            return `
                <tr>
                    <td>${booking.id}</td>
                    <td>${booking.customerName}</td>
                    <td>${booking.contactNumber}</td>
                    <td>${formatDisplayDate(booking.date)}</td>
                    <td>${formatTimeRange(booking.startTime, booking.endTime)}</td>
                    <td>${charger ? charger.name : 'Unknown'}</td>
                    <td>${booking.carBrand || 'N/A'}</td>
                    <td>${booking.vehicleModel}</td>
                    <td><span class="booking-status ${statusClass}">${booking.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view" onclick="viewBooking('${booking.id}')">View</button>
                            ${booking.status === 'Pending' ?
                                `<button class="action-btn confirm" onclick="updateBookingStatus('${booking.id}', 'Confirmed')">Accept</button>` : ''
                            }
                            ${booking.status === 'Pending' || booking.status === 'Confirmed' ?
                                `<button class="action-btn reject" onclick="updateBookingStatus('${booking.id}', 'Cancelled')">Cancel</button>` : ''
                            }
                            ${booking.status === 'Confirmed' ?
                                `<button class="action-btn complete" onclick="updateBookingStatus('${booking.id}', 'Completed')">Complete</button>` : ''
                            }
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading bookings table:', error);
        const tableBody = document.getElementById('bookingsTable');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="10" style="text-align: center;">Error loading bookings</td></tr>';
        }
    }
}

// Filter bookings
function filterBookings() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    loadBookingsTable(statusFilter, dateFilter);
}

// Clear filters
function clearFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = '';
    loadBookingsTable();
}

// View booking details
function viewBooking(bookingId) {
    try {
        const booking = getBookings().find(b => b.id === bookingId);
        if (!booking) return;

        const modal = document.getElementById('bookingModal');
        const content = document.getElementById('bookingModalContent');
        
        if (modal && content) {
            // Handle both old chargerId and new portId for backward compatibility
            const chargerId = booking.portId || booking.chargerId;
            const charger = getChargers().find(c => c.id === chargerId || c.ports.some(p => p.id === chargerId));
            
            content.innerHTML = `
                <div class="booking-modal-content">
                    <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">${booking.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">${booking.status}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Customer Name:</span>
                        <span class="detail-value">${booking.customerName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Contact Number:</span>
                        <span class="detail-value">${booking.contactNumber}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${booking.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Car Brand:</span>
                        <span class="detail-value">${booking.carBrand || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Vehicle Model:</span>
                        <span class="detail-value">${booking.vehicleModel}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Connector Type:</span>
                        <span class="detail-value">${booking.connectorType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${formatDisplayDate(booking.date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${formatTimeRange(booking.startTime, booking.endTime)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Charger:</span>
                        <span class="detail-value">${charger ? charger.name : 'Unknown'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Booked On:</span>
                        <span class="detail-value">${new Date(booking.createdAt).toLocaleString()}</span>
                    </div>
                    <div style="margin-top: 1.5rem;">
                        <h4>Actions:</h4>
                        <div class="action-buttons">
                            ${booking.status === 'Pending' ?
                                `<button class="action-btn confirm" onclick="updateBookingStatus('${booking.id}', 'Confirmed'); closeBookingModal();">Accept</button>` : ''
                            }
                            ${booking.status === 'Pending' || booking.status === 'Confirmed' ?
                                `<button class="action-btn reject" onclick="updateBookingStatus('${booking.id}', 'Cancelled'); closeBookingModal();">Cancel</button>` : ''
                            }
                            ${booking.status === 'Confirmed' ?
                                `<button class="action-btn complete" onclick="updateBookingStatus('${booking.id}', 'Completed'); closeBookingModal();">Complete</button>` : ''
                            }
                        </div>
                    </div>
                </div>
            `;
            
            modal.classList.add('active');
        }
    } catch (error) {
        console.error('Error viewing booking:', error);
        alert('Error loading booking details. Please try again.');
    }
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Update booking status
function updateBookingStatus(bookingId, newStatus) {
    if (confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
        updateBooking(bookingId, { status: newStatus });
        loadBookingsTable();
        alert(`Booking status updated to ${newStatus}`);
    }
}

// Get status class for styling
function getStatusClass(status) {
    switch (status) {
        case 'Pending':
            return 'status-reserved';
        case 'Confirmed':
            return 'status-available';
        case 'Completed':
            return 'status-charging';
        case 'Cancelled':
            return 'status-offline';
        default:
            return 'status-reserved';
    }
}