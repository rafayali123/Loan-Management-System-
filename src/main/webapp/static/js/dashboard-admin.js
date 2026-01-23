// Admin Dashboard JavaScript
const API_BASE = '/api';
let currentLoanForAction = null;
let allCustomers = [];
let allLoans = [];
let CustomerId = 0;
// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
    initializeNavigation();
    loadDashboardStats();
    setupEventListeners();
    loadCustomers();

});

// ==================== Authentication ====================
function checkAdminSession() {
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');
    const userName = sessionStorage.getItem('userName').toUpperCase();
    
    if (!userId) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    if (userType === 'CUSTOMER') {
        window.location.href = '/pages/customer-dashboard.html';
        return;
    }
    
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
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const sectionId = link.getAttribute('data-section');
            const sectionTitle = link.textContent.trim();
            document.getElementById('pageTitle').textContent = sectionTitle;
            
            showSection(sectionId);
        });
    });
    
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
        
        // Load data for specific sections
        if (sectionId === 'customers') {
            loadCustomers();
        } else if (sectionId === 'loans') {
            loadLoans();
        }
    }
}

// ==================== Dashboard Stats ====================
function loadDashboardStats() {
    fetch(`${API_BASE}/customers`)
        .then(response => response.json())
        .then(customers => {
            document.getElementById('totalCustomers').textContent = customers.length || 0;
        })
        .catch(error => console.error('Error loading customers:', error));
    
    fetch(`${API_BASE}/loans`)
        .then(response => response.json())
        .then(loans => {
            if (Array.isArray(loans)) {
                const approved = loans.filter(l => l.status === 'APPROVED').length;
                const pending = loans.filter(l => l.status === 'PENDING').length;
                
                document.getElementById('activeLoan').textContent = approved || 0;
                document.getElementById('pendingLoans').textContent = pending || 0;
                
                const totalAmount = loans
                    .filter(l => l.status === 'APPROVED')
                    .reduce((sum, l) => sum + (l.loanAmount || 0), 0);
                document.getElementById('totalDisbursed').textContent = `Rs. ${totalAmount.toLocaleString()}`;
                
                // Also update analytics
                updateLoanAnalytics(loans);
            }
        })
        .catch(error => console.error('Error loading loans:', error));
}

// ==================== Customers Management ====================
async function  loadCustomers() {
   await fetch(`${API_BASE}/customers`)
        .then(response => response.json())
        .then(customers => {
            allCustomers = customers;
            displayCustomers(customers);
            populateCustomerSelect(customers);
                loadLoans();
        })
        .catch(error => console.error('Error loading customers:', error));
}

function displayCustomers(customers) {
    const tbody = document.getElementById('customersTableBody');
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #999;">No customers registered yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td><strong>${customer.firstName || ''} ${customer.lastName || ''}</strong></td>
            <td>${customer.email || '-'}</td>
            <td>${customer.phoneNumber || '-'}</td>
            <td>${customer.city || '-'}</td>
            <td>Rs. ${(customer.annualIncome || 0).toLocaleString()}</td>
            <td>
                <span class="badge badge-info" id="loans-${customer.id}">0</span>
            </td>
            <td>
                <button class="btn btn-small" style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); cursor: pointer; color: white; padding: 6px 12px; font-size: 12px;" onclick="openCreateLoanModal('${customer.id}', '${customer.firstName} ${customer.lastName}')">Create Loan</button>
            </td>
        </tr>
    `).join('');
    
    // Load loan counts for each customer
    loadLoanCounts();
}

function loadLoanCounts() {
    fetch(`${API_BASE}/loans`)
        .then(response => response.json())
        .then(loans => {
            if (Array.isArray(loans)) {
                const loansByCustomer = {};
                loans.forEach(loan => {
                    if (!loansByCustomer[loan.customerId]) {
                        loansByCustomer[loan.customerId] = 0;
                    }
                    loansByCustomer[loan.customerId]++;
                });
                
                allCustomers.forEach(customer => {
                    const count = loansByCustomer[customer.id] || 0;
                    const badge = document.getElementById(`loans-${customer.id}`);
                    if (badge) {
                        badge.textContent = count;
                        badge.className = `badge ${count > 0 ? 'badge-success' : 'badge-warning'}`;
                    }
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

function populateCustomerSelect() {
    const select = document.getElementById('createLoanCustomer');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select Customer --</option>';
    allCustomers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.firstName} ${customer.lastName} (${customer.phoneNumber})`;
        select.appendChild(option);
    });
}

