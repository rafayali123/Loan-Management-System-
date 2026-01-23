// Customer Dashboard JavaScript
const API_BASE = '/api';

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    checkCustomerSession();
    initializeNavigation();
    loadCustomerProfile();
    loadDashboardData();
    setupEventListeners();
});

// ==================== Authentication ====================
function checkCustomerSession() {
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');
    const userName = sessionStorage.getItem('userName');
    
    // اگر کوئی بھی لاگ ان نہیں ہے تو login page پر جائیں
    if (!userId) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    // اگر Admin ہے تو admin dashboard پر بھیجیں
    if (userType === 'ADMIN') {
        window.location.href = '/pages/dashboard.html';
        return;
    }
    
    // اگر Customer ہے تو allow کریں
    if (userType !== 'CUSTOMER') {
        window.location.href = '/pages/login.html';
        return;
    }
    
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName || 'Customer';
    }
    
    // Welcome message (optional element)
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) {
        welcomeMsg.textContent = `Welcome ${userName}! We're here to help you manage your loans and payments.`;
        welcomeMsg.classList.add('show');
    }
}

// ==================== Navigation ====================
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
            
            const sectionId = link.getAttribute('data-section');
            const sectionTitle = link.textContent.trim();
            document.getElementById('pageTitle').textContent = sectionTitle;
            
            showSection(sectionId);
        });
    });
    
    // Toggle sidebar on mobile
    const toggleBtn = document.getElementById('toggleSidebar');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar-nav');
            sidebar.classList.toggle('show');
        });
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
}

// ==================== Data Loading ====================
function loadCustomerProfile() {
    const userId = sessionStorage.getItem('userId');
    console.log('Loading profile for userId:', userId);
    
    if (!userId) {
        console.error('User ID not found in session');
        return;
    }
    
    const url = `${API_BASE}/customers/${userId}`;
    console.log('Fetching from URL:', url);
    
    fetch(url)
        .then(response => {
            console.log('Response status:', response.status, response.ok);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received customer data:', data);
            if (data) {
                document.getElementById('profileFirstName').textContent = data.firstName || '-';
                document.getElementById('profileLastName').textContent = data.lastName || '-';
                document.getElementById('profileEmail').textContent = data.email || '-';
                document.getElementById('profilePhone').textContent = data.phoneNumber || '-';
                document.getElementById('profileCity').textContent = data.city || '-';
                document.getElementById('profileIncome').textContent = `Rs. ${(data.annualIncome || 0).toLocaleString()}`;
                document.getElementById('profileAddress').textContent = data.address || '-';
                document.getElementById('profileIdType').textContent = data.idProofType || '-';
                document.getElementById('profileIdNumber').textContent = data.idProofNumber || '-';
            } else {
                console.error('No customer data returned');
            }
        })
        .catch(error => console.error('Error loading profile:', error));
}

function loadDashboardData() {
    const userId = sessionStorage.getItem('userId');
    
    // Load loans for the loans table
    fetch(`${API_BASE}/loans/customer/${userId}`)
        .then(response => response.json())
        .then(loans => {
            if (Array.isArray(loans)) {
                loadLoansTable(loans);
                updateLoanStats(loans);
            }
        })
        .catch(error => console.error('Error loading loans:', error));
}

function updateLoanStats(loans) {
    let totalCount = loans.length;
    let pendingCount = 0;
    let approvedCount = 0;
    let totalAmount = 0;
    
    loans.forEach(loan => {
        if (loan.status === 'PENDING') pendingCount++;
        else if (loan.status === 'APPROVED') approvedCount++;
        totalAmount += loan.loanAmount || 0;
    });
    
    document.getElementById('totalLoanCount').textContent = totalCount;
    document.getElementById('pendingLoanCount').textContent = pendingCount;
    document.getElementById('approvedLoanCount').textContent = approvedCount;
    document.getElementById('totalLoanAmount').textContent = `₹${totalAmount.toLocaleString()}`;
}

function loadLoansTable(loans) {
    const tbody = document.getElementById('loansTableBody');
    
    if (loans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #999;">No loan applications yet. Apply for a new loan to get started!</td></tr>';
        return;
    }
    
    tbody.innerHTML = loans.map((loan, index) => `
        <tr>
            <td><strong>Rs. ${(loan.loanAmount || 0).toLocaleString()}</strong></td>
            <td>${loan.interestRate || 10}%</td>
            <td>${loan.loanTerm || 0} months</td>
            <td>
                <span class="status-badge ${getStatusBadgeClass(loan.status)}">
                    ${getStatusBadgeIcon(loan.status)} ${getStatusInEnglish(loan.status)}
                </span>
            </td>
            <td>${formatDate(loan.applicationDate)}</td>
            <td>
                <button class="btn" style="  background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);; color: white; padding: 8px 14px; font-size: 12px; width: auto;" onclick="viewLoanDetails(${index})">View</button>
            </td>
        </tr>
    `).join('');
}

