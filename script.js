// ChargeWay Main JavaScript - Navigation and Common Functions

// Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Initialize sample data if not exists
    initializeSampleData();
});

// Admin Sidebar Toggle - Shared function for all admin pages
function toggleAdminSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Admin Authentication Functions
// Demo credentials
const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Check if admin is logged in
function checkAdminAuth() {
    const session = JSON.parse(localStorage.getItem('chargeway_admin_session') || 'null');
    return session !== null;
}

// Redirect to login if not authenticated
function requireAdminAuth() {
    if (!checkAdminAuth()) {
        window.location.href = 'admin-login.html';
    }
}

// Admin logout
function logout() {
    localStorage.removeItem('chargeway_admin_session');
    window.location.href = 'admin-login.html';
}

// Close admin sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.admin-sidebar');
    const toggle = document.querySelector('.sidebar-toggle');
    const close = document.querySelector('.sidebar-close');
    
    if (window.innerWidth <= 768 && sidebar) {
        if (!sidebar.contains(event.target) && 
            !toggle.contains(event.target) && 
            !close.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Close admin sidebar when clicking a link
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.admin-sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    if (window.innerWidth <= 768 && sidebar) {
        sidebarLinks.forEach(link => {
            if (link.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
});

// LocalStorage Keys
const STORAGE_KEYS = {
    BOOKINGS: 'chargeway_bookings',
    CHARGERS: 'chargeway_chargers',
    CUSTOMERS: 'chargeway_customers',
    ADMIN: 'chargeway_admin',
    SETTINGS: 'chargeway_settings',
    CONTACT_MESSAGES: 'chargeway_contact_messages'
};

// Initialize Sample Data
function initializeSampleData() {
    console.log('Initializing sample data...');
    
    // Initialize chargers if not exists or if corrupted
    let chargers = [];
    try {
        chargers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARGERS) || '[]');
        console.log('Loaded chargers from localStorage:', chargers);
    } catch (e) {
        console.error('Error parsing chargers from localStorage:', e);
        chargers = [];
    }
    
    // Only reinitialize if chargers array is empty or corrupted
    if (!Array.isArray(chargers) || chargers.length === 0) {
        console.log('Reinitializing chargers data...');
        chargers = [
            { 
                id: 'machine-1', 
                name: 'Machine 1', 
                type: 'Charging Machine', 
                status: 'Available',
                ports: [
                    { id: 'machine-1-port-1', name: 'BYD Port', type: 'Type 2 / CCS2', status: 'Available' },
                    { id: 'machine-1-port-2', name: 'Tesla Port', type: 'NACS / TP301', status: 'Available' },
                    { id: 'machine-1-port-3', name: 'VinFast Port', type: 'CCS1 / NACS', status: 'Available' },
                    { id: 'machine-1-port-4', name: 'Jetour Port', type: 'GB/T', status: 'Available' }
                ]
            },
            { 
                id: 'machine-2', 
                name: 'Machine 2', 
                type: 'Charging Machine', 
                status: 'Available',
                ports: [
                    { id: 'machine-2-port-1', name: 'BYD Port', type: 'Type 2 / CCS2', status: 'Available' },
                    { id: 'machine-2-port-2', name: 'Tesla Port', type: 'NACS / TP301', status: 'Available' },
                    { id: 'machine-2-port-3', name: 'VinFast Port', type: 'CCS1 / NACS', status: 'Available' },
                    { id: 'machine-2-port-4', name: 'Jetour Port', type: 'GB/T', status: 'Available' }
                ]
            },
            { 
                id: 'machine-3', 
                name: 'Machine 3', 
                type: 'Charging Machine', 
                status: 'Available',
                ports: [
                    { id: 'machine-3-port-1', name: 'BYD Port', type: 'Type 2 / CCS2', status: 'Available' },
                    { id: 'machine-3-port-2', name: 'Tesla Port', type: 'NACS / TP301', status: 'Available' },
                    { id: 'machine-3-port-3', name: 'VinFast Port', type: 'CCS1 / NACS', status: 'Available' },
                    { id: 'machine-3-port-4', name: 'Jetour Port', type: 'GB/T', status: 'Available' }
                ]
            },
            { 
                id: 'machine-4', 
                name: 'Machine 4', 
                type: 'Charging Machine', 
                status: 'Available',
                ports: [
                    { id: 'machine-4-port-1', name: 'BYD Port', type: 'Type 2 / CCS2', status: 'Available' },
                    { id: 'machine-4-port-2', name: 'Tesla Port', type: 'NACS / TP301', status: 'Available' },
                    { id: 'machine-4-port-3', name: 'VinFast Port', type: 'CCS1 / NACS', status: 'Available' },
                    { id: 'machine-4-port-4', name: 'Jetour Port', type: 'GB/T', status: 'Available' }
                ]
            }
        ];
        try {
            localStorage.setItem(STORAGE_KEYS.CHARGERS, JSON.stringify(chargers));
            console.log('Chargers data saved to localStorage');
        } catch (e) {
            console.error('Error saving chargers to localStorage:', e);
        }
    } else {
        console.log('Using existing chargers data from localStorage');
    }

    // Initialize empty bookings array if not exists
    let bookings = [];
    try {
        bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    } catch (e) {
        console.error('Error parsing bookings from localStorage:', e);
        bookings = [];
    }
    
    if (!Array.isArray(bookings)) {
        try {
            localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
            console.log('Bookings data initialized');
        } catch (e) {
            console.error('Error saving bookings to localStorage:', e);
        }
    }

    // Initialize contact messages if not exists
    let messages = [];
    try {
        messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES) || '[]');
    } catch (e) {
        console.error('Error parsing messages from localStorage:', e);
        messages = [];
    }
    
    if (!Array.isArray(messages)) {
        try {
            localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify([]));
            console.log('Contact messages data initialized');
        } catch (e) {
            console.error('Error saving messages to localStorage:', e);
        }
    }
    
    console.log('Sample data initialization complete');
}

