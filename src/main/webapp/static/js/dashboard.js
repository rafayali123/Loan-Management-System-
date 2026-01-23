// Complete Dashboard JavaScript
const API_BASE = '/api';

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
    initializeNavigation();
    loadDashboardData();
    setupEventListeners();
    initializeSMSNotifications();
    setInterval(() => loadDashboardData(), 30000); // Refresh every 30 seconds
});

// ==================== Authentication ====================
function checkAdminSession() {
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');
    const userName = sessionStorage.getItem('userName');
    
    // اگر کوئی بھی لاگ ان نہیں ہے تو login page پر جائیں
    if (!userId) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    // اگر Customer ہے تو customer dashboard پر بھیجیں
    if (userType === 'CUSTOMER') {
        window.location.href = '/pages/customer-dashboard.html';
        return;
    }
    
    // اگر Admin ہے تو allow کریں
    if (userType !== 'ADMIN') {
        window.location.href = '/pages/login.html';
        return;
    }
    
    document.getElementById('userName').textContent = userName || 'Admin';
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
    
    const section = document.getElementById(sectionId + '-section');
    if (section) {
        section.classList.add('active');
        
        // Reload data for the specific section
        switch (sectionId) {
            case 'customers':
                loadCustomersData();
                break;
            case 'loans':
                loadLoansData();
                break;
            case 'repayments':
                loadRepaymentsData();
                break;
            case 'notifications':
                loadNotificationsData();
                break;
        }
    }
}