function getStatusBadgeIcon(status) {
    switch(status) {
        case 'PENDING': return '⏳';
        case 'APPROVED': return '✓';
        case 'REJECTED': return '✗';
        default: return '•';
    }
}

function viewLoanDetails(index) {
    const userId = sessionStorage.getItem('userId');
    
    fetch(`${API_BASE}/loans/customer/${userId}`)
        .then(response => response.json())
        .then(loans => {
            if (loans[index]) {
                const loan = loans[index];
                const details = `
Loan Amount: Rs. ${(loan.loanAmount || 0).toLocaleString()}
Term: ${loan.loanTerm} months
Interest Rate: ${loan.interestRate}%
Purpose: ${loan.purpose}
Status: ${getStatusInEnglish(loan.status)}
Application Date: ${formatDate(loan.applicationDate)}
${loan.description ? 'Notes: ' + loan.description : ''}
                `;
                alert(details);
            }
        })
        .catch(error => console.error('Error:', error));
}

function showLoanForm() {
    const navLink = document.querySelector('[data-section="apply-loan"]');
    if (navLink) {
        navLink.click();
    }
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'APPROVED': return 'approved';
        case 'REJECTED': return 'rejected';
        case 'PENDING': return 'pending';
        default: return 'pending';
    }
}

function getStatusInEnglish(status) {
    const statusMap = {
        'APPROVED': 'Approved',
        'REJECTED': 'Rejected',
        'PENDING': 'Pending'
    };
    return statusMap[status] || status;
}

function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ur-PK');
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    const loanForm = document.getElementById('loanApplicationForm');
    if (loanForm) {
        loanForm.addEventListener('submit', submitLoanApplication);
    }

    // Calculate monthly payment on amount or term change
    const amountInput = document.getElementById('loanAmount');
    const termInput = document.getElementById('loanTerm');
    
    if (amountInput) amountInput.addEventListener('change', calculateMonthlyPayment);
    if (amountInput) amountInput.addEventListener('input', calculateMonthlyPayment);
    if (termInput) termInput.addEventListener('change', calculateMonthlyPayment);
}

function calculateMonthlyPayment() {
    const amount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const term = parseInt(document.getElementById('loanTerm').value) || 0;
    const interestRate = 10; // Assuming standard 10% annual interest rate
    
    if (amount > 0 && term > 0) {
        const monthlyRate = (interestRate / 100) / 12;
        const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                               (Math.pow(1 + monthlyRate, term) - 1);
        document.getElementById('monthlyPayment').textContent = Math.round(monthlyPayment).toLocaleString();
    } else {
        document.getElementById('monthlyPayment').textContent = '0';
    }
}

function showAlert(containerId, message, type = 'success') {
    const alertBox = document.getElementById(containerId);
    if (alertBox) {
        alertBox.className = `alert alert-${type} show`;
        alertBox.textContent = message;
        alertBox.style.display = 'block';
        
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    }
}

async function submitLoanApplication(e) {
    e.preventDefault();
    
    const userId = sessionStorage.getItem('userId');
    const submitBtn = document.getElementById('submitLoanBtn');
    
    // Validation
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const term = parseInt(document.getElementById('loanTerm').value);
    const purpose = document.getElementById('purpose').value;
    
    if (!amount || amount < 10000) {
        showAlert('loanAlertBox', 'Loan amount must be at least Rs. 10,000', 'danger');
        return;
    }
    
    if (!term) {
        showAlert('loanAlertBox', 'Please select a loan term', 'danger');
        return;
    }
    
    if (!purpose) {
        showAlert('loanAlertBox', 'Please select a loan purpose', 'danger');
        return;
    }
    
    const loanData = {
        customerId: userId,
        loanAmount: amount,
        loanTerm: term,
        purpose: purpose,
        description: document.getElementById('description').value || '',
        status: 'PENDING',
        applicationDate: new Date().toISOString(),
        interestRate: 10
    };
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        const response = await fetch(`${API_BASE}/loans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loanData)
        });
        
        if (response.ok) {
            showAlert('loanAlertBox', '✓ Your loan application has been submitted successfully! Our team will review it shortly.', 'success');
            document.getElementById('loanApplicationForm').reset();
            document.getElementById('monthlyPayment').textContent = '0';
            
            // Reload loans data after a short delay
            setTimeout(() => {
                loadDashboardData();
            }, 1500);
        } else {
            const errorData = await response.json().catch(() => ({}));
            showAlert('loanAlertBox', errorData.message || 'Error submitting application. Please try again.', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('loanAlertBox', 'Error: ' + error.message, 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
    }
}

// ==================== Logout ====================
function logoutCustomer() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = '/pages/login.html';
    }
}
