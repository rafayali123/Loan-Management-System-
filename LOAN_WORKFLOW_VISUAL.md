# Loan Status Management - Visual Workflow Guide

## Loan Status Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                   CUSTOMER APPLIES FOR LOAN                     │
│         (Fill form with amount, term, purpose, description)     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ Status: PENDING │ ◄──── Automatic on creation
                    └─────────────────┘
                              ↓
         ┌────────────────────────────────────────┐
         │   VISIBLE IN CUSTOMER DASHBOARD        │
         │   "Loan Status" section                │
         │   Shows: Amount, Term, Status (yellow) │
         └────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────┐
         │   ADMIN SEES ON DASHBOARD              │
         │   "Manage Loans" / "Pending Approvals" │
         │   Review button available              │
         └────────────────────────────────────────┘
                              ↓
        ┌──────────────────────────────────────────┐
        │   ADMIN CLICKS "REVIEW" BUTTON           │
        │   Modal Opens with Loan Details          │
        └──────────────────────────────────────────┘
                              ↓
         ┌────────────────────┬────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
    APPROVE          [NEUTRAL VIEW]         REJECT BUTTON
       ↓                                          ↓
    ┌──────────────┐                    ┌─────────────────────┐
    │ Click Button │                    │ Show Reason Input   │
    │              │                    │ (optional)          │
    │ API Call:    │                    │ + Confirmation Btns │
    │ POST /approve│                    └─────────────────────┘
    │              │                              ↓
    │ Backend:     │                    ┌─────────────────────┐
    │ - Set APPROVED                    │ Click "Yes, Reject" │
    │ - Start Date                      │                     │
    │ - End Date                        │ API Call:           │
    │ - Send SMS                        │ POST /reject        │
    └──────────────┘                    │                     │
         ↓                              │ Backend:            │
    Status:                             │ - Set REJECTED      │
    APPROVED ✓                          │ - Save Reason       │
         ↓                              │ - Send SMS          │
    SMS: "✓ Your loan of                └─────────────────────┘
    Rs. X has been                           ↓
    APPROVED!"                          Status:
         ↓                              REJECTED ✗
    (Removed from                            ↓
     pending list)                      SMS: "✗ Your loan
         ↓                              has been REJECTED.
    CUSTOMER SEES:                      Reason: [reason]"
    Status changed                           ↓
    to APPROVED ✓                      (Removed from
    (Green badge)                       pending list)
                                             ↓
                                        CUSTOMER SEES:
                                        Status changed
                                        to REJECTED ✗
                                        (Red badge)