// ==================== Loans Management ====================
function loadLoans() {
    fetch(`${API_BASE}/loans`)
        .then(response => response.json())
        .then(loans => {
            allLoans = loans;
            displayLoans(loans);
            populateNotificationLoans(loans);
            updateLoanAnalytics(loans);
        })
        .catch(error => console.error('Error loading loans:', error));
}

function updateLoanAnalytics(loans) {
    if (!Array.isArray(loans)) return;
    
    // Filter loans by status
    const approvedLoans = loans.filter(l => l.status === 'APPROVED');
    const pendingLoans = loans.filter(l => l.status === 'PENDING');
    const rejectedLoans = loans.filter(l => l.status === 'REJECTED');
    
    // Calculate totals
    const approvedAmount = approvedLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    const pendingAmount = pendingLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    const rejectedAmount = rejectedLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    const totalAmount = loans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    const loanPercentage = totalAmount > 0 ? Math.round((approvedAmount / totalAmount) * 100) : 0;
    
    // Update analytics cards
    document.getElementById('approvedCount').textContent = approvedLoans.length || 0;
    document.getElementById('approvedAmount').textContent = approvedAmount.toLocaleString();
    
    document.getElementById('pendingCount').textContent = pendingLoans.length || 0;
    document.getElementById('pendingAmount').textContent = pendingAmount.toLocaleString();
    
    document.getElementById('rejectedCount').textContent = rejectedLoans.length || 0;
    document.getElementById('rejectedAmount').textContent = rejectedAmount.toLocaleString();
    
    document.getElementById('totalPortfolio').textContent = totalAmount.toLocaleString();
    document.getElementById('loanPercentage').textContent = loanPercentage;
}

function displayLoans(loans) {
    const tbody = document.getElementById('loansTableBody');
    
    if (loans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px; color: #999;">No loan applications</td></tr>';
        return;
    }
    
    tbody.innerHTML = loans.map(loan => `
        <tr>
            <td><strong>${loan.customerName || 'Unknown'}</strong></td>
            <td>${loan.customerPhoneNumber || '-'}</td>
            <td>Rs. ${(loan.loanAmount || 0).toLocaleString()}</td>
            <td>${loan.loanTerm || 0} months</td>
            <td>${loan.purpose || '-'}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(loan.status)}">
                    ${getStatusInEnglish(loan.status)}
                </span>
            </td>
            <td>${formatDate(loan.applicationDate)}</td>
            <td>
                ${loan.status === 'PENDING' ? `
                    <button class="btn btn-small" style="background-color: #f59e0b; color: white; padding: 6px 12px; font-size: 12px;" onclick="openLoanActionModal('${loan.id}')">Review</button>
                ` : `
                    <button class="btn btn-small" style="background-color: #6b7280; color: white; padding: 6px 12px; font-size: 12px; cursor: not-allowed;" disabled>Completed</button>
                `}
            </td>
        </tr>
    `).join('');
}

function getLoanCustomerName(customerId, loanObj) {
    // Prefer data from loan object which was populated during creation
    if (loanObj && loanObj.customerName) {
        return loanObj.customerName;
    }
    const customer = allCustomers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown';
}

function getLoanCustomerPhone(customerId, loanObj) {
    // Prefer data from loan object which was populated during creation
    if (loanObj && loanObj.customerPhoneNumber) {
        return loanObj.customerPhoneNumber;
    }
    const customer = allCustomers.find(c => c.id === customerId);
    return customer ? customer.phoneNumber : '-';
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'APPROVED': return 'badge-success';
        case 'REJECTED': return 'badge-danger';
        case 'PENDING': return 'badge-warning';
        default: return 'badge-warning';
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
    return new Date(date).toLocaleDateString('en-PK');
}

