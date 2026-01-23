# 📊 System Flow Diagram - Matches Your Requirements

## Complete System Architecture

```
╔════════════════════════════════════════════════════════════════════════════╗
║                    LOAN MANAGEMENT SYSTEM - FLOW DIAGRAM                   ║
╚════════════════════════════════════════════════════════════════════════════╝


                          ┌─────────────────────────────────┐
                          │     ADMIN DASHBOARD LOGIN       │
                          └──────────────┬──────────────────┘
                                         │
                                    [ADMIN LOGIN]
                                         │
                          ┌──────────────▼──────────────────┐
                          │   ADMIN MAIN DASHBOARD          │
                          │  ├─ Analytics/Stats             │
                          │  ├─ Manage Customers            │
                          │  ├─ Manage Loans                │
                          │  └─ SMS Notifications           │
                          └──────────────┬──────────────────┘
                                         │
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          │                              │                              │
          ▼                              ▼                              ▼
   ┌──────────────────┐    ┌─────────────────────┐         ┌──────────────────┐
   │  View ALL        │    │  Create LOAN for    │         │   Manage LOANS   │
   │  Customers       │    │  Specific Customer  │         │  (Review/Action) │
   │                  │    │                     │         │                  │
   │ • List All       │    │ • Select Customer   │         │ • Filter Status  │
   │ • View Details   │    │ • Enter Amount      │         │ • View Details   │
   │ • Create Loan    │    │ • Set Term          │         │ • Click Review   │
   │   Button         │    │ • Choose Purpose    │         └────────┬─────────┘
   └──────────────────┘    │ • Status: PENDING✓  │                  │
                           │ • Click "Create"    │                  │
                           └────────┬────────────┘              [Review Modal]
                                    │                             │
                    [Loan Created]   │                    ┌────────▼────────┐
                                     │                    │  Loan Details   │
                                     │                    │  Modal Opens    │
                                     │                    │                 │
                                     │    ┌──────────────────────────────┐
                                     │    │  Loan Information            │
                                     │    │  ├─ Customer Name            │
                                     │    │  ├─ Loan Amount              │
                                     │    │  ├─ Interest Rate            │
                                     │    │  ├─ Monthly Payment          │
                                     │    │  └─ Annual Income            │
                                     │    └───────┬────────────────────┘
                                     │            │
                                     │    ┌───────┴───────┐
                                     │    │               │
                                     │    ▼               ▼
                                     │  [APPROVE]      [REJECT]
                                     │    │               │
                   ┌─────────────────┴────┼───────────────┤
                   │                      │               │
                   │                      │         [Show Reason Input]
                   │                      │         Admin enters reason
                   │                      │               │
                   │                      │         [Confirm Rejection]
                   │                      │               │
                   ▼                      ▼               ▼
         ┌───────────────────┐  ┌─────────────────┐  ┌──────────────┐
         │  POST /approve    │  │ POST /reject    │  │ POST /reject │
         │  (Backend API)    │  │ (Backend API)   │  │              │
         └────────┬──────────┘  └────────┬────────┘  └────────┬─────┘
                  │                      │                     │
        ┌─────────▼──────────────────────┴─────────────────────▼─────────┐
        │              BACKEND PROCESSING                                │
        │  ┌──────────────────────────────────────────────────────────┐  │
        │  │  LoanController.approveLoan() or rejectLoan()           │  │
        │  │  ↓                                                       │  │
        │  │  LoanService.approveLoan() / rejectLoan()               │  │
        │  │  ├─ Set status to APPROVED/REJECTED                    │  │
        │  │  ├─ Set approvalDate / rejectionReason                 │  │
        │  │  ├─ Calculate dates (start/end)                        │  │
        │  │  └─ Save to MongoDB                                     │  │
        │  │  ↓                                                       │  │
        │  │  SMSNotificationService.sendLoan*Notification()         │  │
        │  │  ├─ Create message (async)                             │  │
        │  │  ├─ executorService.execute() [ThreadPool]             │  │
        │  │  └─ Send to SMS API (non-blocking)                     │  │
        │  └──────────────────────────────────────────────────────────┘  │
        └────────────────────────┬──────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   MULTITHREADING        │
                    │   ThreadPool Config     │
                    │  ├─ Core Threads: 10   │
                    │  ├─ Max Threads: 20    │
                    │  ├─ Queue: 100         │
                    │  └─ Timeout: 60s       │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   SEND SMS ASYNC        │
                    │  (Non-blocking)         │
                    │  ├─ Multiple Messages  │
                    │  ├─ In Parallel        │
                    │  └─ Instant Return     │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────▼──────────────────┐
              │  CUSTOMER RECEIVES SMS              │
              │  • Approval Message                 │
              │  • OR                               │
              │  • Rejection Message                │
              │  • With Reason Included             │
              └──────────────────┬──────────────────┘
                                 │


────────────────────────────────── CUSTOMER SIDE ───────────────────────────────


                          ┌─────────────────────────────────┐
                          │   CUSTOMER DASHBOARD LOGIN      │
                          └──────────────┬──────────────────┘
                                         │
                                   [CUSTOMER LOGIN]
                                         │
                          ┌──────────────▼──────────────────┐
                          │  CUSTOMER DASHBOARD             │
                          │  ├─ My Profile                  │
                          │  ├─ Apply for Loan              │
                          │  └─ Loan Status                 │
                          └──────────────┬──────────────────┘
                                         │
                ┌────────────────────────┼────────────────────────┐
                │                        │                        │
                ▼                        ▼                        ▼
       ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
       │  MY PROFILE      │    │ APPLY FOR LOAN   │    │  LOAN STATUS     │
       │                  │    │                  │    │                  │
       │ • First Name     │    │ • Amount         │    │ • Table of Loans │
       │ • Last Name      │    │ • Term           │    │ • Status Badges  │
       │ • Email          │    │ • Purpose        │    │ • Details Button │
       │ • Phone          │    │ • Description    │    │                  │
       │ • Income         │    │ • Calculate EMI  │    │ Status Colors:   │
       │ • Address        │    │ • Submit Form    │    │ ⏳ Yellow (Pending)
       │ • ID Proof       │    │ • Status: PENDING│    │ ✓ Green (Approved)
       │                  │    │ • API: POST /    │    │ ✗ Red (Rejected) │
       │ Read-Only ✓      │    │   loans          │    │                  │
       └──────────────────┘    └────────┬─────────┘    └──────────────────┘
                                        │
                                [Loan Submitted]
                                        │
                                        ▼
                        ┌────────────────────────────────┐
                        │  Loan Appears on Dashboard     │
                        │  • Status: PENDING             │
                        │  • Yellow Badge                │
                        │  • Waiting for Admin Review    │
                        └────────────┬───────────────────┘
                                     │
                          [Admin Approves/Rejects]
                                     │
                    ┌────────────────▼────────────────┐
                    │ CUSTOMER RECEIVES SMS           │
                    │ • Notification appears          │
                    │ • Contains loan details         │
                    │ • Approval or Rejection Message │
                    └────────────┬───────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  DASHBOARD UPDATES      │
                    │  • Refresh Page         │
                    │  • Status Changes to    │
                    │    ├─ APPROVED ✓       │
                    │    │  (Green Badge)    │
                    │    └─ REJECTED ✗       │
                    │       (Red Badge)      │
                    │  • Loan Shows New      │
                    │    Status              │
                    └────────────┬───────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  CUSTOMER VIEWS STATUS │
                    │  All 3 Sections:       │
                    │  1. Profile ✓          │
                    │  2. Apply Loan ✓       │
                    │  3. Loan Status ✓      │
                    │     Shows All Loans    │
                    │     With Statuses      │
                    └────────────────────────┘
```

