// ChargeWay Admin Schedule JavaScript

// Initialize admin schedule page
document.addEventListener('DOMContentLoaded', function() {
    requireAdminAuth();
    
    // Set default date to today
    const dateInput = document.getElementById('scheduleDate');
    if (dateInput) {
        const today = new Date();
        dateInput.value = formatDate(today);
    }
    
    loadSchedule();
});

// Load schedule for selected date
function loadSchedule() {
    const dateInput = document.getElementById('scheduleDate');
    const container = document.getElementById('scheduleContainer');
    
    if (!dateInput || !container) return;
    
    const selectedDate = dateInput.value;
    const chargers = getChargers();
    const bookings = getBookings();
    
    // Time slots
    const timeSlots = [
        '10:00', '11:00', '12:00', '13:00', '14:00', 
        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
    ];
    
    // Build schedule HTML
    let scheduleHTML = `
        <div class="schedule-header">
            <div class="schedule-cell">Time</div>
            ${chargers.map(charger => `
                <div class="schedule-cell">${charger.name}</div>
            `).join('')}
        </div>
    `;
    
    timeSlots.forEach(time => {
        const endTime = getNextHour(time);
        
        scheduleHTML += `
            <div class="schedule-row">
                <div class="schedule-time">${formatTimeRange(time, endTime)}</div>
                ${chargers.map(charger => {
                    // Check for booking
                    const booking = bookings.find(b => 
                        b.date === selectedDate && 
                        b.startTime === time && 
                        b.chargerId === charger.id &&
                        b.status !== 'Cancelled'
                    );
                    
                    let cellClass = 'available';
                    let cellContent = 'Available';
                    
                    if (booking) {
                        cellClass = 'booked';
                        cellContent = `${booking.customerName}<br><small>${booking.status}</small>`;
                    } else if (charger.status === 'Maintenance') {
                        cellClass = 'maintenance';
                        cellContent = 'Maintenance';
                    } else if (charger.status === 'Offline') {
                        cellClass = 'offline';
                        cellContent = 'Offline';
                    }
                    
                    return `
                        <div class="schedule-cell ${cellClass}">
                            ${cellContent}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    });
    
    container.innerHTML = scheduleHTML;
}

// Go to today
function goToToday() {
    const dateInput = document.getElementById('scheduleDate');
    if (dateInput) {
        const today = new Date();
        dateInput.value = formatDate(today);
        loadSchedule();
    }
}

// Go to tomorrow
function goToTomorrow() {
    const dateInput = document.getElementById('scheduleDate');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = formatDate(tomorrow);
        loadSchedule();
    }
}

// Get next hour
function getNextHour(timeString) {
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours) + 1;
    if (hour >= 24) hour = 0;
    return `${String(hour).padStart(2, '0')}:${minutes}`;
}