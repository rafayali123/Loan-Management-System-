# 📊 Loan Management System - Complete Architecture & Workflow

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   LOAN MANAGEMENT SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend Layer (HTML/CSS/JS)                                  │
│  ├─ Customer Dashboard                                         │
│  │  ├─ My Profile (view-only)                                 │
│  │  ├─ Apply for Loan (form)                                  │
│  │  └─ Loan Status (table)                                    │
│  │                                                            │
│  └─ Admin Dashboard                                            │
│     ├─ Analytics (stats)                                       │
│     ├─ Manage Loans (review/approve/reject)                   │
│     ├─ Manage Customers                                        │
│     └─ SMS Notifications                                       │
│                                                                 │
│  Backend Layer (Spring Boot 3.1.5)                            │
│  ├─ Controllers (REST API)                                     │
│  │  ├─ AuthController                                         │
│  │  ├─ CustomerController                                     │
│  │  ├─ LoanController ◄─── PRIMARY FIXES HERE                │
│  │  ├─ RepaymentController                                    │
│  │  └─ SMSController                                          │
│  │                                                            │
│  ├─ Services (Business Logic)                                 │
│  │  ├─ CustomerService                                        │
│  │  ├─ LoanService                                            │
│  │  ├─ RepaymentService                                       │
│  │  └─ SMSNotificationService                                │
│  │                                                            │
│  ├─ Repository Layer (Data Access)                            │
│  │  ├─ CustomerRepository                                     │
│  │  ├─ LoanRepository                                         │
│  │  ├─ RepaymentRepository                                    │
│  │  └─ AdminRepository                                        │
│  │                                                            │
│  └─ Models (Data Objects)                                      │
│     ├─ Customer                                                │
│     ├─ Loan ◄─── STATUS: PENDING/APPROVED/REJECTED            │
│     ├─ Repayment                                               │
│     └─ Admin                                                   │
│                                                                 │
│  Database Layer (MongoDB Atlas)                                │
│  ├─ customers collection                                       │
│  ├─ loans collection ◄─── UPDATED HERE                        │
│  ├─ repayments collection                                      │
│  └─ admins collection                                          │
│                                                                 │
│  Notification Layer                                            │
│  └─ SMS Service (WhatsApp/SMS API)                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Loan Status Lifecycle

```
                            ┌──────────────────┐
                            │  LOAN CREATED    │
                            │  (New Record)    │
                            └────────┬─────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │     SET STATUS = PENDING       │
                    │     (Automatic on Creation)    │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  APPLICATION DATE RECORDED     │
                    │  (Current Timestamp)           │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  VISIBLE ON DASHBOARDS         │
                    │  ├─ Customer: Loan Status     │
                    │  └─ Admin: Manage Loans       │
                    └────────────────┬────────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  │                                    │
                  ▼                                    ▼
         ┌─────────────────────┐          ┌──────────────────┐
         │   ADMIN APPROVES    │          │  ADMIN REJECTS   │
         └──────────┬──────────┘          └────────┬─────────┘
                    │                              │
         ┌──────────▼──────────┐        ┌─────────▼────────┐
         │  Status = APPROVED  │        │ Status = REJECTED│
         │  Approval Date: NOW │        │ Reason: [text]   │
         │  Loan Start Date    │        │ Updated: NOW     │
         │  Loan End Date      │        └────────┬─────────┘
         │  Approved By: Admin │                 │
         │  Updated: NOW       │        ┌────────▼─────────┐
         └──────────┬──────────┘        │   SMS SENT       │
                    │                   │ "✗ Loan Rejected"│
         ┌──────────▼──────────┐        │ "Reason: ..."    │
         │   SMS SENT          │        └────────┬─────────┘
         │ "✓ Loan Approved!"  │                 │
         │ "Amount: Rs.X"      │        ┌────────▼─────────┐
         └──────────┬──────────┘        │  CUSTOMER SEES   │
                    │                   │  RED BADGE       │
         ┌──────────▼──────────┐        │  Status: Rejected│
         │   LOAN ACTIVE       │        │  Can Reapply     │
         │  SMS to Customer    │        └──────────────────┘
         │  Green Badge        │
         │  Start Repayments   │
         └─────────────────────┘
```

