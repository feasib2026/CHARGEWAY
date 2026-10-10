// ChargeWay Admin Chargers Management JavaScript

// Initialize admin chargers page
document.addEventListener('DOMContentLoaded', function() {
    requireAdminAuth();
    loadAdminChargers();
});

// Load admin chargers grid
function loadAdminChargers() {
    const grid = document.getElementById('adminChargersGrid');
    if (!grid) return;

    try {
        const chargers = getChargers();
        
        if (chargers && chargers.length > 0) {
            // Load from localStorage
            grid.innerHTML = chargers.map(machine => `
                <div class="admin-charger-card">
                    <h3>${machine.name}</h3>
                    <p><strong>Type:</strong> ${machine.type}</p>
                    <p><strong>Overall Status:</strong> <span class="station-status status-${machine.status.toLowerCase()}">${machine.status}</span></p>
                    
                    <h4>Charging Ports</h4>
                    <div class="admin-ports-grid">
                        ${machine.ports.map(port => `
                            <div class="admin-port-card">
                                <h5>${port.name}</h5>
                                <p><strong>Type:</strong> ${port.type}</p>
                                <p><strong>Status:</strong> <span class="station-status status-${port.status.toLowerCase()}">${port.status}</span></p>
                                
                                <div class="port-status-select">
                                    <label for="port-status-${port.id}">Change Status:</label>
                                    <select id="port-status-${port.id}" class="form-control" onchange="updatePortStatus('${machine.id}', '${port.id}', this.value)">
                                        <option value="Available" ${port.status === 'Available' ? 'selected' : ''}>Available</option>
                                        <option value="Reserved" ${port.status === 'Reserved' ? 'selected' : ''}>Reserved</option>
                                        <option value="Charging" ${port.status === 'Charging' ? 'selected' : ''}>Charging</option>
                                        <option value="Maintenance" ${port.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                                        <option value="Offline" ${port.status === 'Offline' ? 'selected' : ''}>Offline</option>
                                    </select>
                                </div>
                                
                                <div class="port-actions">
                                    <button class="btn btn-primary" onclick="setPortAvailable('${machine.id}', '${port.id}')">Set Available</button>
                                    <button class="btn btn-danger" onclick="setPortMaintenance('${machine.id}', '${port.id}')">Set Maintenance</button>
                                    <button class="btn btn-secondary" onclick="setPortOffline('${machine.id}', '${port.id}')">Set Offline</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        } else {
            // Fallback to hardcoded data
            console.log('Using fallback data for admin chargers');
            grid.innerHTML = getFallbackAdminChargersHTML();
        }
    } catch (error) {
        console.error('Error loading admin chargers:', error);
        // Fallback to hardcoded data
        grid.innerHTML = getFallbackAdminChargersHTML();
    }
}

// Fallback admin chargers HTML for when localStorage fails
function getFallbackAdminChargersHTML() {
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

    return fallbackChargers.map(machine => `
        <div class="admin-charger-card">
            <h3>${machine.name}</h3>
            <p><strong>Type:</strong> ${machine.type}</p>
            <p><strong>Overall Status:</strong> <span class="station-status status-${machine.status.toLowerCase()}">${machine.status}</span></p>
            
            <h4>Charging Ports</h4>
            <div class="admin-ports-grid">
                ${machine.ports.map(port => `
                    <div class="admin-port-card">
                        <h5>${port.name}</h5>
                        <p><strong>Type:</strong> ${port.type}</p>
                        <p><strong>Status:</strong> <span class="station-status status-${port.status.toLowerCase()}">${port.status}</span></p>
                        
                        <div class="port-status-select">
                            <label for="port-status-${port.id}">Change Status:</label>
                            <select id="port-status-${port.id}" class="form-control" onchange="updatePortStatus('${machine.id}', '${port.id}', this.value)">
                                <option value="Available" ${port.status === 'Available' ? 'selected' : ''}>Available</option>
                                <option value="Reserved" ${port.status === 'Reserved' ? 'selected' : ''}>Reserved</option>
                                <option value="Charging" ${port.status === 'Charging' ? 'selected' : ''}>Charging</option>
                                <option value="Maintenance" ${port.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                                <option value="Offline" ${port.status === 'Offline' ? 'selected' : ''}>Offline</option>
                            </select>
                        </div>
                        
                        <div class="port-actions">
                            <button class="btn btn-primary" onclick="setPortAvailable('${machine.id}', '${port.id}')">Set Available</button>
                            <button class="btn btn-danger" onclick="setPortMaintenance('${machine.id}', '${port.id}')">Set Maintenance</button>
                            <button class="btn btn-secondary" onclick="setPortOffline('${machine.id}', '${port.id}')">Set Offline</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Update port status
function updatePortStatus(machineId, portId, newStatus) {
    if (confirm(`Are you sure you want to set ${portId} to ${newStatus}?`)) {
        // Update localStorage
        updatePort(machineId, portId, { status: newStatus });
        
        // Update admin UI
        loadAdminChargers();
        
        // Update charging station page static HTML
        updateStationPagePortStatus(portId, newStatus);
        
        alert(`Port status updated to ${newStatus}`);
    }
}

// Update port status in charging station page static HTML
function updateStationPagePortStatus(portId, newStatus) {
    try {
        // This function will be called when admin changes status
        // The charging station page will read from localStorage on load
        console.log('Port status updated:', portId, newStatus);
    } catch (error) {
        console.error('Error updating station page port status:', error);
    }
}

// Set port to available
function setPortAvailable(machineId, portId) {
    updatePortStatus(machineId, portId, 'Available');
}

// Set port to maintenance
function setPortMaintenance(machineId, portId) {
    updatePortStatus(machineId, portId, 'Maintenance');
}

// Set port to offline
function setPortOffline(machineId, portId) {
    updatePortStatus(machineId, portId, 'Offline');
}