---

## Detailed Flow - Admin to Customer

```
STEP 1: Admin Create Loan
═════════════════════════════════════════════════════════════════
Admin Dashboard
    ↓ Manage Customers
    ↓ Select Customer: "Faizan Ali"
    ↓ Click: "Create Loan"
    ↓ Modal opens with Customer ID pre-filled
    ↓ Fill: Amount (100,000), Term (12), Purpose (Home)
    ↓ Click: "Create Loan"
    ↓ Backend: POST /api/loans
    ↓ Status Set: PENDING ✓
    ↓ Save to MongoDB
    ↓ Response: Success
    ↓ Admin sees: "✓ Loan created successfully!"


STEP 2: Customer View Profile
═════════════════════════════════════════════════════════════════
Customer Dashboard Login
    ↓ Loaded on: "My Profile" tab (default)
    ↓ Backend: GET /api/customers/{userId}
    ↓ Display:
       • First Name: Faizan ✓
       • Last Name: Ali ✓
       • Email: faizan@example.com ✓
       • Phone: +923001234567 ✓
       • City: Karachi ✓
       • Annual Income: Rs. 500,000 ✓
       • Address: Main Road ✓
       • ID Type: CNIC ✓
       • ID Number: 12345-6789012-3 ✓
    ↓ All fields: Read-only


STEP 3: Customer Apply for Loan
═════════════════════════════════════════════════════════════════
Customer Dashboard
    ↓ Click: "Apply for Loan" tab
    ↓ Form appears with fields:
       • Loan Amount: 50,000
       • Loan Term: 6 months
       • Purpose: Business
       • Description: Personal business
    ↓ Real-time: EMI calculated
    ↓ Click: "Submit Application"
    ↓ Backend: POST /api/loans
    ↓ Status Set: PENDING ✓
    ↓ Application Date: Current timestamp
    ↓ Saved to MongoDB
    ↓ Go to: "Loan Status" tab automatically
    ↓ New loan appears with PENDING status (yellow)


STEP 4: Admin Review Pending Loans
═════════════════════════════════════════════════════════════════
Admin Dashboard
    ↓ Go to: "Manage Loans" section
    ↓ Filter: "PENDING (Awaiting Action)"
    ↓ See 2 loans:
       1. Faizan's created loan (100,000)
       2. Faizan's applied loan (50,000)
    ↓ Click: "Review" on first loan
    ↓ Modal opens showing complete details


STEP 5: Admin Approves Loan
═════════════════════════════════════════════════════════════════
Loan Review Modal
    ↓ Click: "✓ Approve Loan" button
    ↓ Backend: POST /api/loans/{id}/approve
    ↓ Send: {approvedBy, phoneNumber, customerName}
    ↓ Backend Processing:
       • Status: PENDING → APPROVED
       • ApprovalDate: Set to NOW
       • LoanStartDate: Set to NOW
       • LoanEndDate: Calculated (+12 months)
       • ApprovedBy: "Admin User"
       • Save to MongoDB
    ↓ SMS Service (Async ThreadPool):
       • executorService.execute()
       • Create: Approval message
       • Send to SMS API
       • Return immediately (non-blocking)
    ↓ Response to Admin: "✓ Loan approved successfully!"
    ↓ Modal closes
    ↓ Loan removed from PENDING
    ↓ Loan added to APPROVED list


STEP 6: SMS Delivery (Multithreading)
═════════════════════════════════════════════════════════════════
ThreadPool (10 concurrent threads)
    ↓ Queue SMS task
    ↓ Pick available thread
    ↓ Format SMS:
       "Dear Faizan Ali,
        Your loan (ID: 65a1b2...) 
        for ₹100,000 has been APPROVED.
        Visit office for formalities.
        Thank you!"
    ↓ Call SMS API (e.g., Twilio)
    ↓ Send message to: +923001234567
    ↓ SMS delivered to phone
    ↓ Thread released for next task
    ↓ No blocking - admin gets instant response


STEP 7: Customer Receives Notification
═════════════════════════════════════════════════════════════════
Customer Phone
    ↓ SMS arrives: "✓ Loan Approved"
    ↓ Contains: Loan ID, Amount, Approval message
    ↓ Customer sees notification immediately


STEP 8: Customer Dashboard Updates
═════════════════════════════════════════════════════════════════
Customer Dashboard (Auto-refresh or manual refresh)
    ↓ Go to: "Loan Status" tab
    ↓ Loan 1 (100,000): ✓ APPROVED (Green badge)
    ↓ Loan 2 (50,000): ⏳ PENDING (Yellow badge)
    ↓ Both loans visible
    ↓ Status updated correctly
    ↓ Ready for next action


STEP 9: Admin Rejects Another Loan (Similar Process)
═════════════════════════════════════════════════════════════════
Admin Dashboard
    ↓ Go to: "Manage Loans" → Filter "PENDING"
    ↓ Click: "Review" on second pending loan
    ↓ Modal opens
    ↓ Click: "✗ Reject Loan"
    ↓ Reason input appears
    ↓ Admin enters: "Income verification incomplete"
    ↓ Click: "Yes, Reject"
    ↓ Backend: POST /api/loans/{id}/reject
    ↓ Backend Processing:
       • Status: PENDING → REJECTED
       • RejectionReason: "Income verification incomplete"
       • Save to MongoDB
    ↓ SMS Service (Async):
       • Create: Rejection message with reason
       • Send: "Your loan rejected. Reason: Income verification incomplete"
       • Send to SMS API
    ↓ Response: "✗ Loan rejected successfully!"
    ↓ Modal closes
    ↓ Loan removed from PENDING
    ↓ Loan added to REJECTED list


STEP 10: Customer Sees Rejection
═════════════════════════════════════════════════════════════════
Customer Phone
    ↓ SMS arrives: "✗ Loan Rejected"
    ↓ Contains: Loan ID, Rejection reason

Customer Dashboard (Auto-refresh)
    ↓ Go to: "Loan Status" tab
    ↓ Loan 1: ✓ APPROVED (Green)
    ↓ Loan 2: ✗ REJECTED (Red)
    ↓ All statuses updated
    ↓ Complete workflow finished ✓
```

