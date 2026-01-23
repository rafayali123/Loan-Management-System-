# Visual Guide: What Happens in Each Customer Section

## The Three Sections Explained

### 📋 **SECTION 1: MY PROFILE** 
**Purpose:** View Your Personal Information

```
┌──────────────────────────────────────────────────┐
│              MY PROFILE                          │
├──────────────────────────────────────────────────┤
│                                                  │
│  First Name: Faizan              Last Name: Ali │
│  Email: faizan@example.com                       │
│  Phone: 03001234567                             │
│  City: Karachi                                   │
│  Address: 123 Main Street, Karachi              │
│  Annual Income: Rs. 500,000                      │
│  ID Type: CNIC                                   │
│  ID Number: 12345-1234567-1                      │
│                                                  │
│  ℹ️  This information was provided during        │
│      registration and is READ-ONLY              │
│                                                  │
└──────────────────────────────────────────────────┘

BACKEND PROCESS:
  GET /api/customers/{userId}
       ↓
  Fetch from MongoDB customers collection
       ↓
  Display in read-only format
```

---

### 💰 **SECTION 2: APPLY FOR LOAN**
**Purpose:** Submit New Loan Application

```
┌──────────────────────────────────────────────────────┐
│         APPLY FOR LOAN                               │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Requested Amount (Rs.): [_________________]        │
│  Min: Rs. 10,000 | Max: Rs. 50,00,000              │
│                                                      │
│  Loan Term (Months):                                │
│  [ ] 6 months  [ ] 12 months  [ ] 24 months        │
│  [ ] 36 months [ ] 48 months  [ ] 60 months        │
│                                                      │
│  Loan Purpose:                                       │
│  [ ] Personal  [ ] Business  [ ] Education         │
│  [ ] Home      [ ] Vehicle   [ ] Debt              │
│  [ ] Other                                           │
│                                                      │
│  Additional Details (Optional):                      │
│  [_________________________________]                │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Estimated Monthly Payment: Rs. 23,037          │ │
│  │ (Updates as you change amount/term)            │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [SUBMIT APPLICATION]  [CLEAR FORM]                │
│                                                      │
└──────────────────────────────────────────────────────┘

REAL-TIME CALCULATION EXAMPLE:

Amount: 500,000     ────→  Monthly: Rs. 23,037
Term: 24 months           (If term changes to 12)
Rate: 10%           ────→  Monthly: Rs. 45,321
                    (Recalculates instantly!)

SUBMISSION PROCESS:
  1. Fill form
  2. Calculate EMI (in browser)
  3. Validate (all required fields?)
  4. POST /api/loans
  5. Backend processes:
     - Fetch your customer details (name, phone)
     - Calculate monthly installment
     - Save to MongoDB loans collection
  6. Success response
  7. Auto-redirect to Loan Status
```

---

### 📊 **SECTION 3: LOAN STATUS**
**Purpose:** Track All Your Loan Applications

```
BEFORE APPLYING:
┌───────────────────────────────────────────────────────┐
│          LOAN STATUS                                  │
├───────────────────────────────────────────────────────┤
│                                                        │
│  Loan Amount │ Interest │ Term   │ Status │ Date    │
│              │ Rate (%) │ (M)    │        │         │
│──────────────┼──────────┼────────┼────────┼─────────┤
│                                                        │
│          No loan applications yet                    │
│                                                        │
└───────────────────────────────────────────────────────┘

AFTER APPLYING:
┌───────────────────────────────────────────────────────────┐
│          LOAN STATUS                                      │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  Amount     │ Rate │ Term │ Status        │ Date       │  │
│             │ (%)  │ (M)  │               │            │  │
│─────────────┼──────┼──────┼───────────────┼────────────┤  │
│ Rs.500,000  │ 10   │ 24   │ PENDING ⏳   │ 15-Jan-26  │  │
│             │      │      │ (Yellow)      │            │  │
│─────────────┴──────┴──────┴───────────────┴────────────┤  │
│                                                            │
│  💛 PENDING = Waiting for admin review                   │
│                                                            │
└───────────────────────────────────────────────────────────┘

AFTER ADMIN APPROVES:
┌───────────────────────────────────────────────────────────┐
│          LOAN STATUS                                      │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  Amount     │ Rate │ Term │ Status        │ Date       │  │
│             │ (%)  │ (M)  │               │            │  │
│─────────────┼──────┼──────┼───────────────┼────────────┤  │
│ Rs.500,000  │ 10   │ 24   │ APPROVED ✓   │ 15-Jan-26  │  │
│             │      │      │ (Green)       │            │  │
│─────────────┴──────┴──────┴───────────────┴────────────┤  │
│                                                            │
│  🟢 APPROVED = Loan approved! Money coming soon          │
│  📱 SMS sent: "Congrats! Your loan is approved"          │
│                                                            │
└───────────────────────────────────────────────────────────┘

DATA FLOW:
  GET /api/loans/customer/{userId}
       ↓
  Fetch all loans from MongoDB loans collection
  where customerId = your ID
       ↓
  Display in table with status badges
       ↓
  Updates when:
  - You apply for new loan
  - Admin approves/rejects
  - Page is refreshed
```