```

## Admin Modal - Detailed View

### Step 1: Review Loan
```
╔═══════════════════════════════════════════╗
║   Review Loan Application                 ║
╠═══════════════════════════════════════════╣
║                                           ║
║  📋 Loan Application Details              ║
║  ─────────────────────────────────────   ║
║  Customer Name: Faizan Ali                ║
║  Phone: +923001234567                     ║
║  Loan Amount: Rs. 100,000                 ║
║  Loan Term: 12 months                     ║
║  Interest Rate: 10% per annum             ║
║  Monthly Installment: Rs. 8,748           ║
║  Loan Purpose: Home Renovation            ║
║  Application Date: 15 Jan 2026            ║
║  Annual Income: Rs. 500,000               ║
║  Notes: Good credit history               ║
║                                           ║
╠═══════════════════════════════════════════╣
║  [✓ Approve Loan] [✗ Reject Loan]        ║
╚═══════════════════════════════════════════╝
```

### Step 2: If Admin Clicks Reject
```
╔═══════════════════════════════════════════╗
║   Review Loan Application                 ║
╠═══════════════════════════════════════════╣
║  [Previous loan details...]               ║
╠═══════════════════════════════════════════╣
║                                           ║
║  Rejection Reason (optional):             ║
║  ┌─────────────────────────────────────┐ ║
║  │ Enter reason for rejection...       │ ║
║  │ (e.g., Income verification failed)  │ ║
║  │                                     │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
║  ⚠ Confirm Rejection?                    ║
║  [Yes, Reject] [Cancel]                  ║
║                                           ║
╚═══════════════════════════════════════════╝
```

## Status Badge Colors

```
┌──────────────────────┬──────────────────┬────────────────┐
│      Status          │      Badge       │      Color     │
├──────────────────────┼──────────────────┼────────────────┤
│ PENDING              │   Pending        │  Yellow        │
│ (Awaiting Action)    │   ⏳              │  (#fbbf24)     │
├──────────────────────┼──────────────────┼────────────────┤
│ APPROVED             │   Approved       │  Green         │
│ (Loan Active)        │   ✓              │  (#10b981)     │
├──────────────────────┼──────────────────┼────────────────┤
│ REJECTED             │   Rejected       │  Red           │
│ (Loan Denied)        │   ✗              │  (#ef4444)     │
└──────────────────────┴──────────────────┴────────────────┘
```

## Customer Dashboard - Status Display

### Loan Status Table
```
╔════════════════════════════════════════════════════════════╗
║                    My Loan Applications                    ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Amount    Term    Interest  Status        Date   Actions ║
║  ────────  ─────   ────────  ────────      ────   ──────  ║
║  Rs.100K   12 mo   10%       ⏳ Pending    15-Jan [View]  ║
║  Rs.50K    6 mo    10%       ✓ Approved    10-Jan [View]  ║
║  Rs.75K    9 mo    10%       ✗ Rejected    05-Jan [View]  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

## Admin Dashboard - Loan Management

### Manage Loans Section
```
╔════════════════════════════════════════════════════════════════╗
║              Manage Loans - Filter by Status                   ║
║  [Pending] [Approved] [Rejected]                              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Customer   Phone    Amount    Term   Purpose   Status  Action║
║  ────────   ─────    ──────    ────   ──────    ──────  ──── ║
║  Faizan Ali 0300...  Rs.100K   12mo   Home      ⏳      [Review]
║  Ahmed Khan 0333...  Rs.250K   24mo   Business  ✓       [Completed]
║  Fatima B.  0321...  Rs.50K    6mo    Education ✗       [Completed]
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

┌─ Pending Approvals ─────────────────────┐
│  Total: 5 applications waiting review   │
│  Oldest: 2 days pending                 │
└────────────────────────────────────────┘
```

## SMS Notification Examples

### On Approval
```
┌──────────────────────────────────────┐
│ WhatsApp/SMS Message                 │
├──────────────────────────────────────┤
│                                      │
│ ✓ Great News! Faizan Ali            │
│                                      │
│ Your loan application has been       │
│ APPROVED! 🎉                         │
│                                      │
│ Loan Amount: Rs. 100,000             │
│ Loan ID: 65a1b2c3d4e5f6g7h8i9j0     │
│                                      │
│ Loan documents are ready. Please     │
│ visit our office to complete the     │
│ formalities.                         │
│                                      │
│ Thank You!                           │
│ Loan Management System               │
│                                      │
└──────────────────────────────────────┘
```

### On Rejection
```
┌──────────────────────────────────────┐
│ WhatsApp/SMS Message                 │
├──────────────────────────────────────┤
│                                      │
│ ✗ Loan Application Update            │
│                                      │
│ Your loan application (Loan ID:      │
│ 65a1b2c3d4e5f6g7h8i9j0) has been   │
│ REJECTED.                            │
│                                      │
│ Reason: Income verification failed   │
│                                      │
│ You may reapply after 30 days.       │
│ Please contact our office for more   │
│ information.                         │
│                                      │
│ Thank You!                           │
│ Loan Management System               │
│                                      │
└──────────────────────────────────────┘
```

## Database Document Structure

### Loan Document (PENDING)
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0",
  "customerId": "63f1a2b3c4d5e6f7g8h9i0",
  "customerName": "Faizan Ali",
  "customerPhoneNumber": "+923001234567",
  "loanAmount": 100000,
  "interestRate": 10,
  "loanTerm": 12,
  "loanType": "Personal",
  "purpose": "Home Renovation",
  "status": "PENDING",
  "monthlyInstallment": 8748.50,
  "remainingInstallments": 12,
  "applicationDate": "2026-01-15T10:30:00Z",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T10:30:00Z"
}
```

### Loan Document (APPROVED)
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0",
  "customerId": "63f1a2b3c4d5e6f7g8h9i0",
  "customerName": "Faizan Ali",
  "customerPhoneNumber": "+923001234567",
  "loanAmount": 100000,
  "interestRate": 10,
  "loanTerm": 12,
  "loanType": "Personal",
  "purpose": "Home Renovation",
  "status": "APPROVED",
  "monthlyInstallment": 8748.50,
  "remainingInstallments": 12,
  "applicationDate": "2026-01-15T10:30:00Z",
  "approvalDate": "2026-01-15T14:20:00Z",
  "loanStartDate": "2026-01-15T14:20:00Z",
  "loanEndDate": "2027-01-15T14:20:00Z",
  "approvedBy": "Admin User",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T14:20:00Z"
}
```

### Loan Document (REJECTED)
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0",
  "customerId": "63f1a2b3c4d5e6f7g8h9i0",
  "customerName": "Faizan Ali",
  "customerPhoneNumber": "+923001234567",
  "loanAmount": 100000,
  "interestRate": 10,
  "loanTerm": 12,
  "loanType": "Personal",
  "purpose": "Home Renovation",
  "status": "REJECTED",
  "monthlyInstallment": 8748.50,
  "remainingInstallments": 12,
  "applicationDate": "2026-01-15T10:30:00Z",
  "rejectionReason": "Income verification documents incomplete",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T15:45:00Z"
}
```

## Testing Workflow

### Quick Test (5 minutes)

1. **Start Server**
   ```bash
   mvn spring-boot:run
   ```

2. **Customer Application**
   - Navigate to: http://localhost:8080
   - Login as customer
   - Go to "Apply for Loan"
   - Fill form:
     - Amount: 100000
     - Term: 12 months
     - Purpose: Select any
     - Description: Test application
   - Click "Submit Application"
   - Verify: Loan appears with "Pending" status

3. **Admin Review**
   - Login as admin
   - Go to "Manage Loans"
   - Verify: Loan appears in pending list
   - Click "Review"
   - Verify: Modal shows loan details

4. **Admin Approval**
   - Click "Approve Loan"
   - Verify: Success message
   - Verify: Loan disappears from pending
   - Verify: SMS message sent (if configured)

5. **Customer Verification**
   - Switch to customer
   - Refresh dashboard
   - Verify: Loan status changed to "Approved" ✓
   - Verify: SMS received

6. **Admin Rejection**
   - Create another loan application (repeat steps 2)
   - Admin approves this new loan
   - Create third loan application
   - Go to "Manage Loans" → "Pending"
   - Click "Review" on third loan
   - Click "Reject Loan"
   - Enter reason: "Income verification failed"
   - Click "Yes, Reject"
   - Verify: Success message
   - Verify: SMS with rejection reason sent

7. **Customer Verification**
   - Switch to customer
   - Refresh dashboard
   - Verify: All three loans visible with correct statuses
   - Verify: SMS for rejection received

---

**Last Updated**: January 15, 2026
**Status**: ✅ Ready for Testing
