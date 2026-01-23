// Customer Registration JavaScript

const API_BASE = '/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
    setupRegistrationForm();
    setupPasswordStrengthIndicator();
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

// Password strength indicator
function setupPasswordStrengthIndicator() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            let strength = 0;

            // Check length
            if (password.length >= 6) strength++;
            if (password.length >= 10) strength++;
            
            // Check character variety
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;

            // Update strength indicator
            strengthFill.className = 'strength-fill';
            strengthText.className = 'strength-text';

            if (strength <= 2) {
                strengthFill.classList.add('weak');
                strengthText.classList.add('weak');
                strengthText.textContent = 'Weak password';
            } else if (strength <= 4) {
                strengthFill.classList.add('medium');
                strengthText.classList.add('medium');
                strengthText.textContent = 'Medium password';
            } else {
                strengthFill.classList.add('strong');
                strengthText.classList.add('strong');
                strengthText.textContent = 'Strong password';
            }
        });
    }
}

// Setup registration form
function setupRegistrationForm() {
    const registerForm = document.getElementById('customerRegisterForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
            msg.classList.remove('show');
        });
        
        const errorAlert = document.getElementById('errorAlert');
        errorAlert.textContent = '';
        errorAlert.classList.remove('show');
        
        // Collect form data
        const formData = {
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            dateOfBirth: document.getElementById('dateOfBirth').value,
            idProofType: document.getElementById('idProofType').value,
            idProofNumber: document.getElementById('idProofNumber').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            zipCode: document.getElementById('zipCode').value.trim(),
            employmentType: document.getElementById('employmentType').value,
            companyName: document.getElementById('companyName').value.trim(),
            annualIncome: parseFloat(document.getElementById('annualIncome').value)
        };
        
        // Validate form
        const validationError = validateForm(formData);
        if (validationError) {
            showErrorAlert(validationError);
            return;
        }
        
        // Show loading state
        const registerBtn = document.getElementById('registerBtn');
        const originalText = registerBtn.textContent;
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<span class="spinner"></span> Creating Account...';
        
        try {
            const response = await fetch(`${API_BASE}/auth/register/customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Show success message
                const successMessage = document.getElementById('successMessage');
                successMessage.classList.add('show');
                
                // Clear form
                registerForm.reset();
                document.getElementById('strengthFill').className = 'strength-fill';
                document.getElementById('strengthText').textContent = '';
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = '/pages/login.html';
                }, 2000);
            } else {
                // Handle error response
                if (data.error) {
                    if (data.error.toLowerCase().includes('username')) {
                        document.getElementById('usernameError').textContent = data.error;
                        document.getElementById('usernameError').classList.add('show');
                    } else if (data.error.toLowerCase().includes('email')) {
                        document.getElementById('emailError').textContent = data.error;
                        document.getElementById('emailError').classList.add('show');
                    } else {
                        showErrorAlert(data.error);
                    }
                } else {
                    showErrorAlert('Registration failed. Please try again.');
                }
                
                // Re-enable button
                registerBtn.disabled = false;
                registerBtn.textContent = originalText;
            }
        } catch (error) {
            console.error('Registration error:', error);
            showErrorAlert('An error occurred during registration. Please try again.');
            
            // Re-enable button
            registerBtn.disabled = false;
            registerBtn.textContent = originalText;
        }
    });
    
    // Real-time form validation
    setupRealTimeValidation(registerForm);
}

// Validate form data
function validateForm(data) {
    // Check required fields
    if (!data.username || data.username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    
    if (!/^[a-zA-Z0-9_]*$/.test(data.username)) {
        return 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!data.password || data.password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    
    if (data.password !== data.confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        document.getElementById('confirmPasswordError').classList.add('show');
        return 'Passwords do not match';
    }
    
    if (!data.firstName || data.firstName.length < 2) {
        return 'First name is required';
    }
    
    if (!data.lastName || data.lastName.length < 2) {
        return 'Last name is required';
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        return 'Valid email address is required';
    }
    
    if (!data.phoneNumber || !isValidPhone(data.phoneNumber)) {
        return 'Valid phone number is required';
    }
    
    if (!data.dateOfBirth) {
        return 'Date of birth is required';
    }
    
    if (!data.idProofType) {
        return 'ID proof type is required';
    }
    
    if (!data.idProofNumber || data.idProofNumber.length < 5) {
        return 'Valid ID proof number is required';
    }
    
    if (!data.address || data.address.length < 5) {
        return 'Valid address is required';
    }
    
    if (!data.city || data.city.length < 2) {
        return 'City is required';
    }
    
    if (!data.state || data.state.length < 2) {
        return 'State is required';
    }
    
    if (!data.zipCode || data.zipCode.length < 3) {
        return 'Valid zip code is required';
    }
    
    if (!data.employmentType) {
        return 'Employment type is required';
    }
    
    if (!data.annualIncome || data.annualIncome <= 0) {
        return 'Valid annual income is required';
    }
    
    return null;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^\+?[0-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Show error alert
function showErrorAlert(message) {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.textContent = message;
    errorAlert.classList.add('show');
}

// Setup real-time validation
function setupRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        input.addEventListener('focus', () => {
            const errorId = input.id + 'Error';
            const errorDiv = document.getElementById(errorId);
            if (errorDiv) {
                errorDiv.textContent = '';
                errorDiv.classList.remove('show');
            }
        });
    });
}

// Validate single input
function validateInput(input) {
    const errorId = input.id + 'Error';
    const errorDiv = document.getElementById(errorId);
    let errorMessage = '';
    
    if (!input.value) {
        return; // Don't show error for empty field on blur
    }
    
    switch (input.type) {
        case 'email':
            if (!isValidEmail(input.value)) {
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'tel':
            if (!isValidPhone(input.value)) {
                errorMessage = 'Please enter a valid phone number';
            }
            break;
        case 'text':
            if (input.id === 'username' && input.value.length < 3) {
                errorMessage = 'Username must be at least 3 characters';
            } else if (input.id === 'password' && input.value.length < 6) {
                errorMessage = 'Password must be at least 6 characters';
            }
            break;
    }
    
    if (errorMessage && errorDiv) {
        errorDiv.textContent = errorMessage;
        errorDiv.classList.add('show');
    } else if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.remove('show');
    }
}
