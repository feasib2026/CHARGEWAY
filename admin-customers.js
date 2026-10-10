// ChargeWay Admin Customers JavaScript

// Initialize admin customers page
document.addEventListener('DOMContentLoaded', function() {
    requireAdminAuth();
    loadCustomersTable();
});

// Load customers table
function loadCustomersTable() {
    const tableBody = document.getElementById('customersTable');
    if (!tableBody) return;

    const bookings = getBookings();
    
    // Group bookings by customer email to get unique customers
    const customerMap = new Map();
    
    bookings.forEach(booking => {
        const email = booking.email;
        if (!customerMap.has(email)) {
            customerMap.set(email, {
                name: booking.customerName,
                contact: booking.contactNumber,
                email: email,
                carBrand: booking.carBrand || 'N/A',
                vehicle: booking.vehicleModel,
                bookings: [],
                lastBooking: booking.createdAt
            });
        }
        customerMap.get(email).bookings.push(booking);
        // Update last booking if this one is newer
        if (new Date(booking.createdAt) > new Date(customerMap.get(email).lastBooking)) {
            customerMap.get(email).lastBooking = booking.createdAt;
        }
    });
    
    const customers = Array.from(customerMap.values());
    
    if (customers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No customers yet</td></tr>';
        return;
    }

    tableBody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.contact}</td>
            <td>${customer.email}</td>
            <td>${customer.carBrand}</td>
            <td>${customer.vehicle}</td>
            <td>${customer.bookings.length}</td>
            <td>${new Date(customer.lastBooking).toLocaleDateString()}</td>
        </tr>
    `).join('');
}