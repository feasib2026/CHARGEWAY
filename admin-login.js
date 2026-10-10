// ChargeWay Admin Login JavaScript

// Handle admin login
function handleAdminLogin(event) {
    event.preventDefault();
    
    try {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const errorDiv = document.getElementById('loginError');
        
        // Validate credentials
        if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
            // Set admin session
            localStorage.setItem('chargeway_admin_session', JSON.stringify({
                username: username,
                loginTime: new Date().toISOString()
            }));
            
            // Redirect to dashboard
            window.location.href = 'admin-dashboard.html';
        } else {
            // Show error
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Invalid username or password. Please try again.';
        }
    } catch (error) {
        console.error('Error during login:', error);
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'An error occurred during login. Please try again.';
        }
    }
}