// ==================== Loan Action (Approve/Reject) ====================
function openLoanActionModal(loanId) {
    const loan = allLoans.find(l => l.id === loanId);
    if (!loan) return;
    
    currentLoanForAction = loan;
    const customer = allCustomers.find(c => c.id === loan.customerId);
    
    // Use data from loan object (populated during loan creation), fallback to customer lookup
    const customerName = loan.customerName || (customer ? customer.firstName + ' ' + customer.lastName : 'Unknown');
    const customerPhone = loan.customerPhoneNumber || (customer ? customer.phoneNumber : '-');
    const customerIncome = customer ? customer.annualIncome : 0;
    
    const content = document.getElementById('loanActionContent');
    content.innerHTML = `
        <div style="background-color: #f0f4ff; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
            <h4 style="margin: 0 0 10px 0; color: #1f2937;">Loan Application Details</h4>
            <hr style="margin: 10px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 8px 0;"><strong>Customer Name:</strong> ${customerName}</p>
            <p style="margin: 8px 0;"><strong>Phone Number:</strong> ${customerPhone}</p>
            <p style="margin: 8px 0;"><strong>Loan Amount:</strong> Rs. ${(loan.loanAmount || 0).toLocaleString()}</p>
            <p style="margin: 8px 0;"><strong>Loan Term:</strong> ${loan.loanTerm} months</p>
            <p style="margin: 8px 0;"><strong>Interest Rate:</strong> ${loan.interestRate || 10}% per annum</p>
            <p style="margin: 8px 0;"><strong>Monthly Installment:</strong> Rs. ${(loan.monthlyInstallment || 0).toLocaleString()}</p>
            <p style="margin: 8px 0;"><strong>Loan Purpose:</strong> ${loan.purpose || '-'}</p>
            <p style="margin: 8px 0;"><strong>Application Date:</strong> ${formatDate(loan.applicationDate)}</p>
            <p style="margin: 8px 0;"><strong>Annual Income:</strong> Rs. ${(customerIncome || 0).toLocaleString()}</p>
            ${loan.description ? `<p style="margin: 8px 0;"><strong>Applicant Notes:</strong> ${loan.description}</p>` : ''}
        </div>
    `;
    
    document.getElementById('loanActionModal').classList.add('show');
}

function closeLoanActionModal() {
    document.getElementById('loanActionModal').classList.remove('show');
    currentLoanForAction = null;
}

function approveLoan() {
    if (!currentLoanForAction) return;
    
    const approvalRequest = {
        approvedBy: sessionStorage.getItem('userName') || 'Admin',
        phoneNumber: currentLoanForAction.customerPhoneNumber,
        customerName: currentLoanForAction.customerName
    };
    
    fetch(`${API_BASE}/loans/${currentLoanForAction.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(approvalRequest)
    })
    .then(response => {
        if (response.ok) {
            alert('Loan approved successfully! SMS notification sent to customer.');
            loadLoans();
            closeLoanActionModal();
        } else {
            alert('Error approving loan');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error approving loan');
    });
}

function toggleRejectMode() {
    const rejectionContainer = document.getElementById('rejectionReasonContainer');
    const confirmRejectContainer = document.getElementById('confirmRejectContainer');
    const rejectLoanBtn = document.getElementById('rejectLoanBtn');
    
    if (rejectionContainer.style.display === 'none') {
        rejectionContainer.style.display = 'block';
        confirmRejectContainer.style.display = 'block';
        rejectLoanBtn.style.display = 'none';
    }
}

function cancelReject() {
    const rejectionContainer = document.getElementById('rejectionReasonContainer');
    const confirmRejectContainer = document.getElementById('confirmRejectContainer');
    const rejectLoanBtn = document.getElementById('rejectLoanBtn');
    
    rejectionContainer.style.display = 'none';
    confirmRejectContainer.style.display = 'none';
    rejectLoanBtn.style.display = 'block';
    document.getElementById('rejectionReason').value = '';
}

function confirmRejectLoan() {
    if (!currentLoanForAction) return;
    
    const rejectionReason = document.getElementById('rejectionReason').value.trim() || 'Loan application does not meet approval criteria';
    
    const rejectionRequest = {
        reason: rejectionReason,
        phoneNumber: currentLoanForAction.customerPhoneNumber,
        customerName: currentLoanForAction.customerName
    };
    
    fetch(`${API_BASE}/loans/${currentLoanForAction.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rejectionRequest)
    })
    .then(response => {
        if (response.ok) {
            alert('✗ Loan rejected successfully! SMS notification sent to customer.');
            loadLoans();
            closeLoanActionModal();
        } else {
            alert('Error rejecting loan');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error rejecting loan');
    });
}

