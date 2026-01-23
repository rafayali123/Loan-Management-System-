// Login Page JavaScript

const API_BASE = '/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
    setupLoginForm();
    setupRememberMe();
});

// Check if already logged in
function checkExistingSession() {
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');
    
    if (userId && userType) {
        if (userType === 'ADMIN') {
            window.location.href = '/pages/dashboard.html';
        } else if (userType === 'CUSTOMER') {
            window.location.href = '/pages/customer-dashboard.html';
        }
    }
}

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        // Validate inputs
        if (!username || !password) {
            showError(errorDiv, 'Please enter both username and password');
            return;
        }
        
        try {
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Logging in...';
            
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store user data in session
                sessionStorage.setItem('userId', data.userId);
                sessionStorage.setItem('userName', data.fullName);
                sessionStorage.setItem('userEmail', data.email);
                sessionStorage.setItem('userUsername', data.username);
                sessionStorage.setItem('userType', data.userType);
                
                // Show success and redirect based on user type
                hideError(errorDiv);
                setTimeout(() => {
                    if (data.userType === 'ADMIN') {
                        window.location.href = '/pages/dashboard.html';
                    } else if (data.userType === 'CUSTOMER') {
                        window.location.href = '/pages/customer-dashboard.html';
                    }
                }, 500);
            } else {
                const errorMsg = data.message || data.error || 'Login failed. Please try again.';
                showError(errorDiv, errorMsg);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Login';
            }
        } catch (error) {
            console.error('Login error:', error);
            showError(errorDiv, 'Network error. Please check your connection and try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Login';
        }
    });
}

// Setup remember me functionality
function setupRememberMe() {
    const rememberCheckbox = document.getElementById('remember');
    const usernameInput = document.getElementById('username');
    
    if (!rememberCheckbox || !usernameInput) return;
    
    rememberCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('savedUsername', usernameInput.value);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedUsername');
        }
    });
    
    // Load remembered username on page load
    if (localStorage.getItem('rememberMe') === 'true') {
        rememberCheckbox.checked = true;
        const savedUsername = localStorage.getItem('savedUsername');
        if (savedUsername) {
            usernameInput.value = savedUsername;
        }
    }
}

// Helper functions
function showError(errorDiv, message) {
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function hideError(errorDiv) {
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}