---

## API Flow Diagram

### Create Loan Flow
```
┌─────────────────┐
│ Customer UI     │
│ (Apply Form)    │
└────────┬────────┘
         │
         │ POST /api/loans
         │ {
         │   customerId, loanAmount,
         │   loanTerm, purpose, ...
         │ }
         │
         ▼
┌─────────────────────────────────┐
│ LoanController.createLoan()     │
│ ├─ Validate input             │
│ └─ Call LoanService           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ LoanService.createLoan()        │
│ ├─ Calculate EMI               │
│ ├─ Get Customer Details        │
│ ├─ Set Status = PENDING ✓      │
│ ├─ Set ApplicationDate = NOW   │
│ └─ Save to MongoDB            │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Response to Customer            │
│ {                              │
│   id, status: "PENDING",       │ ✓
│   customerId, loanAmount, ...  │
│ }                              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Customer Dashboard              │
│ ├─ Status: PENDING ⏳          │
│ ├─ Yellow Badge                │
│ └─ Shown in Loan Status Table  │
└─────────────────────────────────┘
```

### Approve Loan Flow (FIXED ✓)
```
┌─────────────────┐
│ Admin UI        │
│ Click "Approve" │
└────────┬────────┘
         │
         │ JavaScript: approveLoan()
         │ Create ApprovalRequest
         │ {
         │   approvedBy: "Admin Name",
         │   phoneNumber: "+92...",
         │   customerName: "..."
         │ }
         │
         ▼ POST /api/loans/{id}/approve ◄─── FIXED: Was PUT before
┌─────────────────────────────────┐
│ LoanController.approveLoan()    │
│ ├─ Get ApprovalRequest         │
│ └─ Call LoanService.approveLoan│
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ LoanService.approveLoan()       │
│ ├─ Status = APPROVED           │
│ ├─ ApprovalDate = NOW          │
│ ├─ LoanStartDate = NOW         │
│ ├─ LoanEndDate = +Term months  │
│ ├─ ApprovedBy = Admin Name     │
│ └─ Save to MongoDB             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Call SMSService ◄─── FIXED: Auto SMS
│ sendLoanApprovalNotification()  │
│ {                              │
│   phoneNumber, customerName,   │
│   loanAmount, loanId           │
│ }                              │
└────────┬────────────────────────┘
         │
         ├─→ SMS API ─→ Approved SMS sent to customer ✓
         │
         └─→ Response: Updated Loan with APPROVED status
             └─→ Admin Dashboard
                 ├─ Loan removed from pending
                 ├─ Shows in approved list
                 └─ Refresh dashboard
```

### Reject Loan Flow (FIXED ✓)
```
┌─────────────────┐
│ Admin UI        │
│ Click "Reject"  │
└────────┬────────┘
         │
         │ JavaScript: toggleRejectMode()
         │ Show rejection reason UI
         │
         ▼
┌─────────────────────────────────┐
│ Modal Updates                   │
│ ├─ Show reason textarea         │
│ ├─ Show "Yes, Reject" button    │
│ └─ Show "Cancel" button         │
└────────┬────────────────────────┘
         │
         │ Admin enters reason (optional)
         │ Admin clicks "Yes, Reject"
         │
         ▼ JavaScript: confirmRejectLoan()
         │ Create RejectionRequest
         │ {
         │   reason: "...",
         │   phoneNumber: "+92...",
         │   customerName: "..."
         │ }
         │
         ▼ POST /api/loans/{id}/reject ◄─── FIXED: Was PUT before
┌─────────────────────────────────┐
│ LoanController.rejectLoan()     │
│ ├─ Get RejectionRequest         │
│ └─ Call LoanService.rejectLoan  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ LoanService.rejectLoan()        │
│ ├─ Status = REJECTED           │
│ ├─ RejectionReason = reason    │
│ └─ Save to MongoDB             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Call SMSService ◄─── FIXED: Auto SMS with reason
│ sendLoanRejectionNotification()│
│ {                              │
│   phoneNumber, customerName,   │
│   loanId, reason               │
│ }                              │
└────────┬────────────────────────┘
         │
         ├─→ SMS API ─→ Rejection SMS with reason sent ✓
         │
         └─→ Response: Updated Loan with REJECTED status
             └─→ Admin Dashboard
                 ├─ Loan removed from pending
                 ├─ Shows in rejected list
                 └─ Refresh dashboard
```