---

## Status Badge Colors

```
Status        Badge    Color      Hex Code    Meaning
───────────────────────────────────────────────────────
PENDING       ⏳       Yellow     #fbbf24     Awaiting Admin Review
APPROVED      ✓        Green      #10b981     Loan Active
REJECTED      ✗        Red        #ef4444     Loan Denied
```

---

## API Endpoints Summary

```
Customer API Calls:
┌─────────────────────────────────────────────────────────────┐
│ GET /api/customers/{userId}        ← Get Profile           │
│ POST /api/loans                    ← Apply for Loan        │
│ GET /api/loans/customer/{userId}   ← View Loan Status      │
└─────────────────────────────────────────────────────────────┘

Admin API Calls:
┌─────────────────────────────────────────────────────────────┐
│ GET /api/customers                 ← View All Customers     │
│ GET /api/customers/{id}            ← Customer Details       │
│ POST /api/loans                    ← Create Loan            │
│ GET /api/loans                     ← View All Loans         │
│ POST /api/loans/{id}/approve       ← Approve Loan           │
│ POST /api/loans/{id}/reject        ← Reject Loan            │
│ GET /api/loans/status/{status}     ← Filter by Status       │
└─────────────────────────────────────────────────────────────┘
```

---

## Complete Workflow Summary