---

## The Complete Customer Journey

```
┌─────────────────────────────────────┐
│  STEP 1: CUSTOMER LOGS IN           │
│  - Enter username & password        │
│  - Redirects to dashboard           │
└────────────────┬────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────┐
        │  STEP 2: VIEW MY PROFILE        │
        │  - See personal information    │
        │  - Read-only display           │
        │  - Click here first             │
        └────────────┬────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────────┐
        │  STEP 3: APPLY FOR LOAN                 │
        │  - Click "Apply for Loan"               │
        │  - Fill amount, term, purpose          │
        │  - See estimated payment (real-time)  │
        │  - Click "Submit Application"           │
        └────────────┬────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────────┐
        │  BACKEND PROCESSES:                     │
        │  1. Validates your input                │
        │  2. Fetches your customer record        │
        │  3. Calculates monthly payment          │
        │  4. Saves to database                   │
        │  5. Sends success response              │
        └────────────┬────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────────┐
        │  STEP 4: SUCCESS ALERT                  │
        │  - Green message shown                  │
        │  - Form cleared                         │
        │  - Auto-redirect to Loan Status         │
        └────────────┬────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────────┐
        │  STEP 5: VIEW LOAN STATUS               │
        │  - Your new loan appears in table       │
        │  - Status shows PENDING (yellow) ⏳    │
        │  - Amount shows Rs. 500,000            │
        │  - Term shows 24 months                 │
        └────────────┬────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────────┐
        │  ADMIN SIDE (Different Interface)       │
        │  - Admin logs in separately             │
        │  - Views "Manage Loans" section         │
        │  - Sees your application                │
        │  - Reviews your details                 │
        │  - Approves or rejects                  │
        └────────────┬────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
    ┌─────────┐            ┌──────────┐
    │ APPROVED│            │ REJECTED │
    └────┬────┘            └─────┬────┘
         │                       │
         ▼                       ▼
    ┌────────────┐          ┌──────────┐
    │ SMS SENT:  │          │ SMS SENT:│
    │ "Approved" │          │"Rejected"│
    └────┬───────┘          └─────┬────┘
         │                        │
         ▼                        ▼
    ┌──────────────────────────────────────┐
    │  STEP 6: CUSTOMER SEES UPDATE        │
    │  - Refresh Loan Status page          │
    │  - Status now shows APPROVED ✓       │
    │  - Status badge turns green          │
    │  - Or shows REJECTED ✗ (red)         │
    └──────────────────────────────────────┘
```

---

## What Gets Stored in Database

### When Customer Applies for Loan:

```
CUSTOMER RECORD (Already Exists):
{
  _id: "faizan_123",
  firstName: "Faizan",
  lastName: "Ali",
  email: "faizan@example.com",
  phoneNumber: "03001234567",
  annualIncome: 500000,
  city: "Karachi",
  address: "123 Main Street"
}

NEW LOAN RECORD (Created):
{
  _id: "loan_456",
  customerId: "faizan_123",              ← Links to customer
  customerName: "Faizan Ali",             ← Auto-added by backend
  customerPhoneNumber: "03001234567",     ← Auto-added by backend
  loanAmount: 500000,                     ← What customer entered
  loanTerm: 24,                           ← What customer selected
  purpose: "Business",                    ← What customer selected
  description: "Expand business ops",     ← What customer typed
  interestRate: 10,                       ← System default
  monthlyInstallment: 23037,              ← Auto-calculated
  remainingInstallments: 24,              ← Auto-set from term
  status: "PENDING",                      ← Auto-set on creation
  applicationDate: "2026-01-15T01:20Z",   ← Auto-set to now()
  approvalDate: null,                     ← Set when admin approves
  approvedBy: null,                       ← Set when admin approves
  createdAt: "2026-01-15T01:20Z",
  updatedAt: "2026-01-15T01:20Z"
}
```

