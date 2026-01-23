# Complete System Overview - What Happens in Each Section

---

## Quick Summary of the Three Customer Sections

### 1️⃣ **MY PROFILE** - View Only Information Display

**What You See:**
- Personal details: First name, Last name, Email, Phone
- Location: City, Full address
- Financial: Annual income
- ID: ID type and ID number

**How It Works:**
```
Loaded on Page Start
    ↓
JavaScript calls: GET /api/customers/{customerId}
    ↓
Backend fetches from MongoDB customers collection
    ↓
Data displayed in read-only format
    ↓
Customer CANNOT edit (this is just for viewing)
```

**Data Source:** MongoDB `customers` collection (created during registration)

**Purpose:** Customer can verify their information before applying for loan

---

### 2️⃣ **APPLY FOR LOAN** - Interactive Form for New Loan Application

**What You Do:**
1. Enter loan amount (Rs. 10,000 - 50,00,000)
2. Select loan duration (6/12/24/36/48/60 months)
3. Select loan purpose (Personal/Business/Education/Home/Vehicle/Debt/Other)
4. Optional: Add description/notes
5. See real-time monthly payment calculation
6. Click "Submit Application"

**How It Works - Step by Step:**

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: CUSTOMER FILLS FORM                              │
│ Amount: 500,000                                          │
│ Term: 24 months                                          │
│ Purpose: Business                                        │
│ Description: "Expand business operations"               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 2: REAL-TIME CALCULATION (JavaScript)              │
│ Formula: EMI = (P × r × (1+r)^n) / ((1+r)^n - 1)        │
│ Where: P=500000, r=10%÷12, n=24                         │
│ Result: Rs. 23,037/month shown instantly                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 3: FORM VALIDATION (Before Submission)             │
│ ✓ Amount >= 10,000?                                      │
│ ✓ Term selected?                                         │
│ ✓ Purpose selected?                                      │
│ All good → Proceed to submit                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 4: SEND DATA TO BACKEND (JavaScript)               │
│ POST /api/loans                                          │
│ Body: {                                                 │
│   customerId: "faizan_123",                             │
│   loanAmount: 500000,                                   │
│   loanTerm: 24,                                         │
│   purpose: "Business",                                  │
│   description: "Expand business operations",            │
│   interestRate: 10,                                     │
│   status: "PENDING"                                     │
│ }                                                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 5: BACKEND PROCESSING (LoanService)                │
│ 1. Receive loan data from frontend                      │
│ 2. Validate all fields                                  │
│ 3. Fetch customer from DB:                             │
│    - Name: "Faizan Ali"                                 │
│    - Phone: "03001234567"                               │
│ 4. Calculate monthly installment                        │
│    - Result: 23,037                                     │
│ 5. Create loan document with:                           │
│    - customerId, customerName, customerPhoneNumber      │
│    - loanAmount, loanTerm, purpose, description         │
│    - monthlyInstallment, remainingInstallments          │
│    - status = "PENDING"                                 │
│    - applicationDate = now()                            │
│ 6. Save to MongoDB loans collection                     │
│ 7. Return success response with loan ID                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 6: SUCCESS RESPONSE (Frontend)                     │
│ ✓ Green alert: "Your application submitted successfully"│
│ ✓ Form cleared (all fields reset)                       │
│ ✓ Monthly payment reset to "0"                          │
│ ✓ Auto-redirect to "Loan Status" tab after 1.5 sec    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ RESULT IN DATABASE                                       │
│ MongoDB loans collection:                               │
│ {                                                       │
│   _id: ObjectId("..."),                                 │
│   customerId: "faizan_123",                             │
│   customerName: "Faizan Ali",    ← Auto-added           │
│   customerPhoneNumber: "03001234567", ← Auto-added      │
│   loanAmount: 500000,                                   │
│   loanTerm: 24,                                         │
│   purpose: "Business",                                  │
│   description: "Expand business operations",            │
│   interestRate: 10,                                     │
│   monthlyInstallment: 23037,     ← Auto-calculated      │
│   remainingInstallments: 24,                            │
│   status: "PENDING",                                    │
│   applicationDate: "2026-01-15T...",                    │
│   createdAt: "2026-01-15T...",                          │
│   updatedAt: "2026-01-15T..."                           │
│ }                                                        │
└─────────────────────────────────────────────────────────┘
```

**Data Flow Diagram:**
```
Customer Form                          Backend                    Database
    │                                   │                            │
    ├─ Fill Amount, Term, Purpose       │                            │
    │                                   │                            │
    ├─ Calculate EMI (real-time)        │                            │
    │                                   │                            │
    ├─ Validate Form                    │                            │
    │                                   │                            │
    ├─ POST /api/loans ─────────────────→ Receive Loan Data          │
    │                                   │                            │
    │                                   ├─ Fetch Customer Details    │
    │                                   │         (Name, Phone)      │
    │                                   ├─ Calculate Installment     │
    │                                   ├─ Build Loan Document       │
    │                                   │                            │
    │                                   ├─ Save to Loans ───────────→ New Loan
    │                                   │         Collection         Document
    │                                   │                            │
    │ ← Response with Loan ID ──────────┤                            │
    │                                   │                            │
    ├─ Show Success Alert               │                            │
    ├─ Clear Form                       │                            │
    └─ Refresh Loan Status              │                            │
