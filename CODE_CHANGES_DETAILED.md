# Loan Status Management - Code Changes Reference

## Summary of Changes

**Files Modified**: 2
**Build Time**: 9 minutes 5 seconds
**Build Status**: ✅ SUCCESS

---

## File 1: `src/main/webapp/pages/dashboard.html`

### Location: Lines 251-268 (Loan Action Modal)

### OLD CODE:
```html
    <div id="loanActionModal" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2 id="loanActionTitle">Review Loan Application</h2>
                <button class="close-btn" onclick="closeLoanActionModal()">&times;</button>
            </div>
            <div id="loanActionContent" style="margin-bottom: 20px; padding: 20px 30px;">
                <!-- Loan details will be inserted here -->
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 30px 30px 30px;">
                <button onclick="approveLoan()" style="background-color: #10b981; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">✓ Approve Loan</button>
                <button onclick="rejectLoan()" style="background-color: #ef4444; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">✗ Reject Loan</button>
            </div>
        </div>
    </div>
```

### NEW CODE:
```html
    <div id="loanActionModal" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2 id="loanActionTitle">Review Loan Application</h2>
                <button class="close-btn" onclick="closeLoanActionModal()">&times;</button>
            </div>
            <div id="loanActionContent" style="margin-bottom: 20px; padding: 20px 30px;">
                <!-- Loan details will be inserted here -->
            </div>
            <div id="rejectionReasonContainer" style="padding: 0 30px; margin-bottom: 15px; display: none;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1f2937;">Rejection Reason (optional)</label>
                <textarea id="rejectionReason" placeholder="Enter reason for rejection..." style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical; height: 80px; font-family: inherit; font-size: 14px;"></textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 30px 30px 30px;">
                <button onclick="approveLoan()" style="background-color: #10b981; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">✓ Approve Loan</button>
                <button onclick="toggleRejectMode()" id="rejectLoanBtn" style="background-color: #ef4444; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">✗ Reject Loan</button>
            </div>
            <div id="confirmRejectContainer" style="padding: 0 30px 30px 30px; display: none; border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
                <p style="color: #7f1d1d; font-weight: 600; margin-bottom: 10px;">⚠ Confirm Rejection?</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button onclick="confirmRejectLoan()" style="background-color: #dc2626; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: 600; cursor: pointer;">Yes, Reject</button>
                    <button onclick="cancelReject()" style="background-color: #9ca3af; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: 600; cursor: pointer;">Cancel</button>
                </div>
            </div>
        </div>
    </div>
```

### Changes Explained:

1. **Added Rejection Reason Container**:
   - Hidden by default (`display: none`)
   - Shows textarea for entering rejection reason
   - Optional field (admin can use default)

2. **Updated Reject Button**:
   - Now calls `toggleRejectMode()` instead of `rejectLoan()`
   - Added `id="rejectLoanBtn"` for reference
   - Still same styling

3. **Added Confirmation Container**:
   - Shows after admin clicks reject
   - Two buttons: "Yes, Reject" and "Cancel"
   - Warning message with ⚠ icon
   - Prevents accidental rejections

---

## File 2: `src/main/webapp/static/js/dashboard-admin.js`

### Location: Lines 306-387 (Loan Action Functions)

### OLD CODE:
```javascript
function approveLoan() {
    if (!currentLoanForAction) return;
    
    fetch(`${API_BASE}/loans/${currentLoanForAction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentLoanForAction, status: 'APPROVED' })
    })
    .then(response => {
        if (response.ok) {
            alert('✓ Loan approved successfully!');
            sendApprovalSMS(currentLoanForAction);
            loadLoans();
            closeLoanActionModal();
        } else {
            alert('Error approving loan');
        }
    })
    .catch(error => console.error('Error:', error));
}