---

## Status Badges Explained

```
🟡 PENDING (Yellow) = Waiting
   - Admin hasn't reviewed yet
   - Your loan is in queue
   - Wait for admin action

🟢 APPROVED (Green) = Success!
   - Your loan is approved
   - Money coming within 2-3 days
   - SMS confirmation received

🔴 REJECTED (Red) = Not Approved
   - Your loan was rejected
   - You can apply again
   - SMS notification sent
```

---

## The Three Sections at a Glance

| Feature | My Profile | Apply for Loan | Loan Status |
|---------|-----------|-----------------|-------------|
| **Shows** | Personal info | Form for new loan | All your loans |
| **Editable** | NO (read-only) | YES | NO (view-only) |
| **Updated** | On page load | Manual entry | Every refresh |
| **Purpose** | Verify info | Submit loan | Track applications |
| **Data From** | Customer record | Customer input | Loan records |
| **Visible** | Always | Always | Always |

---

## Real Data Example

### My Profile Shows:
```
First Name: Faizan
Last Name: Ali
Email: faizan@example.com
Phone: 03001234567
City: Karachi
Annual Income: Rs. 500,000
ID Type: CNIC
ID: 12345-1234567-1
```

### Apply for Loan Form:
```
Amount: 500,000
Term: 24 months
Purpose: Business
Notes: "Want to expand my business"
Monthly Payment: Rs. 23,037 (calculated instantly)
```

### Loan Status Shows:
```
Amount: Rs. 500,000
Rate: 10%
Term: 24 months
Status: PENDING ⏳
Date: 15-Jan-26
Action: View Details
```

---

## What Happens Behind the Scenes

### When You Submit a Loan:

1. **JavaScript Validation** (In Your Browser)
   - Check amount >= 10,000 ✓
   - Check term selected ✓
   - Check purpose selected ✓

2. **Real-Time Calculation** (In Your Browser)
   - EMI = (500000 × 0.00833 × 1.2707) / 0.2707
   - Monthly Payment = Rs. 23,037

3. **Send to Server** (POST /api/loans)
   - Your form data sent
   - Server receives it

4. **Backend Processing** (LoanService)
   - Fetch your customer record (name, phone)
   - Calculate exact monthly payment
   - Create loan document
   - Save to MongoDB

5. **Response Back** (Your Browser)
   - Success message shown
   - Form cleared
   - Page refreshes
   - Loan appears in Loan Status table

### When Admin Approves:

1. **Admin Actions** (Admin Interface)
   - Logs in as admin
   - Clicks "Manage Loans"
   - Clicks "Review" on your loan
   - Modal shows all your details
   - Clicks "Approve"

2. **Backend Updates** (Loan Service)
   - Status changed to APPROVED
   - Approval date recorded
   - Admin name recorded

3. **Notifications Sent**
   - SMS sent to your phone
   - Database updated
   - Your status changes

4. **You See It** (When you refresh)
   - Loan Status table updated
   - Status now shows APPROVED ✓ (green)
   - SMS confirmation received

---

## Troubleshooting Quick Guide

### Problem: "No loan applications yet" after submitting

**Solution:**
1. Refresh the page (F5)
2. Check if success alert appeared
3. Check browser console (F12) for errors
4. If loan still missing, check MongoDB in admin dashboard

### Problem: Monthly payment shows Rs. 0

**Solution:**
1. Select a different loan term
2. Should update immediately
3. If not, hard refresh (Ctrl+F5)

### Problem: Status not updating after admin approval

**Solution:**
1. Refresh page (F5)
2. Check if SMS was received (means it was approved)
3. Wait a few seconds and refresh again
4. Check if backend logs show errors

### Problem: Can't see my loan in admin panel

**Solution:**
1. Admin must click "Manage Loans" (not Customers)
2. Check if loan status is PENDING
3. Refresh admin page
4. Check if you applied from logged-in account

---

## Summary

✅ **MY PROFILE** = View Your Information (Read-Only)
- Shows: Personal, contact, financial, ID info
- Source: Your registration data
- Purpose: Verify your details are correct

✅ **APPLY FOR LOAN** = Submit New Loan (Editable Form)
- Shows: Form for amount, term, purpose
- Real-time: Monthly payment calculated instantly
- Purpose: Submit loan application to bank

✅ **LOAN STATUS** = Track All Loans (View-Only Table)
- Shows: All your loan applications with status
- Updates: When you apply or admin approves/rejects
- Purpose: Check status and get notifications