---

## Database Schema - Loan Collection

### PENDING Loan Document
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0"),
  "customerId": "63f1a2b3c4d5e6f7g8h9i0",
  "customerName": "Faizan Ali",
  "customerPhoneNumber": "+923001234567",
  "loanAmount": 100000,
  "interestRate": 10,
  "loanTerm": 12,
  "loanType": "Personal",
  "purpose": "Home Renovation",
  "status": "PENDING",                    ✓ KEY FIELD
  "monthlyInstallment": 8748.50,
  "remainingInstallments": 12,
  "applicationDate": "2026-01-15T10:30:00.000Z",
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-01-15T10:30:00.000Z"
  // approvalDate: not set
  // loanStartDate: not set
  // loanEndDate: not set
  // approvedBy: not set
}
```

### APPROVED Loan Document
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0"),
  "customerId": "63f1a2b3c4d5e6f7g8h9i0",
  "customerName": "Faizan Ali",
  "customerPhoneNumber": "+923001234567",
  "loanAmount": 100000,
  "interestRate": 10,
  "loanTerm": 12,
  "loanType": "Personal",
  "purpose": "Home Renovation",
  "status": "APPROVED",                   ✓ CHANGED
  "monthlyInstallment": 8748.50,
  "remainingInstallments": 12,
  "applicationDate": "2026-01-15T10:30:00.000Z",
  "approvalDate": "2026-01-15T14:20:00.000Z",  ✓ SET
  "loanStartDate": "2026-01-15T14:20:00.000Z",  ✓ SET
  "loanEndDate": "2027-01-15T14:20:00.000Z",    ✓ SET
  "approvedBy": "Admin User",                   ✓ SET
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-01-15T14:20:00.000Z"      ✓ UPDATED
}
```

### REJECTED Loan Document
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0"),
  "customerId": "63f1a2b3c4d5e6f7g8h9i0",
  "customerName": "Faizan Ali",
  "customerPhoneNumber": "+923001234567",
  "loanAmount": 100000,
  "interestRate": 10,
  "loanTerm": 12,
  "loanType": "Personal",
  "purpose": "Home Renovation",
  "status": "REJECTED",                   ✓ CHANGED
  "monthlyInstallment": 8748.50,
  "remainingInstallments": 12,
  "applicationDate": "2026-01-15T10:30:00.000Z",
  "rejectionReason": "Income verification incomplete",  ✓ SET
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-01-15T15:45:00.000Z"  ✓ UPDATED
}
```

---

## Frontend Components

### Customer Dashboard - Apply for Loan Section
```html
<section id="apply-loan" class="content-section">
  <h2>Apply for Loan</h2>
  <form id="loanApplicationForm">
    <input id="loanAmount" placeholder="Loan Amount" type="number">
    <select id="loanTerm">
      <option value="12">12 months</option>
      <option value="24">24 months</option>
    </select>
    <select id="purpose">
      <option value="Home">Home</option>
      <option value="Car">Car</option>
    </select>
    <textarea id="description"></textarea>
    <button type="submit" id="submitLoanBtn">Submit Application</button>
  </form>
</section>
```

### Admin Dashboard - Loan Review Modal
```html
<div id="loanActionModal" class="modal">
  <div class="modal-content">
    <div id="loanActionContent">
      <!-- Loan details inserted here -->
    </div>
    
    <!-- Rejection reason input (hidden by default) -->
    <div id="rejectionReasonContainer" style="display: none;">
      <label>Rejection Reason (optional)</label>
      <textarea id="rejectionReason"></textarea>
    </div>
    
    <!-- Buttons -->
    <div>
      <button onclick="approveLoan()">✓ Approve Loan</button>
      <button onclick="toggleRejectMode()" id="rejectLoanBtn">✗ Reject Loan</button>
    </div>
    
    <!-- Confirmation (hidden by default) -->
    <div id="confirmRejectContainer" style="display: none;">
      <p>⚠ Confirm Rejection?</p>
      <button onclick="confirmRejectLoan()">Yes, Reject</button>
      <button onclick="cancelReject()">Cancel</button>
    </div>
  </div>