// ==================== Dashboard Data ====================
async function loadDashboardData() {
    try {
        const [customersRes, loansRes, repaymentsRes] = await Promise.all([
            fetch(`${API_BASE}/customers`),
            fetch(`${API_BASE}/loans`),
            fetch(`${API_BASE}/repayments`)
        ]);
        
        const customers = await customersRes.json() || [];
        const loans = await loansRes.json() || [];
        const repayments = await repaymentsRes.json() || [];
        
        // Update stats
        updateDashboardStats(customers, loans, repayments);
        
        // Load tables
        loadCustomersTable(customers);
        loadLoansTable(loans);
        loadRepaymentsTable(repayments);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateDashboardStats(customers, loans, repayments) {
    // Customers stats
    document.getElementById('totalCustomers').textContent = customers.length || 0;
    
    // Loans stats
    const activeLoans = loans.filter(l => l.status === 'APPROVED').length;
    const pendingLoans = loans.filter(l => l.status === 'PENDING').length;
    const approvedLoans = loans.filter(l => l.status === 'APPROVED');
    const rejectedLoans = loans.filter(l => l.status === 'REJECTED');
    
    document.getElementById('activeLoan').textContent = activeLoans || 0;
    document.getElementById('pendingLoans').textContent = pendingLoans || 0;
    
    const totalDisbursed = approvedLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    document.getElementById('totalDisbursed').textContent = '₹' + totalDisbursed.toLocaleString();
    
    // Analytics
    const approvedAmount = approvedLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    const pendingAmount = loans.filter(l => l.status === 'PENDING')
        .reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    const rejectedAmount = rejectedLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    const totalPortfolio = loans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    const approvalPercentage = totalPortfolio > 0 
        ? Math.round((approvedAmount / totalPortfolio) * 100) 
        : 0;
    
    document.getElementById('approvedCount').textContent = approvedLoans.length || 0;
    document.getElementById('approvedAmount').textContent = approvedAmount.toLocaleString();
    
    document.getElementById('pendingCount').textContent = pendingLoans || 0;
    document.getElementById('pendingAmount').textContent = pendingAmount.toLocaleString();
    
    document.getElementById('rejectedCount').textContent = rejectedLoans.length || 0;
    document.getElementById('rejectedAmount').textContent = rejectedAmount.toLocaleString();
    
    document.getElementById('totalPortfolio').textContent = totalPortfolio.toLocaleString();
    document.getElementById('loanPercentage').textContent = approvalPercentage;
}

// ==================== Customers ====================
async function loadCustomersData() {
    try {
        const response = await fetch(`${API_BASE}/customers`);
        const customers = await response.json() || [];
        loadCustomersTable(customers);
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// Load customers table
function loadCustomersTable(customers) {
    const tbody = document.querySelector('#customersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!customers || customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No customers found</td></tr>';
        return;
    }
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        const status = customer.isActive ? 'Active' : 'Inactive';
        const statusClass = customer.isActive ? 'status-approved' : 'status-rejected';
        
        row.innerHTML = `
            <td>${(customer.firstName || '') + ' ' + (customer.lastName || '')}</td>
            <td>${customer.email || '-'}</td>
            <td>${customer.phoneNumber || '-'}</td>
            <td>${customer.city || '-'}</td>
            <td>₹${customer.annualIncome ? customer.annualIncome.toLocaleString() : '0'}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            <td>
                <button class="btn-small btn-edit" onclick="editCustomer('${customer.id}')">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteCustomer('${customer.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showCustomerForm() {
    const modal = document.getElementById('customerModal');
    if (modal) {
        modal.style.display = 'block';
        document.getElementById('customerForm').reset();
    }
}

function closeCustomerModal() {
    const modal = document.getElementById('customerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function editCustomer(customerId) {
    alert('Edit customer: ' + customerId);
}

async function deleteCustomer(customerId) {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/customers/${customerId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Customer deleted successfully');
            loadCustomersData();
        } else {
            alert('Error deleting customer');
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer');
    }
}

// ==================== Loans ====================
async function loadLoansData() {
    try {
        const response = await fetch(`${API_BASE}/loans`);
        const loans = await response.json() || [];
        
        const statusFilter = document.getElementById('loanStatusFilter')?.value;
        const filteredLoans = statusFilter 
            ? loans.filter(l => l.status === statusFilter)
            : loans;
        
        loadLoansTable(filteredLoans);
    } catch (error) {
        console.error('Error loading loans:', error);
    }
}

// Load loans table
function loadLoansTable(loans) {
    const tbody = document.querySelector('#loansTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!loans || loans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No loans found</td></tr>';
        return;
    }
    
    loans.forEach(loan => {
        const row = document.createElement('tr');
        const statusClass = `status-${(loan.status || '').toLowerCase()}`;
        const date = new Date(loan.applicationDate).toLocaleDateString();
        
        let actionButtons = '';
        if (loan.status === 'PENDING') {
            actionButtons = `
                <button class="btn-small btn-approve" onclick="approveLoan('${loan.id}')">Approve</button>
                <button class="btn-small btn-delete" onclick="rejectLoan('${loan.id}')">Reject</button>
            `;
        } else {
            actionButtons = `<button class="btn-small btn-edit" onclick="viewLoan('${loan.id}')">View</button>`;
        }
        
        row.innerHTML = `
            <td>${(loan.id || '').substring(0, 8).toUpperCase()}...</td>
            <td>${loan.customerName || 'N/A'}</td>
            <td>₹${(loan.loanAmount || 0).toLocaleString()}</td>
            <td>${loan.loanType || '-'}</td>
            <td><span class="status-badge ${statusClass}">${loan.status || 'PENDING'}</span></td>
            <td>${date}</td>
            <td>${actionButtons}</td>
        `;
        tbody.appendChild(row);
    });
}

function showLoanForm() {
    const modal = document.getElementById('loanModal');
    if (modal) {
        modal.style.display = 'block';
        loadCustomerSelectOptions();
        document.getElementById('loanForm').reset();
    }
}

function closeLoanModal() {
    const modal = document.getElementById('loanModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function loadCustomerSelectOptions() {
    try {
        const response = await fetch(`${API_BASE}/customers`);
        const customers = await response.json() || [];
        console.log('Loaded customers for loan form:', customers);
        
        // Find select in loan modal specifically
        const loanModal = document.getElementById('loanModal');
        const select = loanModal ? loanModal.querySelector('select[name="customerId"]') : null;
        
        console.log('Select element found:', select);
        console.log('Modal element found:', loanModal);
        
        if (select) {
            select.innerHTML = '<option value="">Select Customer</option>';
            
            if (customers.length === 0) {
                const option = document.createElement('option');
                option.textContent = 'No customers available. Please add customers first.';
                option.disabled = true;
                select.appendChild(option);
                console.log('No customers to display');
            } else {
                customers.forEach(customer => {
                    const option = document.createElement('option');
                    option.value = customer.id;
                    option.textContent = `${customer.firstName} ${customer.lastName}`;
                    select.appendChild(option);
                    console.log('Added customer:', customer.firstName, customer.lastName);
                });
            }
        } else {
            console.error('Select element not found in modal');
        }
    } catch (error) {
        console.error('Error loading customers:', error);
        const loanModal = document.getElementById('loanModal');
        const select = loanModal ? loanModal.querySelector('select[name="customerId"]') : null;
        if (select) {
            select.innerHTML = '<option value="">Error loading customers</option>';
        }
    }
}

function viewLoan(loanId) {
    alert('View loan: ' + loanId);
}

async function approveLoan(loanId) {
    if (!confirm('Are you sure you want to approve this loan?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/loans/${loanId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                approvedBy: sessionStorage.getItem('adminName') || 'Admin'
            })
        });
        
        if (response.ok) {
            alert('Loan approved successfully! SMS sent to customer.');
            loadLoansData();
        } else {
            alert('Error approving loan');
        }
    } catch (error) {
        console.error('Error approving loan:', error);
        alert('Error approving loan');
    }
}

async function rejectLoan(loanId) {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
        const response = await fetch(`${API_BASE}/loans/${loanId}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
        });
        
        if (response.ok) {
            alert('Loan rejected successfully! SMS sent to customer.');
            loadLoansData();
        } else {
            alert('Error rejecting loan');
        }
    } catch (error) {
        console.error('Error rejecting loan:', error);
        alert('Error rejecting loan');
    }
}

// ==================== Repayments ====================
async function loadRepaymentsData() {
    try {
        const response = await fetch(`${API_BASE}/repayments`);
        const repayments = await response.json() || [];
        
        const statusFilter = document.getElementById('repaymentStatusFilter')?.value;
        const filteredRepayments = statusFilter
            ? repayments.filter(r => r.status === statusFilter)
            : repayments;
        
        loadRepaymentsTable(filteredRepayments);
    } catch (error) {
        console.error('Error loading repayments:', error);
    }
}

// Load repayments table
function loadRepaymentsTable(repayments) {
    const tbody = document.querySelector('#repaymentsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!repayments || repayments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No repayments found</td></tr>';
        return;
    }
    
    repayments.forEach(repayment => {
        const row = document.createElement('tr');
        const statusClass = `status-${(repayment.status || '').toLowerCase()}`;
        const dueDate = new Date(repayment.dueDate).toLocaleDateString();
        
        let actionButtons = '';
        if (repayment.status === 'PENDING') {
            actionButtons = `<button class="btn-small btn-approve" onclick="markAsPaid('${repayment.id}')">Mark Paid</button>`;
        }
        actionButtons += `<button class="btn-small btn-edit" onclick="viewRepayment('${repayment.id}')">View</button>`;
        
        row.innerHTML = `
            <td>${(repayment.id || '').substring(0, 8).toUpperCase()}...</td>
            <td>${(repayment.loanId || '').substring(0, 8).toUpperCase()}...</td>
            <td>${repayment.customerName || 'N/A'}</td>
            <td>₹${(repayment.installmentAmount || 0).toLocaleString()}</td>
            <td>${dueDate}</td>
            <td><span class="status-badge ${statusClass}">${repayment.status || 'PENDING'}</span></td>
            <td>${actionButtons}</td>
        `;
        tbody.appendChild(row);
    });
}

async function markAsPaid(repaymentId) {
    if (!confirm('Mark this repayment as paid?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/repayments/${repaymentId}/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            alert('Repayment marked as paid!');
            loadRepaymentsData();
        } else {
            alert('Error updating repayment');
        }
    } catch (error) {
        console.error('Error marking as paid:', error);
        alert('Error updating repayment');
    }
}

function viewRepayment(repaymentId) {
    alert('View repayment: ' + repaymentId);
}

// ==================== Notifications ====================
async function loadNotificationsData() {
    try {
        const response = await fetch(`${API_BASE}/notifications`);
        const notifications = await response.json() || [];
        loadNotificationsTable(notifications);
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function loadNotificationsTable(notifications) {
    const tbody = document.querySelector('#notificationsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!notifications || notifications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No notifications found</td></tr>';
        return;
    }
    
    notifications.forEach(notif => {
        const row = document.createElement('tr');
        const statusClass = `status-${(notif.status || '').toLowerCase()}`;
        const sentDate = notif.sentDate ? new Date(notif.sentDate).toLocaleDateString() : '-';
        
        row.innerHTML = `
            <td>${(notif.id || '').substring(0, 8).toUpperCase() || '-'}...</td>
            <td>${notif.recipientName || notif.recipientId || '-'}</td>
            <td>${notif.phoneNumber || '-'}</td>
            <td>${(notif.message || '').substring(0, 50)}...</td>
            <td>${sentDate}</td>
            <td><span class="status-badge ${statusClass}">${notif.status || 'PENDING'}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function sendNotification() {
    alert('Send notification feature coming soon');
}

// ==================== Form Handlers ====================
document.getElementById('customerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        annualIncome: parseFloat(formData.get('annualIncome')) || 0,
        employmentType: formData.get('employmentType')
    };
    
    try {
        const response = await fetch(`${API_BASE}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Customer created successfully!');
            closeCustomerModal();
            loadCustomersData();
        } else {
            alert('Error creating customer');
        }
    } catch (error) {
        console.error('Error creating customer:', error);
        alert('Error creating customer');
    }
});

document.getElementById('loanForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        customerId: formData.get('customerId'),
        loanType: formData.get('loanType'),
        loanAmount: parseFloat(formData.get('loanAmount')),
        interestRate: parseFloat(formData.get('interestRate')),
        loanTerm: parseInt(formData.get('loanTerm')),
        purpose: formData.get('purpose')
    };
    
    try {
        const response = await fetch(`${API_BASE}/loans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Loan created successfully!');
            closeLoanModal();
            loadLoansData();
        } else {
            alert('Error creating loan');
        }
    } catch (error) {
        console.error('Error creating loan:', error);
        alert('Error creating loan');
    }
});

document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
});

// ==================== SMS Notifications ====================
// Message templates for different notification types
const smsTemplates = {
    loanApproval: 'Dear [Name], Congratulations! Your loan application for ₹[Amount] has been APPROVED. Please visit our office for documentation. Thank you!',
    loanRejection: 'Dear [Name], We regret to inform that your loan application has been REJECTED. Please contact our office for more details. Thank you!',
    paymentReminder: 'Dear [Name], This is a reminder that your loan installment of ₹[Amount] is due on [Date]. Please ensure timely payment. Thank you!',
    paymentConfirmation: 'Dear [Name], We have received your payment of ₹[Amount]. Thank you! Your loan account has been updated.'
};

// Load customers for SMS notification form
async function loadCustomersForSMS() {
    try {
        const response = await fetch(`${API_BASE}/customers`);
        const customers = await response.json();
        
        const select = document.getElementById('customerSelect');
        if (select) {
            select.innerHTML = '<option value="">-- Select Customer --</option>';
            customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = `${customer.firstName} ${customer.lastName} (${customer.phoneNumber})`;
                option.dataset.phone = customer.phoneNumber;
                select.appendChild(option);
            });
            
            // Auto-fill phone when customer is selected
            select.addEventListener('change', () => {
                const selected = select.options[select.selectedIndex];
                if (selected.dataset.phone) {
                    document.getElementById('phoneNumberInput').value = selected.dataset.phone;
                }
            });
        }
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// Update message template based on selection
function updateMessageTemplate() {
    const type = document.getElementById('messageType').value;
    const messageArea = document.getElementById('smsMessage');
    
    if (type !== 'custom' && smsTemplates[type]) {
        messageArea.value = smsTemplates[type];
        updateCharCount();
    }
}

// Update character count
function updateCharCount() {
    const message = document.getElementById('smsMessage')?.value || '';
    const charCountSpan = document.getElementById('charCount');
    if (charCountSpan) {
        charCountSpan.textContent = message.length;
    }
}

// Send SMS notification
async function sendSMSNotification(event) {
    event.preventDefault();
    
    const customerId = document.getElementById('customerSelect').value;
    const phoneNumber = document.getElementById('phoneNumberInput').value.trim();
    const message = document.getElementById('smsMessage').value.trim();
    const templateVars = document.getElementById('templateVars').value;
    
    if (!phoneNumber || !message) {
        showSMSStatus('Please fill in phone number and message', 'error');
        return;
    }
    
    // Replace template variables
    let finalMessage = message;
    if (templateVars) {
        templateVars.split(' ').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
                finalMessage = finalMessage.replace(`[${key}]`, value);
            }
        });
    }
    
    try {
        const response = await fetch(`${API_BASE}/sms/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                message: finalMessage
            })
        });
        
        if (response.ok) {
            showSMSStatus(`✓ SMS sent successfully to ${phoneNumber}`, 'success');
            document.getElementById('smsNotificationForm').reset();
            // loadNotificationsHistory(); // History endpoint not needed
        } else {
            const error = await response.json();
            showSMSStatus(`Error: ${error.message || 'Failed to send SMS'}`, 'error');
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
        showSMSStatus('Network error. Please try again.', 'error');
    }
}