```

---

### 3️⃣ **LOAN STATUS** - View All Your Applications & Track Status

**What You See:**
- Table of all your loan applications
- For each loan: Amount, Interest Rate, Duration, Status, Date
- Status indicator: 
  - 🟡 PENDING (waiting for admin review)
  - 🟢 APPROVED (approved and disbursement soon)
  - 🔴 REJECTED (not approved, can reapply)

**How It Works:**

```
FIRST TIME (Before applying):
    ↓
GET /api/loans/customer/faizan_123 → Returns: []
    ↓
Display: "No loan applications yet"

───────────────────────────────────────────────────

AFTER APPLYING:
    ↓
GET /api/loans/customer/faizan_123 → Returns: [{ loan1 }, { loan2 }, ...]
    ↓
Display: Table with all loans
    ├─ Loan 1: Rs. 500,000 | 24 months | PENDING ⏳
    ├─ Loan 2: Rs. 100,000 | 12 months | APPROVED ✓
    └─ Loan 3: Rs. 2,000,000 | 60 months | REJECTED ✗

───────────────────────────────────────────────────

WHEN ADMIN APPROVES:
    ↓
Backend: PUT /api/loans/{loanId} → Status updated
    ↓
SMS Sent: "Congratulations! Loan approved"
    ↓
Database: Loan document status changed to "APPROVED"
    ↓
Frontend: GET /api/loans/customer/faizan_123 (refreshes)
    ↓
Table Updates: Status badge changes to green APPROVED ✓
```

**Status Updates Timeline:**

```
Time 01:20 → Customer Applies
  Status: PENDING ⏳

Time 01:25 → Admin Reviews & Approves
  Backend: Status changed to APPROVED
  SMS Sent: Approval notification
  Database: Updated
  
Time 01:26 → Customer Refreshes Page
  Frontend: Calls GET /api/loans/customer/{id}
  Table Shows: Status now APPROVED ✓ (green)
```

---

## How Admin Sees This Data

### Admin Customers Section
```
Admin Sees All Customers:
GET /api/customers
    ↓
Returns: [
  { Faizan Ali, 03001234567, Karachi, 500,000 income },
  { Ahmed Khan, 03002345678, Islamabad, 800,000 income },
  { Fatima Hassan, 03003456789, Lahore, 600,000 income }
]
    ↓
Admin Table Shows: Name, Phone, City, Income, Status
```

### Admin Manage Loans Section
```
Admin Sees All Loans:
GET /api/loans
    ↓
Returns: [
  {
    customerId: "faizan_123",
    customerName: "Faizan Ali",        ← Auto from backend
    customerPhoneNumber: "03001234567", ← Auto from backend
    loanAmount: 500000,
    loanTerm: 24,
    purpose: "Business",
    status: "PENDING",
    applicationDate: "2026-01-15T01:20:00Z",
    monthlyInstallment: 23037,
    annualIncome: 500000 (from customer record)
  },
  { Another loan... },
  { Another loan... }
]
    ↓
Admin Table Shows: 
  Customer | Phone | Amount | Term | Purpose | Status | Date | Action
  Faizan   | ...   | 500K   | 24M  | Business| PENDING| 15Jan| Review
```

### When Admin Clicks "Review"
```
Admin Action: Click "Review" button
    ↓
Modal Opens with All Details:
  ├─ Customer Name: Faizan Ali
  ├─ Phone: 03001234567
  ├─ Loan Amount: Rs. 500,000
  ├─ Term: 24 months
  ├─ Interest Rate: 10% p.a.
  ├─ Monthly Payment: Rs. 23,037
  ├─ Purpose: Business
  ├─ Application Date: 15-Jan-26
  ├─ Annual Income: Rs. 500,000
  ├─ Applicant Notes: "Expand business operations"
  └─ Buttons: [Approve] [Reject] [Close]
    ↓
Admin Clicks: "Approve Loan"
    ↓
Backend: PUT /api/loans/{loanId}
  Updates: status = "APPROVED"
    ↓
SMS Sent to Customer: "Approved! Rs. 500,000 loan approved"
    ↓
Database Updated:
  - status: "APPROVED"
  - approvalDate: now()
  - approvedBy: admin name
    ↓
Admin Table Refreshes:
  - Status badge turns green ✓ APPROVED
  - Action button disabled
```

---

## Complete Data Journey

```
CUSTOMER                          BACKEND API                      DATABASE
────────                          ───────────                      ────────

1. LOGIN
  ├─ Username: faizan ali    →  POST /api/auth/login        →  Check admins/
  └─ Password: ****             (or customers depending           customers
                                on user type)                    collections
                                                              ↓
                                                         Returns user data