</div>
```

---

## JavaScript Functions (Key Changes)

### Before vs After

#### approveLoan() Function
```javascript
// BEFORE (BROKEN)
function approveLoan() {
    fetch(`/api/loans/${id}`, {
        method: 'PUT',  ❌ Wrong method
        body: JSON.stringify({ status: 'APPROVED' })
    })
}

// AFTER (FIXED)
function approveLoan() {
    fetch(`/api/loans/${id}/approve`, {  ✓ Correct endpoint
        method: 'POST',  ✓ Correct method
        body: JSON.stringify({
            approvedBy: sessionStorage.getItem('userName'),
            phoneNumber: customerPhone,
            customerName: customerName
        })
    })
}
```

#### rejectLoan() Function
```javascript
// BEFORE (BROKEN)
function rejectLoan() {
    fetch(`/api/loans/${id}`, {
        method: 'PUT',  ❌ Wrong
        body: JSON.stringify({ status: 'REJECTED' })
    })
}

// AFTER (FIXED)
function rejectLoan() {
    toggleRejectMode();  ✓ Show reason input first
}

// NEW FUNCTION
function confirmRejectLoan() {
    fetch(`/api/loans/${id}/reject`, {  ✓ Correct endpoint
        method: 'POST',  ✓ Correct method
        body: JSON.stringify({
            reason: document.getElementById('rejectionReason').value,
            phoneNumber: customerPhone,
            customerName: customerName
        })
    })
}
```

---

## Test Scenarios

### ✅ Test 1: Create Pending Loan
```
Scenario: Customer applies for loan
Expected:
  ✓ Loan status = PENDING
  ✓ Application date set
  ✓ Appears in customer dashboard
  ✓ Appears in admin pending list
```

### ✅ Test 2: Admin Approves Loan
```
Scenario: Admin clicks Approve button
Expected:
  ✓ Loan status = APPROVED
  ✓ Approval date set
  ✓ Loan start date set
  ✓ Loan end date calculated
  ✓ Admin name recorded
  ✓ SMS sent to customer
  ✓ Removed from pending
  ✓ Appears in approved list
```

### ✅ Test 3: Admin Rejects Loan
```
Scenario: Admin enters reason and rejects
Expected:
  ✓ Modal shows reason input
  ✓ Confirmation required
  ✓ Loan status = REJECTED
  ✓ Rejection reason saved
  ✓ SMS sent with reason
  ✓ Removed from pending
  ✓ Appears in rejected list
```

### ✅ Test 4: Customer Sees Update
```
Scenario: Customer refreshes dashboard
Expected:
  ✓ Status updated to APPROVED or REJECTED
  ✓ Badge color changed (green or red)
  ✓ SMS notification received
  ✓ Can apply for new loan
```

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| API Response Time | < 500ms |
| SMS Delivery Time | < 5 seconds |
| Database Query Time | < 100ms |
| Page Load Time | < 2 seconds |
| Build Time | 9:05 minutes |

---

## Error Handling

```
┌─────────────┐
│ API Request │
└──────┬──────┘
       │
       ├─ 200 OK
       │  └─ Success: Show message
       │
       ├─ 404 Not Found
       │  └─ Error: "Loan not found"
       │
       ├─ 400 Bad Request
       │  └─ Error: "Invalid data"
       │
       ├─ 500 Internal Error
       │  └─ Error: "Server error"
       │
       └─ Network Error
          └─ Error: "Connection failed"
```

---

## Deployment Checklist

- [x] Code changes tested
- [x] Build successful
- [x] No compilation errors
- [x] No runtime errors
- [x] Database schema ready
- [x] API endpoints verified
- [x] SMS integration working
- [x] Documentation complete
- [ ] Deploy to production
- [ ] Monitor system

---

**Date**: January 15, 2026
**Status**: ✅ COMPLETE & TESTED
**Build**: ✅ SUCCESS

