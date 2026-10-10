// ChargeWay Booking System JavaScript

// Current booking state
let currentBooking = {
    date: null,
    time: null,
    portId: null,
    machineId: null,
    customerInfo: {}
};

// Current step
let currentStep = 1;

// Initialize booking page
document.addEventListener('DOMContentLoaded', function() {
    initializeBookingPage();
});

function initializeBookingPage() {
    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date();
        dateInput.min = formatDate(today);
    }

    // Load chargers immediately for step 1
    loadAvailableChargers();

    // Initialize progress line
    updateProgressLine(1);

    // Add event listeners to update charger availability when date/time changes
    const dateField = document.getElementById('bookingDate');
    const timeField = document.getElementById('bookingTime');
    const chargerField = document.getElementById('chargerSelection');
    const carBrandField = document.getElementById('carBrand');

    if (dateField) {
        dateField.addEventListener('change', function() {
            console.log('Date changed to:', this.value);
            currentBooking.date = this.value;
            currentBooking.portId = null; // Reset selected port when date changes
            currentBooking.machineId = null;
            const dropdown = document.getElementById('chargerSelection');
            if (dropdown) {
                dropdown.value = '';
            }
            loadAvailableChargers();
        });
    }

    if (timeField) {
        timeField.addEventListener('change', function() {
            console.log('Time changed to:', this.value);
            currentBooking.time = this.value;
            currentBooking.portId = null; // Reset selected port when time changes
            currentBooking.machineId = null;
            const dropdown = document.getElementById('chargerSelection');
            if (dropdown) {
                dropdown.value = '';
            }
            loadAvailableChargers();
        });
    }

    if (chargerField) {
        chargerField.addEventListener('change', function() {
            const selectedValue = this.value;
            if (selectedValue) {
                const [machineId, portId] = selectedValue.split('|');
                currentBooking.machineId = machineId;
                currentBooking.portId = portId;
            } else {
                currentBooking.machineId = null;
                currentBooking.portId = null;
            }
        });
    }

    if (carBrandField) {
        carBrandField.addEventListener('change', function() {
            const otherCarBrandGroup = document.getElementById('otherCarBrandGroup');
            const otherCarBrandInput = document.getElementById('otherCarBrand');

            if (this.value === 'Other') {
                otherCarBrandGroup.style.display = 'block';
                otherCarBrandInput.required = true;
            } else {
                otherCarBrandGroup.style.display = 'none';
                otherCarBrandInput.required = false;
                otherCarBrandInput.value = '';
            }
        });
    }
}

// Navigation between steps
function goToStep(step) {
    // Validate current step before proceeding
    if (step > currentStep) {
        if (!validateCurrentStep()) {
            return;
        }
    }

    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach((el, index) => {
        const stepNumber = index + 1;
        el.classList.remove('active', 'completed');

        if (stepNumber === step) {
            el.classList.add('active');
        } else if (stepNumber < step) {
            el.classList.add('completed');
        }
    });

    // Update progress line gradient
    updateProgressLine(step);

    // Show/hide steps
    document.querySelectorAll('.booking-step').forEach((el, index) => {
        if (index + 1 === step) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Update current step
    currentStep = step;

    // Load data for specific steps
    if (step === 2) {
        loadBookingSummary();
    }
}

// Update progress line gradient based on current step
function updateProgressLine(currentStep) {
    const progress = document.querySelector('.booking-progress');
    if (!progress) return;

    const totalSteps = 2;
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    progress.style.setProperty('--progress-percent', `${progressPercentage}%`);
}

// Validate current step
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            // Validate all booking details
            return validateDateAndTime() && validateCustomerInfo();
        default:
            return true;
    }
}

// Validate date and time selection
function validateDateAndTime() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;

    if (!date) {
        alert('Please select a date.');
        return false;
    }

    if (!time) {
        alert('Please select a time slot.');
        return false;
    }

    // Check if date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert('Cannot select past dates.');
        return false;
    }

    // Save to current booking
    currentBooking.date = date;
    currentBooking.time = time;

    return true;
}

// Validate customer information
function validateCustomerInfo() {
    const name = document.getElementById('customerName').value.trim();
    const contact = document.getElementById('contactNumber').value.trim();
    const email = document.getElementById('email').value.trim();
    const carBrand = document.getElementById('carBrand').value;
    const otherCarBrand = document.getElementById('otherCarBrand').value.trim();

    if (!name) {
        alert('Please enter your full name.');
        return false;
    }

    if (!contact) {
        alert('Please enter your contact number.');
        return false;
    }

    if (!/^\d{11}$/.test(contact)) {
        alert('Please enter a valid 11-digit contact number.');
        return false;
    }

    if (!email) {
        alert('Please enter your email address.');
        return false;
    }

    if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (!carBrand) {
        alert('Please select your car brand.');
        return false;
    }

    if (carBrand === 'Other' && !otherCarBrand) {
        alert('Please specify your car brand.');
        return false;
    }

    if (!currentBooking.portId) {
        alert('Please select a charging port.');
        return false;
    }

    // Save customer info
    currentBooking.customerInfo = {
        name: name,
        contactNumber: contact,
        email: email,
        carBrand: carBrand === 'Other' ? otherCarBrand : carBrand
    };

    return true;
}