// Utility Functions
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatTimeRange(startTime, endTime) {
    return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}

// LocalStorage Functions
function getBookings() {
    let bookings = [];
    try {
        bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    } catch (e) {
        bookings = [];
    }
    
    if (!Array.isArray(bookings)) {
        bookings = [];
    }
    
    return bookings;
}

function saveBooking(booking) {
    const bookings = getBookings();

    console.log('Attempting to save booking:', booking);
    console.log('Current bookings in storage:', bookings);

    // Check for duplicate booking (same date, time, and port)
    const duplicateBooking = bookings.find(b =>
        b.date === booking.date &&
        b.startTime === booking.startTime &&
        b.portId === booking.portId &&
        b.status !== 'Cancelled'
    );

    if (duplicateBooking) {
        console.error('Duplicate booking detected:', duplicateBooking);
        console.error('New booking:', booking);
        return false; // Return false to indicate failure
    }

    bookings.push(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    console.log('Booking saved successfully');
    return true; // Return true to indicate success
}

function updateBooking(bookingId, updates) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
        bookings[index] = { ...bookings[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    }
}

function deleteBooking(bookingId) {
    const bookings = getBookings();
    const filtered = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(filtered));
}

function getChargers() {
    let chargers = [];
    try {
        chargers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARGERS) || '[]');
    } catch (e) {
        console.error('Error parsing chargers from localStorage:', e);
        chargers = [];
    }
    
    // If chargers is empty or corrupted, reinitialize
    if (!Array.isArray(chargers) || chargers.length === 0) {
        console.log('Chargers data missing, reinitializing...');
        initializeSampleData();
        chargers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARGERS) || '[]');
    }
    
    return chargers;
}

