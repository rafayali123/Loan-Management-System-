// Register Page JavaScript

const API_BASE = '/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
    setupRegistrationForm();
    setupPasswordStrengthIndicator();
});

// Check if already logged in
function checkAdminSession() {
    const adminId = sessionStorage.getItem('adminId');
    if (adminId) {
        window.location.href = '/pages/dashboard.html';
    }
}

// Setup registration form
function setupRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registerForm);
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phoneNumber: formData.get('phoneNumber'),
            position: formData.get('position')
        };
        
        // Validate form
        const validationError = validateRegistrationForm(data);
        if (validationError) {
            showError(validationError);
            return;
        }
        
        try {
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Creating Account...';
            
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                    fullName: data.fullName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    position: data.position
                })
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                showSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/pages/login.html';
                }, 2000);
            } else {
                const errorMsg = responseData.message || responseData.error || 'Registration failed. Please try again.';
                showError(errorMsg);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Account';
            }
        } catch (error) {
            console.error('Registration error:', error);
            showError('Network error. Please check your connection and try again.');
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Create Account';
        }
    });
}

// Validate registration form
function validateRegistrationForm(data) {
    if (!data.username || data.username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    
    if (!data.fullName || data.fullName.trim().length < 3) {
        return 'Full name must be at least 3 characters long';
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        return 'Please enter a valid email address';
    }
    
    if (!data.phoneNumber || !isValidPhone(data.phoneNumber)) {
        return 'Please enter a valid phone number';
    }
    
    if (!data.password || data.password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    
    if (data.password !== data.confirmPassword) {
        return 'Passwords do not match';
    }
    
    if (!data.position) {
        return 'Please select a position';
    }
    
    return null;
}

// Setup password strength indicator
function setupPasswordStrengthIndicator() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);
        updateStrengthIndicator(strength);
    });
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    
    if (strength <= 1) return 'weak';
    if (strength <= 3) return 'medium';
    return 'strong';
}

// Update strength indicator UI
function updateStrengthIndicator(strength) {
    const container = document.querySelector('.password-strength');
    if (!container) {
        const passwordInput = document.getElementById('password');
        const newContainer = document.createElement('div');
        newContainer.className = 'password-strength';
        newContainer.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill ${strength}"></div>
            </div>
            <span class="strength-text ${strength}">Strength: ${strength.charAt(0).toUpperCase() + strength.slice(1)}</span>
        `;
        passwordInput.parentElement.appendChild(newContainer);
    } else {
        const fill = container.querySelector('.strength-fill');
        const text = container.querySelector('.strength-text');
        
        fill.className = `strength-fill ${strength}`;
        text.className = `strength-text ${strength}`;
        text.textContent = `Strength: ${strength.charAt(0).toUpperCase() + strength.slice(1)}`;
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone format
function isValidPhone(phone) {
    const phoneRegex = /^[1-9\-\+\(\)\s]{7,}$/;
    return phoneRegex.test(phone);
}

// Show error message
function showError(message) {
    let errorDiv = document.querySelector('.error-message');
    
    if (!errorDiv) {
        const form = document.getElementById('registerForm');
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show success message
function showSuccess(message) {
    let successDiv = document.querySelector('.success-message');
    
    if (!successDiv) {
        const form = document.getElementById('registerForm');
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        form.insertBefore(successDiv, form.firstChild);
    }
    
    successDiv.textContent = message;
    successDiv.classList.add('show');
    successDiv.style.display = 'block';
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