// Get next hour
function getNextHour(timeString) {
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours) + 1;
    if (hour >= 24) hour = 0;
    return `${String(hour).padStart(2, '0')}:${minutes}`;
}

// Load available chargers
function loadAvailableChargers() {
    const dropdown = document.getElementById('chargerSelection');
    if (!dropdown) return;

    try {
        const chargers = getChargers();
        const availablePorts = getAvailablePorts(currentBooking.date, currentBooking.time);

        console.log('Loading chargers for date:', currentBooking.date, 'time:', currentBooking.time);
        console.log('Available ports:', availablePorts);

        // Save current selection
        const currentValue = dropdown.value;

        // Clear existing options except the default
        dropdown.innerHTML = '<option value="">-- Select machine and port --</option>';

        if (chargers && chargers.length > 0) {
            // Add options for each available port
            chargers.forEach(machine => {
                machine.ports.forEach(port => {
                    const isAvailable = availablePorts.some(p => p.id === port.id);
                    console.log(`Port ${port.id} availability:`, isAvailable);
                    if (isAvailable) {
                        const option = document.createElement('option');
                        option.value = `${machine.id}|${port.id}`;
                        option.textContent = `${machine.name} - ${port.name} (${port.type})`;
                        dropdown.appendChild(option);
                    }
                });
            });

            // Restore selection if still available
            if (currentValue && dropdown.querySelector(`option[value="${currentValue}"]`)) {
                dropdown.value = currentValue;
            }

            // If no available ports
            if (dropdown.options.length === 1) {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "No available ports for selected date/time";
                option.disabled = true;
                dropdown.appendChild(option);
            }
        } else {
            // Fallback to hardcoded data if localStorage fails
            console.log('Using fallback data');
            addFallbackChargerOptions(dropdown);
        }
    } catch (error) {
        console.error('Error loading chargers:', error);
        // Fallback to hardcoded data
        addFallbackChargerOptions(dropdown);
    }
}

// Fallback charger options for when localStorage fails
function addFallbackChargerOptions(dropdown) {
    const fallbackChargers = [
        {
            id: 'machine-1',
            name: 'Machine 1',
            ports: [
                { id: 'machine-1-port-1', name: 'BYD Port', type: 'Type 2 / CCS2' },
                { id: 'machine-1-port-2', name: 'Tesla Port', type: 'NACS / TP301' },
                { id: 'machine-1-port-3', name: 'VinFast Port', type: 'CCS1 / NACS' },
                { id: 'machine-1-port-4', name: 'Jetour Port', type: 'GB/T' }
            ]
        },
        {
            id: 'machine-2',
            name: 'Machine 2',
            ports: [
                { id: 'machine-2-port-1', name: 'BYD Port', type: 'Type 2 / CCS2' },
                { id: 'machine-2-port-2', name: 'Tesla Port', type: 'NACS / TP301' },
                { id: 'machine-2-port-3', name: 'VinFast Port', type: 'CCS1 / NACS' },
                { id: 'machine-2-port-4', name: 'Jetour Port', type: 'GB/T' }
            ]
        },
        {
            id: 'machine-3',
            name: 'Machine 3',
            ports: [
                { id: 'machine-3-port-1', name: 'BYD Port', type: 'Type 2 / CCS2' },
                { id: 'machine-3-port-2', name: 'Tesla Port', type: 'NACS / TP301' },
                { id: 'machine-3-port-3', name: 'VinFast Port', type: 'CCS1 / NACS' },
                { id: 'machine-3-port-4', name: 'Jetour Port', type: 'GB/T' }
            ]
        },
        {
            id: 'machine-4',
            name: 'Machine 4',
            ports: [
                { id: 'machine-4-port-1', name: 'BYD Port', type: 'Type 2 / CCS2' },
                { id: 'machine-4-port-2', name: 'Tesla Port', type: 'NACS / TP301' },
                { id: 'machine-4-port-3', name: 'VinFast Port', type: 'CCS1 / NACS' },
                { id: 'machine-4-port-4', name: 'Jetour Port', type: 'GB/T' }
            ]
        }
    ];

    // Get available ports even in fallback mode
    const availablePorts = getAvailablePorts(currentBooking.date, currentBooking.time);

    fallbackChargers.forEach(machine => {
        machine.ports.forEach(port => {
            const isAvailable = availablePorts.some(p => p.id === port.id);
            if (isAvailable) {
                const option = document.createElement('option');
                option.value = `${machine.id}|${port.id}`;
                option.textContent = `${machine.name} - ${port.name} (${port.type})`;
                dropdown.appendChild(option);
            }
        });
    });
}