function updateCharger(chargerId, updates) {
    const chargers = getChargers();
    const index = chargers.findIndex(c => c.id === chargerId);
    if (index !== -1) {
        chargers[index] = { ...chargers[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.CHARGERS, JSON.stringify(chargers));
    }
}

function updatePort(machineId, portId, updates) {
    const chargers = getChargers();
    const machineIndex = chargers.findIndex(c => c.id === machineId);
    if (machineIndex !== -1) {
        const portIndex = chargers[machineIndex].ports.findIndex(p => p.id === portId);
        if (portIndex !== -1) {
            chargers[machineIndex].ports[portIndex] = { ...chargers[machineIndex].ports[portIndex], ...updates };
            localStorage.setItem(STORAGE_KEYS.CHARGERS, JSON.stringify(chargers));
        }
    }
}

function getPort(machineId, portId) {
    const chargers = getChargers();
    const machine = chargers.find(c => c.id === machineId);
    if (machine) {
        return machine.ports.find(p => p.id === portId);
    }
    return null;
}

// Check availability for booking
function checkAvailability(date, time, portId) {
    const bookings = getBookings();
    
    // Extract machine ID from port ID
    const machineId = portId.split('-port-')[0];
    const machine = getChargers().find(c => c.id === machineId);
    
    if (!machine) return false;
    
    // Find the port
    const port = machine.ports.find(p => p.id === portId);
    if (!port) return false;
    
    // Check if port is available for booking
    if (port.status === 'Maintenance' || port.status === 'Offline') {
        return false;
    }
    
    // Check for existing bookings on this port
    const existingBooking = bookings.find(b => 
        b.date === date && 
        b.startTime === time && 
        b.portId === portId &&
        b.status !== 'Cancelled'
    );
    
    return !existingBooking;
}

// Get available ports for a specific date and time
function getAvailablePorts(date, time) {
    const chargers = getChargers();
    const bookings = getBookings();
    const availablePorts = [];

    console.log('getAvailablePorts called with date:', date, 'time:', time);
    console.log('Total bookings:', bookings.length);

    chargers.forEach(machine => {
        machine.ports.forEach(port => {
            // Check port status
            if (port.status === 'Maintenance' || port.status === 'Offline') {
                return;
            }

            // Check for existing bookings on this port
            const existingBooking = bookings.find(b =>
                b.date === date &&
                b.startTime === time &&
                b.portId === port.id &&
                b.status !== 'Cancelled'
            );

            if (existingBooking) {
                console.log(`Port ${port.id} is booked for ${date} at ${time}`);
            }

            if (!existingBooking) {
                availablePorts.push({
                    ...port,
                    machineId: machine.id,
                    machineName: machine.name
                });
            }
        });
    });

    console.log('Available ports count:', availablePorts.length);
    return availablePorts;
}

// Generate unique booking ID
function generateBookingId(date) {
    const bookings = getBookings();
    const dateStr = date.replace(/-/g, '');
    const count = bookings.filter(b => b.date === date).length + 1;
    const countStr = String(count).padStart(3, '0');
    return `CW-${dateStr}-${countStr}`;
}

// Load stations on stations page
function loadStations() {
    const stationsGrid = document.getElementById('stationsGrid');
    if (!stationsGrid) return;

    try {
        const chargers = getChargers();
        
        if (chargers && chargers.length > 0) {
            stationsGrid.innerHTML = chargers.map(machine => {
                const availablePorts = machine.ports.filter(p => p.status === 'Available').length;
                const totalPorts = machine.ports.length;
                
                return `
                <div class="station-card">
                    <h3>${machine.name}</h3>
                    <p class="station-type">${machine.type}</p>
                    <p class="station-ports">${availablePorts}/${totalPorts} Ports Available</p>
                    <div class="ports-list">
                        ${machine.ports.map(port => `
                            <div class="port-item">
                                <span class="port-name">${port.name}</span>
                                <span class="port-type">${port.type}</span>
                                <span class="station-status status-${port.status.toLowerCase()}">${port.status}</span>
                            </div>
                        `).join('')}
                    </div>
                    ${availablePorts > 0 ? 
                        `<a href="booking.html" class="btn btn-primary">Book Now</a>` : 
                        `<button class="btn btn-secondary" disabled>No Available Ports</button>`
                    }
                </div>
                `;
            }).join('');
        } else {
            // Fallback to hardcoded data
            console.log('Using fallback data for stations');
            stationsGrid.innerHTML = getFallbackStationsHTML();
        }
    } catch (error) {
        console.error('Error loading stations:', error);
        // Fallback to hardcoded data
        stationsGrid.innerHTML = getFallbackStationsHTML();
    }
}

// Fallback stations HTML for when localStorage fails
function getFallbackStationsHTML() {
    const fallbackChargers = [
        { 
            id: 'machine-1', 
            name: 'Machine 1', 
            type: 'Charging Machine', 
            status: 'Available',
            ports: [
                { id: 'machine-1-port-1', name: 'BYD Port', type: 'Type 2 / CCS2', status: 'Available' },
                { id: 'machine-1-port-2', name: 'Tesla Port', type: 'NACS / TP301', status: 'Available' },
                { id: 'machine-1-port-3', name: 'VinFast Port', type: 'CCS1 / NACS', status: 'Available' },
                { id: 'machine-1-port-4', name: 'Jetour Port', type: 'GB/T', status: 'Available' }
            ]
        },
        { 
            id: 'machine-2', 
            name: 'Machine 2', 
            type: 'Charging Machine', 
            status: 'Available',
            ports: [
                { id: 'machine-2-port-1', name: 'BYD Port', type: 'Type 2 / CCS2', status: 'Available' },
                { id: 'machine-2-port-2', name: 'Tesla Port', type: 'NACS / TP301', status: 'Available' },
                { id: 'machine-2-port-3', name: 'VinFast Port', type: 'CCS1 / NACS', status: 'Available' },
                { id: 'machine-2-port-4', name: 'Jetour Port', type: 'GB/T', status: 'Available' }
            ]
        },
        { 
            id: 'machine-3', 
            name: 'Machine 3', 
            type: 'Charging Machine', 
            status: 'Available',
            ports: [
                { id: 'machine-3-port-1', name: 'BYD Port', type: 'Type 2 / CCS2', status: 'Available' },
                { id: 'machine-3-port-2', name: 'Tesla Port', type: 'NACS / TP301', status: 'Available' },
                { id: 'machine-3-port-3', name: 'VinFast Port', type: 'CCS1 / NACS', status: 'Available' },
                { id: 'machine-3-port-4', name: 'Jetour Port', type: 'GB/T', status: 'Available' }
            ]
        },
        { 
            id: 'machine-4', 
            name: 'Machine 4', 
            type: 'Charging Machine', 
            status: 'Available',
            ports: [
                { id: 'machine-4-port-1', name: 'BYD Port', type: 'Type 2 / CCS2', status: 'Available' },
                { id: 'machine-4-port-2', name: 'Tesla Port', type: 'NACS / TP301', status: 'Available' },
                { id: 'machine-4-port-3', name: 'VinFast Port', type: 'CCS1 / NACS', status: 'Available' },
                { id: 'machine-4-port-4', name: 'Jetour Port', type: 'GB/T', status: 'Available' }
            ]
        }
    ];

    return fallbackChargers.map(machine => {
        const availablePorts = machine.ports.filter(p => p.status === 'Available').length;
        const totalPorts = machine.ports.length;
        
        return `
        <div class="station-card">
            <h3>${machine.name}</h3>
            <p class="station-type">${machine.type}</p>
            <p class="station-ports">${availablePorts}/${totalPorts} Ports Available</p>
            <div class="ports-list">
                ${machine.ports.map(port => `
                    <div class="port-item">
                        <span class="port-name">${port.name}</span>
                        <span class="port-type">${port.type}</span>
                        <span class="station-status status-${port.status.toLowerCase()}">${port.status}</span>
                    </div>
                `).join('')}
            </div>
            <a href="booking.html" class="btn btn-primary">Book Now</a>
        </div>
        `;
    }).join('');
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Print confirmation function
function printConfirmation() {
    window.print();
}

// Logout function
function logout() {
    localStorage.removeItem('chargeway_admin_session');
    window.location.href = 'admin-login.html';
}

// Reset demo data function
function resetDemoData() {
    if (confirm('Are you sure you want to reset all demo data? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
        localStorage.removeItem(STORAGE_KEYS.CHARGERS);
        localStorage.removeItem(STORAGE_KEYS.CONTACT_MESSAGES);
        localStorage.removeItem('chargeway_admin_session');
        
        // Reinitialize
        initializeSampleData();
        
        alert('Demo data has been reset successfully!');
        window.location.reload();
    }
}