```
┌────────────────────────────────────────────────────────────┐
│                     COMPLETE WORKFLOW                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ✓ Admin Dashboard:                                        │
│    1. View all customers                                  │
│    2. Create loans for customers (PENDING)                │
│    3. Review pending loans                                │
│    4. Approve loans (send SMS)                            │
│    5. Reject loans with reason (send SMS)                 │
│                                                            │
│  ✓ Customer Dashboard:                                     │
│    1. View profile (read-only)                            │
│    2. Apply for loans (PENDING)                           │
│    3. View loan status (all statuses)                     │
│    4. Receive SMS notifications                           │
│    5. See updated status on dashboard                     │
│                                                            │
│  ✓ SMS Notifications:                                      │
│    1. Sent asynchronously (ThreadPool)                    │
│    2. Non-blocking (instant return)                       │
│    3. Concurrent (10 threads)                             │
│    4. Scalable (100 queue capacity)                       │
│                                                            │
│  ✓ Database:                                               │
│    1. Loans stored with PENDING status                    │
│    2. Dates calculated on approval                        │
│    3. Reasons saved on rejection                          │
│    4. All data persisted                                  │
│                                                            │
│  ✓ Status Workflow:                                        │
│    PENDING → APPROVED (Green)                             │
│    PENDING → REJECTED (Red)                               │
│    Status updates in real-time                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

**Status**: ✅ COMPLETE WORKFLOW IMPLEMENTED
**Date**: January 15, 2026
**Version**: 1.0.2