function rejectLoan() {
    toggleRejectMode();
}

// ==================== Create Loan ====================
function openCreateLoanModal(customerId, customerName) {
    document.getElementById('createLoanCustomer').value = customerId;
    document.getElementById('createLoanModal').classList.add('show');
}

function closeCreateLoanModal() {
    document.getElementById('createLoanModal').classList.remove('show');
    document.getElementById('createLoanForm').reset();
}

// ==================== SMS Notifications ====================
function populateNotificationLoans(loans) {
    const select = document.getElementById('notificationLoanSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select Loan Application --</option>';
    loans.map(loan => {
         if (loan.status !== 'PENDING') {  // Only show non-pending loans
            const customer = allCustomers.find(c => c.id === loan.customerId);
            const option = document.createElement('option');
            option.value = loan.id;
            option.dataset.phone = customer ? customer.phoneNumber : '';
            option.dataset.CusId = customer ? customer.id : '';
            option.textContent = `${customer ? customer.firstName + ' ' + customer.lastName : 'Unknown'} - Rs. ${(loan.loanAmount || 0).toLocaleString()} (${getStatusInEnglish(loan.status)})`;
            select.appendChild(option);
        }
    });
}

document.getElementById('notificationLoanSelect').addEventListener('change', function(e) {
    const selectedOption = e.target.options[e.target.selectedIndex];
     CustomerId = selectedOption.dataset.CusId;
});
 
var formattedDate = "";

(function currentdate () {
    var date = new Date();

    var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);

    firstDate.setDate(firstDate.getDate() + 11);

    var day = String(firstDate.getDate()).padStart(2, '0');
    var month = String(firstDate.getMonth() + 1).padStart(2, '0');
    var year = firstDate.getFullYear();

    formattedDate = `${day}-${month}-${year}`;
})();

 

function updateMessageTemplate() {
    const messageType = document.getElementById('messageType').value;
    const messageBox = document.getElementById('smsMessage');
    
    const templates = {
        'APPROVAL': 'Great news! Your loan application has been approved. Loan Amount: Rs. [AMOUNT]. Monthly Payment: Rs. [MONTHLY]. Please visit our office to complete the process.',
        'REJECTION': 'We regret to inform you that your loan application has been rejected. For more details, please contact our office or call our support team.',
        'REMINDER': 'Reminder: Your loan payment of Rs. [AMOUNT] is due on [DATE]. Please pay on time to avoid penalties.'
    };


 
    let message_template = templates[messageType] || '';
    allLoans.map((item) => {
        if(item.customerId == CustomerId)
        {
          message_template = message_template.replace("[AMOUNT]", item.loanAmount);
          message_template = message_template.replace("[MONTHLY]", item.monthlyInstallment);
        message_template = message_template.replace("[DATE]", formattedDate);
        }
    })

    messageBox.value = message_template;
    updateCharCount();
}

function updateCharCount() {
    const message = document.getElementById('smsMessage').value;
    document.getElementById('charCount').textContent = message.length;
}