2. DASHBOARD LOADS
  ├─ Fetch profile       →  GET /api/customers/{id}       →  customers
  ├─ Load loan status    →  GET /api/loans/customer/{id}  →  loans
  │                                                          (filtered by
  └─ Display data        ←─────── Returns data ────────────── customerId)

3. APPLY FOR LOAN
  ├─ Fill form (local)
  ├─ Calculate EMI (local)
  │
  ├─ Submit              →  POST /api/loans                →  LoanService:
  │                                                          1. Fetch customer
  │                                                          2. Calculate EMI
  │                                                          3. Save to loans
  │                                                             collection
  │
  ├─ Success response    ←───── Returns {                ←──
  │                      loan with ID, status:PENDING}
  │
  └─ Refresh list        →  GET /api/loans/customer/{id}  →  Returns all
                                                               customer's loans
                                                           (now shows new one)

4. ADMIN REVIEWS
  ├─ View loans list     →  GET /api/loans                →  Returns all
  │                                                          loans from DB
  │
  ├─ Click "Review"      →  Modal shows details from      (uses data from
  │                         the loan object already          loans collection)
  │                         fetched
  │
  └─ Click "Approve"     →  PUT /api/loans/{id}           →  Update status
                            (also triggers SMS)              to APPROVED
                                                          ↓
                                                      Updates loan doc:
                                                      - status: APPROVED
                                                      - approvalDate
                                                      - approvedBy

5. CUSTOMER SEES UPDATE
  ├─ Refresh page        →  GET /api/loans/customer/{id}  →  Returns updated
  │                                                          list with status
  │                                                          = APPROVED
  │
  └─ See new status      ←────── Returns loan with ───────
                              status: APPROVED ✓
```

---

## Key Points to Remember

### ✅ Automatic Backend Processes (Customer Doesn't See)
1. **Customer Name & Phone Auto-Added to Loan**
   - When loan created, backend fetches from customer record
   - Stored in loan document for quick admin access
   - No need for customer to re-enter

2. **Monthly Installment Auto-Calculated**
   - Using EMI formula: (P × r × (1+r)^n) / ((1+r)^n - 1)
   - Stored in loan document
   - Used for loan tracking and repayment planning

3. **Status Auto-Set to PENDING**
   - Every new loan starts as PENDING
   - Waits for admin review
   - Can change to APPROVED or REJECTED

4. **Timestamps Auto-Set**
   - applicationDate: When customer applies
   - approvalDate: When admin approves
   - createdAt/updatedAt: Record management

### ✅ Real-Time Features (Customer Sees Instantly)
1. **Monthly Payment Calculation**
   - Updates as customer changes amount or term
   - Formula calculated in browser (JavaScript)
   - No server delay

2. **Form Validation**
   - Checks before submission
   - Shows error messages
   - Prevents invalid submissions

3. **Success Feedback**
   - Green alert on success
   - Red alert on errors
   - Auto-redirect to next section

### ✅ Status Updates
- **PENDING** - Waiting for admin review (yellow)
- **APPROVED** - Admin approved, money coming soon (green)
- **REJECTED** - Admin rejected, can reapply (red)

---

## Summary Table

| Section | Shows | Editable | Source | Refresh |
|---------|-------|----------|--------|---------|
| **My Profile** | Personal info | No | Customer record | Auto on load |
| **Apply for Loan** | Form for new loan | Yes | Customer input | Manual entry |
| **Loan Status** | All applications | No | Loan records | GET on page load |

| Admin Feature | Shows | Source | Action |
|---------------|-------|--------|--------|
| **Customers** | All customers | Customer records | View profiles |
| **Manage Loans** | All loans | Loan records (with customer details auto-added) | Review/Approve/Reject |

---

## API Reference Summary

**Customer APIs:**
```
GET /api/customers/{id}              - Get profile
GET /api/loans/customer/{customerId} - Get my loans
POST /api/loans                       - Apply for loan
```

**Admin APIs:**
```
GET /api/customers                   - Get all customers
GET /api/loans                        - Get all loans
GET /api/loans/{id}                   - Get loan details
PUT /api/loans/{id}                   - Approve/Reject loan
POST /api/loans/{id}/approve          - Send approval
```

---

## System Health Check

✅ **If everything is working:**
- ✓ Customer can apply for loan and see it in Loan Status
- ✓ Admin can see customer's loan in Manage Loans
- ✓ Admin can approve/reject and customer sees update
- ✓ SMS notifications sent to customer
- ✓ Data persists in MongoDB
- ✓ No errors in browser console (F12)

🔴 **If something isn't working:**
- ❌ Check browser console (F12 → Console)
- ❌ Check MongoDB connection in backend logs
- ❌ Verify all required fields in forms
- ❌ Check if servers are running (backend on 8080)
- ❌ Clear browser cache (Ctrl+Shift+Delete)