// Load booking summary
function loadBookingSummary() {
    const summary = document.getElementById('bookingSummary');
    if (!summary) return;

    const chargers = getChargers();
    const machine = chargers.find(c => c.id === currentBooking.machineId);
    const port = machine ? machine.ports.find(p => p.id === currentBooking.portId) : null;
    const endTime = getNextHour(currentBooking.time);

    summary.innerHTML = `
        <h3>BOOKING SUMMARY</h3>
        <div class="summary-item">
            <span class="summary-label">Booking Date:</span>
            <span class="summary-value">${formatDisplayDate(currentBooking.date)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Time:</span>
            <span class="summary-value">${formatTimeRange(currentBooking.time, endTime)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Machine:</span>
            <span class="summary-value">${machine ? machine.name : 'N/A'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Port:</span>
            <span class="summary-value">${port ? port.name : 'N/A'} (${port ? port.type : 'N/A'})</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Customer:</span>
            <span class="summary-value">${currentBooking.customerInfo.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Contact:</span>
            <span class="summary-value">${currentBooking.customerInfo.contactNumber}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Email:</span>
            <span class="summary-value">${currentBooking.customerInfo.email}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Car Brand:</span>
            <span class="summary-value">${currentBooking.customerInfo.carBrand}</span>
        </div>
    `;
}

// Confirm booking
function confirmBooking() {
    // Double-check availability before final confirmation
    if (!checkAvailability(currentBooking.date, currentBooking.time, currentBooking.portId)) {
        alert('This port is no longer available for the selected time slot. Please select a different port or time.');
        goToStep(1);
        return;
    }

    // Generate booking ID
    const bookingId = generateBookingId(currentBooking.date);

    // Create booking object
    const booking = {
        id: bookingId,
        customerName: currentBooking.customerInfo.name,
        contactNumber: currentBooking.customerInfo.contactNumber,
        email: currentBooking.customerInfo.email,
        carBrand: currentBooking.customerInfo.carBrand,
        date: currentBooking.date,
        startTime: currentBooking.time,
        endTime: getNextHour(currentBooking.time),
        machineId: currentBooking.machineId,
        portId: currentBooking.portId,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    // Save booking and check for duplicates
    const saveResult = saveBooking(booking);

    if (!saveResult) {
        alert('This time slot has already been booked. Please select a different time or port.');
        loadAvailableChargers(); // Refresh the dropdown to show updated availability
        goToStep(1);
        return;
    }

    // Show confirmation modal
    showConfirmationModal(booking);
}

// Show confirmation modal
function showConfirmationModal(booking) {
    const modal = document.getElementById('confirmationModal');
    const details = document.getElementById('confirmationDetails');
    
    if (modal && details) {
        const chargers = getChargers();
        const machine = chargers.find(c => c.id === booking.machineId);
        const port = machine ? machine.ports.find(p => p.id === booking.portId) : null;
        
        details.innerHTML = `
            <div class="confirmation-item">
                <span class="summary-label">Booking ID:</span>
                <span class="summary-value">${booking.id}</span>
            </div>
            <div class="confirmation-item">
                <span class="summary-label">Status:</span>
                <span class="summary-value">${booking.status}</span>
            </div>
            <div class="confirmation-item">
                <span class="summary-label">Customer Name:</span>
                <span class="summary-value">${booking.customerName}</span>
            </div>
            <div class="confirmation-item">
                <span class="summary-label">Date:</span>
                <span class="summary-value">${formatDisplayDate(booking.date)}</span>
            </div>
            <div class="confirmation-item">
                <span class="summary-label">Time:</span>
                <span class="summary-value">${formatTimeRange(booking.startTime, booking.endTime)}</span>
            </div>
            <div class="confirmation-item">
                <span class="summary-label">Machine:</span>
                <span class="summary-value">${machine ? machine.name : 'N/A'}</span>
            </div>
            <div class="confirmation-item">
                <span class="summary-label">Port:</span>
                <span class="summary-value">${port ? port.name : 'N/A'} (${port ? port.type : 'N/A'})</span>
            </div>
            <div class="confirmation-item">
                <span class="summary-label">Car Brand:</span>
                <span class="summary-value">${booking.carBrand}</span>
            </div>
        `;
        
        modal.classList.add('active');
    }
}