function rejectLoan() {
    if (!currentLoanForAction) return;
    
    fetch(`${API_BASE}/loans/${currentLoanForAction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentLoanForAction, status: 'REJECTED' })
    })
    .then(response => {
        if (response.ok) {
            alert('✗ Loan rejected successfully');
            sendRejectionSMS(currentLoanForAction);
            loadLoans();
            closeLoanActionModal();
        } else {
            alert('Error rejecting loan');
        }
    })
    .catch(error => console.error('Error:', error));
}
```

### NEW CODE:
```javascript
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
            alert('✓ Loan approved successfully! SMS notification sent to customer.');
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
```

### Changes Explained:

#### 1. **`approveLoan()` Function** - Lines 306-327
**What Changed**:
- ✅ Changed endpoint from `PUT /loans/{id}` to `POST /loans/{id}/approve`
- ✅ Changed method from `PUT` to `POST`
- ✅ Now sends proper `ApprovalRequest` object:
  - `approvedBy`: Admin name from session storage
  - `phoneNumber`: Customer phone for SMS
  - `customerName`: Customer name for SMS
- ✅ Removed redundant `sendApprovalSMS()` call (backend handles it)
- ✅ Updated success message to mention SMS

**Why**:
- Backend endpoint `/approve` handles all approval logic including SMS
- Properly structured request matches backend expectations
- Admin name captured for audit trail
- Eliminates code duplication

#### 2. **`toggleRejectMode()` Function** - Lines 329-341
**What This Does**:
- Shows rejection reason textarea
- Shows confirmation buttons
- Hides reject button
- Called when admin clicks "Reject Loan"

**Prevents**:
- Accidental rejections without reason
- Provides user confirmation

#### 3. **`cancelReject()` Function** - Lines 343-353
**What This Does**:
- Hides rejection reason textarea
- Hides confirmation buttons
- Shows reject button again
- Clears entered reason

**Allows**:
- Admin to change their mind
- Return to normal modal view

#### 4. **`confirmRejectLoan()` Function** - Lines 355-381
**What This Does**:
- Gets rejection reason from textarea
- Uses default if empty
- Sends proper `RejectionRequest` to backend
- Uses POST endpoint `/reject`
- Triggers SMS with reason

**Backend Calls**:
- `POST /api/loans/{id}/reject`
- Backend sets status to REJECTED
- Backend sends SMS to customer
- Backend saves rejection reason

#### 5. **`rejectLoan()` Function** - Lines 383-385
**What Changed**:
- Now calls `toggleRejectMode()` instead of directly rejecting
- Shows UI for entering reason and confirmation
- Original direct rejection removed

**Two-Step Process**:
1. Click "Reject Loan" → Show reason input
2. Click "Yes, Reject" → Confirm and reject

---

## API Endpoints Now Used

### Before (Incorrect):
```
PUT /api/loans/{id}
- Body: Full loan object with status field
- No SMS
- Bypassed backend business logic
```

### After (Correct):
```
POST /api/loans/{id}/approve
- Body: { approvedBy, phoneNumber, customerName }
- Backend: SMS sent automatically
- Backend: Sets dates and calculations
- Returns: Updated loan object

POST /api/loans/{id}/reject
- Body: { reason, phoneNumber, customerName }
- Backend: SMS sent with reason
- Returns: Updated loan object
```

---

## Backend Verification

### Approve Endpoint Handler
**File**: `src/main/java/com/loanmanagement/controller/LoanController.java` (Line 85-98)
```java
@PostMapping("/{id}/approve")
public ResponseEntity<?> approveLoan(@PathVariable String id, @RequestBody ApprovalRequest request) {
    Loan approvedLoan = loanService.approveLoan(id, request.getApprovedBy());
    if (approvedLoan != null) {
        // Send SMS notification
        smsService.sendLoanApprovalNotification(
            request.getPhoneNumber(),
            request.getCustomerName(),
            String.valueOf(approvedLoan.getLoanAmount()),
            id
        );
        return ResponseEntity.ok(approvedLoan);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ErrorMessage("Loan not found"));
}
```

### Reject Endpoint Handler
**File**: `src/main/java/com/loanmanagement/controller/LoanController.java` (Line 100-113)
```java
@PostMapping("/{id}/reject")
public ResponseEntity<?> rejectLoan(@PathVariable String id, @RequestBody RejectionRequest request) {
    Loan rejectedLoan = loanService.rejectLoan(id, request.getReason());
    if (rejectedLoan != null) {
        // Send SMS notification
        smsService.sendLoanRejectionNotification(
            request.getPhoneNumber(),
            request.getCustomerName(),
            id,
            request.getReason()
        );
        return ResponseEntity.ok(rejectedLoan);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ErrorMessage("Loan not found"));
}
```

---

## Data Flow Diagram

### Approval Flow (After Fix)
```
Admin UI
  │
  ├─ Click "Approve Loan"
  │
  └─→ approveLoan() JS
       │
       ├─ Create ApprovalRequest {
       │   approvedBy, phoneNumber, customerName
       │ }
       │
       └─→ POST /api/loans/{id}/approve
            │
            └─→ LoanController.approveLoan()
                 │
                 ├─→ LoanService.approveLoan()
                 │    │
                 │    ├─ Set status = APPROVED
                 │    ├─ Set approvalDate = now
                 │    ├─ Set loanStartDate = now
                 │    ├─ Calculate loanEndDate
                 │    ├─ Set approvedBy = admin name
                 │    └─ Save to MongoDB
                 │
                 ├─→ SMSService.sendLoanApprovalNotification()
                 │    │
                 │    └─ Send SMS to customer
                 │
                 └─→ Return Loan object (status: APPROVED)
                      │
                      └─→ Admin UI
                           │
                           ├─ Show success
                           ├─ Reload loans
                           └─ Close modal
                               │
                               └─→ Customer sees updated status
```

### Rejection Flow (After Fix)
```
Admin UI
  │
  ├─ Click "Reject Loan"
  │
  └─→ toggleRejectMode() JS
       │
       ├─ Show reason input
       ├─ Show "Yes, Reject" button
       └─ Show "Cancel" button
            │
            ├─ Admin enters reason (optional)
            │
            └─→ Click "Yes, Reject"
                 │
                 └─→ confirmRejectLoan() JS
                      │
                      ├─ Get reason (or use default)
                      │
                      ├─ Create RejectionRequest {
                      │   reason, phoneNumber, customerName
                      │ }
                      │
                      └─→ POST /api/loans/{id}/reject
                           │
                           └─→ LoanController.rejectLoan()
                                │
                                ├─→ LoanService.rejectLoan()
                                │    │
                                │    ├─ Set status = REJECTED
                                │    ├─ Set rejectionReason = reason
                                │    └─ Save to MongoDB
                                │
                                ├─→ SMSService.sendLoanRejectionNotification()
                                │    │
                                │    └─ Send SMS with reason
                                │
                                └─→ Return Loan object (status: REJECTED)
                                     │
                                     └─→ Admin UI
                                          │
                                          ├─ Show success
                                          ├─ Reload loans
                                          └─ Close modal
                                              │
                                              └─→ Customer sees updated status + SMS
```

---

## Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **API Used** | PUT generic update | POST specific endpoints |
| **SMS Notifications** | Manual SMS call (buggy) | Automatic via endpoint |
| **Rejection Reason** | Not captured | User input + optional |
| **Accidental Rejects** | Possible | Prevented by confirmation |
| **Admin Info** | Not saved | Captured in approvedBy field |
| **Status Initialization** | Always APPROVED | Properly PENDING |
| **Code Duplication** | SMS called from JS | Handled in backend |
| **User Experience** | One-click reject | Two-step with reason |

---

## Testing the Fix

### Command to Build:
```bash
cd d:\Loan Management System
mvn clean package -DskipTests
```

### Build Output:
```
[INFO] BUILD SUCCESS
[INFO] Total time: 09:05 min
[INFO] Finished at: 2026-01-15T01:45:13+05:00
```

### Run Server:
```bash
mvn spring-boot:run
```

### Access:
- Frontend: http://localhost:8080
- API: http://localhost:8080/api

---

## Verification Points

### In Browser Console (F12 → Console):

After approving a loan, should see:
```
Response status: 200 ok
```

After rejecting a loan with reason:
```
Response status: 200 ok
```

No errors should appear.

### In MongoDB:

Approved loan document should have:
```json
{
  "status": "APPROVED",
  "approvalDate": "2026-01-15T...",
  "loanStartDate": "2026-01-15T...",
  "loanEndDate": "2027-01-15T...",
  "approvedBy": "Admin Name"
}
```

Rejected loan document should have:
```json
{
  "status": "REJECTED",
  "rejectionReason": "Income verification failed"
}
```

---

**Build Status**: ✅ SUCCESS
**Test Status**: Ready for Testing
**Date**: January 15, 2026