// Show SMS status message
function showSMSStatus(message, type) {
    const statusDiv = document.getElementById('notificationStatus');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        
        if (type === 'success') {
            statusDiv.style.borderLeftColor = '#10b981';
            statusDiv.style.backgroundColor = '#d1fae5';
            statusDiv.style.color = '#065f46';
        } else {
            statusDiv.style.borderLeftColor = '#ef4444';
            statusDiv.style.backgroundColor = '#fee2e2';
            statusDiv.style.color = '#991b1b';
        }
    }
}

// Load notifications history
async function loadNotificationsHistory() {
    try {
        // This would need a backend endpoint to fetch notification history
        // For now, we'll just refresh the page data
        console.log('Notification history loaded');
    } catch (error) {
        console.error('Error loading notifications history:', error);
    }
}

// Initialize SMS notification form
function initializeSMSNotifications() {
    loadCustomersForSMS();
    
    const smsForm = document.getElementById('smsNotificationForm');
    if (smsForm) {
        smsForm.addEventListener('submit', sendSMSNotification);
    }
    
    const messageArea = document.getElementById('smsMessage');
    if (messageArea) {
        messageArea.addEventListener('input', updateCharCount);
    }
}

// ==================== Utilities ====================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = '/pages/login.html';
    }
}

function setupEventListeners() {
    // Modal close on outside click
    const modals = document.querySelectorAll('.modal');
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Filter events
    document.getElementById('loanStatusFilter')?.addEventListener('change', loadLoansData);
    document.getElementById('repaymentStatusFilter')?.addEventListener('change', loadRepaymentsData);
    document.getElementById('dateFilter')?.addEventListener('change', loadLoansData);
    
    // Search functionality
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Search:', searchTerm);
        });
    }
}