function sendApprovalSMS(loan) {
    const customer = allCustomers.find(c => c.id === loan.customerId);
    if (!customer) return;
    
    const message = `Great news! Your loan application has been APPROVED. Amount: Rs. ${(loan.loanAmount || 0).toLocaleString()}. Term: ${loan.loanTerm} months at ${loan.interestRate}% interest. Please contact us for next steps.`;
    
    fetch(`${API_BASE}/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phoneNumber: customer.phoneNumber,
            message: message,
            type: 'APPROVAL'
        })
    })
    .catch(error => console.error('Error sending SMS:', error));
}

function sendRejectionSMS(loan) {
    const customer = allCustomers.find(c => c.id === loan.customerId);
    if (!customer) return;
    
    const message = `Your loan application has been REJECTED. We appreciate your interest. Please contact us for more information or to discuss other options.`;
    
    fetch(`${API_BASE}/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phoneNumber: customer.phoneNumber,
            message: message,
            type: 'REJECTION'
        })
    })
    .catch(error => console.error('Error sending SMS:', error));
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Loan status filter
    const statusFilter = document.getElementById('loanStatusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            const status = statusFilter.value;
            const filtered = status ? allLoans.filter(l => l.status === status) : allLoans;
            displayLoans(filtered);
        });
    }
    
    // Customer search
    const customerSearch = document.getElementById('customerSearch');
    if (customerSearch) {
        customerSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allCustomers.filter(c => 
                (c.firstName + ' ' + c.lastName).toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                c.phoneNumber.includes(query)
            );
            displayCustomers(filtered);
        });
    }
    
    // Create Loan Form
    const createLoanForm = document.getElementById('createLoanForm');
    if (createLoanForm) {
        createLoanForm.addEventListener('submit', submitCreateLoan);
    }
    
    // SMS Notification Form
    const smsForm = document.getElementById('smsNotificationForm');
    if (smsForm) {
        smsForm.addEventListener('submit', submitSMSNotification);
    }
    
    // SMS Message character count
    const smsMessage = document.getElementById('smsMessage');
    if (smsMessage) {
        smsMessage.addEventListener('input', updateCharCount);
    }
}

async function submitCreateLoan(e) {
    e.preventDefault();
    
    const customerId = document.getElementById('createLoanCustomer').value;
    const amount = parseFloat(document.getElementById('createLoanAmount').value);
    const rate = parseFloat(document.getElementById('createLoanRate').value);
    const term = parseInt(document.getElementById('createLoanTerm').value);
    const purpose = document.getElementById('createLoanPurpose').value;
    const description = document.getElementById('createLoanDescription').value;
    
    if (!customerId || !amount || !rate || !term || !purpose) {
        alert('Please fill all required fields');
        return;
    }
    
    const loanData = {
        customerId: customerId,
        loanAmount: amount,
        interestRate: rate,
        loanTerm: term,
        purpose: purpose,
        description: description,
        status: 'PENDING',  // ✓ Start as PENDING, not auto-approved
        applicationDate: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_BASE}/loans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loanData)
        });
        
        if (response.ok) {
            alert('✓ Loan created successfully! Status: PENDING (Awaiting approval)');
            closeCreateLoanModal();
            loadLoans();
            await loadCustomers();
        } else {
            alert('Error creating loan');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

async function submitSMSNotification(e) {
    e.preventDefault();
    
    const loanId = document.getElementById('notificationLoanSelect').value;
    const messageType = document.getElementById('messageType').value;
    const message = document.getElementById('smsMessage').value;
    
    if (!loanId || !messageType || !message) {
        alert('Please fill all required fields');
        return;
    }
    
    const loan = allLoans.find(l => l.id === loanId);
    const customer = allCustomers.find(c => c.id === loan.customerId);
    
    if (!customer) {
        alert('Customer not found');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/sms/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: customer.phoneNumber,
                message: message,
            })
        });
        
        if (response.ok) {
            showAlert('smsAlertBox', 'SMS sent successfully to ' + customer.phoneNumber, 'success');
            document.getElementById('smsNotificationForm').reset();
            document.getElementById('charCount').textContent = '0';
        } else {
            showAlert('smsAlertBox', 'Error sending SMS', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('smsAlertBox', 'Error: ' + error.message, 'danger');
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

// ==================== Logout ====================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = '/pages/login.html';
    }
}
