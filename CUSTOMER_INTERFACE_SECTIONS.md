# Customer Interface - Section Details & Workflow

## What You See in the Screenshot:

The customer is logged in as **"faizan ali"** and the interface shows:
- Left sidebar with 3 menu options
- Top header showing page title and profile
- Main content area showing the current section

---

## 1️⃣ **MY PROFILE** - What It Does

### Screen Display:
```
┌─────────────────────────────────────────────────────┐
│ My Profile                                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  First Name: Faizan              Last Name: Ali    │
│  Email: faizan@example.com       Phone: 0300...    │
│  City: Karachi                   Income: 500,000   │
│  Address: 123 Main Street                           │
│  ID Type: CNIC                   ID: 12345-...     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Features:
✓ **Read-Only** - Information cannot be edited here
✓ **Auto-Loaded** - Data fetched from customer registration
✓ **Shows Financial Info** - Annual income used for loan eligibility
✓ **Shows ID Details** - For verification purposes

### Backend Process:
```
GET /api/customers/{customerId}
      ↓
Fetch from MongoDB customers collection
      ↓
Display in profile section
```

---

## 2️⃣ **APPLY FOR LOAN** - What It Does

### Screen Display:
```
┌──────────────────────────────────────────────────────────┐
│ Apply for Loan                                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Requested Amount (Rs.): [_____________]                 │
│  Min: Rs. 10,000 | Max: Rs. 50,00,000                   │
│                                                           │
│  Loan Term (Months): [Select Duration ▼]                │
│  - 6, 12, 24, 36, 48, 60 months                         │
│                                                           │
│  Loan Purpose: [Select Purpose ▼]                        │
│  - Personal, Business, Education, Home, Vehicle, etc.   │
│                                                           │
│  Additional Details (Optional): [________________]        │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Estimated Monthly Payment: Rs. [23,037]            │  │
│  │ (Based on standard interest rate 10% p.a.)         │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  [ Submit Application ]  [ Clear Form ]                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### What Happens When You Submit:

**Step 1: Validation**
```
✓ Amount >= Rs. 10,000? YES
✓ Term selected? YES
✓ Purpose selected? YES
✓ Description (optional) filled? NO PROBLEM
```

**Step 2: Monthly Payment Calculated**
- Uses EMI Formula
- Amount: Rs. 500,000
- Term: 24 months
- Rate: 10% per annum
- Result: Rs. 23,037/month

**Step 3: Loan Data Created**
```javascript
{
  customerId: "faizan_id_12345",
  customerName: "Faizan Ali",              ← Auto-added from profile
  customerPhoneNumber: "03001234567",      ← Auto-added from profile
  loanAmount: 500000,
  loanTerm: 24,
  purpose: "Business",
  description: "Want to expand my business",
  status: "PENDING",
  interestRate: 10,
  monthlyInstallment: 23037,               ← Auto-calculated
  applicationDate: "2026-01-15T01:20:00Z"
}
```

**Step 4: Sent to Backend**
```
POST /api/loans
Content-Type: application/json
Body: { loan data above }
```

**Step 5: Backend Saves to MongoDB**
```
LoanService.createLoan()
  ├─ Fetch customer details ✓
  ├─ Calculate monthly installment ✓
  ├─ Set status to PENDING ✓
  └─ Save to loans collection ✓
```

**Step 6: Success Feedback**
```
✓ Success alert shown: "Your loan application has been 
  submitted successfully! Our team will review it shortly."
✓ Form cleared
✓ After 1.5 seconds → Auto-redirect to "Loan Status" tab
```

### Real-Time Calculation Example:

As customer types:
```
Amount: 500,000  →  Monthly Payment: Rs. 23,037
Term: 24 months     (updates in real-time)

If customer changes term to 12 months:
Amount: 500,000  →  Monthly Payment: Rs. 45,321
Term: 12 months     (recalculates instantly)
```

---

## 3️⃣ **LOAN STATUS** - What It Does

### Screen Display (Before Any Loan):
```
┌────────────────────────────────────────────────────────┐
│ Loan Status                                            │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Loan Amount │ Interest │ Term (M) │ Status │ App Date │
│              │ Rate (%) │          │        │          │
│──────────────┼──────────┼──────────┼────────┼──────────┤
│                                                         │
│            No loan applications yet                    │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Screen Display (After Applying):
```
┌──────────────────────────────────────────────────────────┐
│ Loan Status                                              │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Amount   │ Rate  │ Term  │ Status      │ Date      │Action│
│          │ (%)   │ (M)   │             │           │      │
│──────────┼───────┼───────┼─────────────┼───────────┼──────┤
│Rs.500,000│  10   │  24   │ PENDING ⏳  │ 15-Jan-26 │View  │
│          │       │       │             │           │      │
└──────────────────────────────────────────────────────────┘
```

### Status Types:

#### 🟡 **PENDING** (Yellow)
- Admin hasn't reviewed yet
- Your loan is in queue
- Wait for admin action

#### 🟢 **APPROVED** (Green)
- Your loan is approved!
- SMS sent with confirmation
- Loan amount will be disbursed

#### 🔴 **REJECTED** (Red)
- Your loan was rejected
- SMS sent with reason
- Can apply again after 30 days

### Data Fetching:
```
GET /api/loans/customer/faizan_id_12345
      ↓
Returns all loans for this customer
      ↓
Display in table with status badges
      ↓
Updates every time you refresh
```

### What Each Column Shows:

| Column | Shows |
|--------|-------|
| **Loan Amount** | How much you borrowed (Rs.) |
| **Interest Rate (%)** | Annual interest (usually 10%) |
| **Term (Months)** | Duration of loan in months |
| **Status** | PENDING/APPROVED/REJECTED |
| **Application Date** | When you applied (DD-Mon-YY) |
| **Action** | View Details button |

---

## Complete Customer Journey - Visual Flow

```
┌─────────────────────────┐
│ 1. CUSTOMER LOGS IN     │
│ Username & Password     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 2. DASHBOARD LOADS      │
│ - Profile section shows │
│ - Sidebar menu visible  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ 3. VIEW MY PROFILE                  │
│ ✓ Click "My Profile"                │
│ ✓ See: Name, Email, Phone, Income   │
│ ✓ This is READ-ONLY info            │
└────────────┬────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ 4. APPLY FOR LOAN                    │
│ ✓ Click "Apply for Loan"             │
│ ✓ Fill form:                         │
│   - Amount: Rs. 500,000              │
│   - Term: 24 months                  │
│   - Purpose: Business                │
│   - Details: "Expand business"       │
│ ✓ See calculated payment: Rs. 23,037 │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ 5. SUBMIT APPLICATION                │
│ ✓ Click "Submit Application"         │
│ ✓ Form validation:                   │
│   - Check amount >= 10,000 ✓         │
│   - Check all fields ✓               │
│ ✓ Send to server                     │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ 6. BACKEND PROCESSING                │
│ - Save to MongoDB                    │
│ - Add customer name (auto)           │
│ - Add customer phone (auto)          │
│ - Calculate installment (auto)       │
│ - Set status = PENDING               │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ 7. SUCCESS NOTIFICATION              │
│ ✓ Green success message shown        │
│ ✓ Form cleared                       │
│ ✓ Auto-redirect to "Loan Status"     │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ 8. VIEW LOAN STATUS                  │
│ ✓ Click "Loan Status"                │
│ ✓ Your new loan appears in table:    │
│   - Amount: Rs. 500,000              │
│   - Term: 24 months                  │
│   - Status: PENDING ⏳               │
│   - Date: 15-Jan-26                  │
│ ✓ Can click "View" for details       │
└────────────┬─────────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ 9. ADMIN REVIEWS (happens in       │
│    admin interface)                │
│ Admin sees your application in     │
│ "Manage Loans" tab                 │
│ Admin clicks "Review" button       │
│ Sees all your details:             │
│ - Name, Phone, Income              │
│ - Amount, Term, Purpose            │
│ - Application details              │
└────────────┬─────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐    ┌──────────┐
│ APPROVED│    │ REJECTED │
└────┬────┘    └─────┬────┘
     │               │
     ▼               ▼
┌──────────────┐ ┌──────────────┐
│ SMS sent:    │ │ SMS sent:    │
│"Congratula-  │ │"Unfortunately│
│ tions! Your  │ │ your loan    │
│ loan of      │ │ could not be │
│ Rs.500,000   │ │ approved"    │
│ is approved" │ │              │
└────┬─────────┘ └──────┬───────┘
     │                  │
     ▼                  ▼
┌────────────────────────────────────┐
│ 10. CUSTOMER CHECKS STATUS         │
│ ✓ Refresh "Loan Status" page       │
│ ✓ Status changed:                  │
│   APPROVED ✓ or REJECTED ✗         │
│ ✓ SMS notification also received   │
└────────────────────────────────────┘
```

---

## Data Flow Summary

```
CUSTOMER INTERFACE          BACKEND                DATABASE (MongoDB)
─────────────────          ───────                ─────────────────

1. Login
   └─→ POST /login  ────→  Authenticate ────→  Check customers collection
                                                    │
2. View Profile          ┌─→ GET /api/customers/{id} ─→ Fetch customer doc
   └─→ Display ←────────┘                         
                                                
3. Fill Loan Form
   └─→ Data entered locally (no server)

4. Submit Loan
   └─→ POST /api/loans ──→  LoanService.createLoan():
                            - Fetch customer details
                            - Calculate installment
                            - Set status = PENDING
                            - Save to loans collection ───→ New loan document
                            └─→ Return success response

5. View Loan Status
   ┌─→ GET /api/loans/customer/{id} ─→ Query loans collection
   │                                     for this customer ID
   └─→ Display all loans in table ←────┘

6. (Admin Views)
   └─→ POST /api/loans/{id}/approve ──→ Update loan status
                                         to APPROVED
                                         SMS sent ───→ loans collection updated
```

---

## Key Points to Remember

### ✅ What Auto-Happens:
- ✓ Customer name added to loan (from profile)
- ✓ Customer phone added to loan (from profile)
- ✓ Monthly payment calculated (real-time)
- ✓ Loan status set to PENDING
- ✓ Application date set automatically
- ✓ Interest rate set to 10%

### ✅ What Customer Provides:
- ✓ Loan amount
- ✓ Loan term (duration)
- ✓ Loan purpose
- ✓ Optional description/details

### ✅ What Admin Does Later:
- ✓ Reviews loan in admin dashboard
- ✓ Sees customer details + loan details
- ✓ Approves or rejects
- ✓ SMS sent to customer

### ✅ What Gets Stored:
- ✓ All loan data in MongoDB `loans` collection
- ✓ Links customer via `customerId`
- ✓ Tracks all status changes
- ✓ Records approval date and approver name

---

## Troubleshooting

### If loan doesn't appear in Loan Status:
1. Refresh the page (F5)
2. Check if submission was successful (check for success message)
3. Check browser console (F12 → Console) for errors
4. Make sure MongoDB connection is working

### If monthly payment calculation is wrong:
1. Refresh page (Ctrl+F5)
2. Check loan amount is correct
3. Check loan term is correct
4. Interest rate should be 10%

### If admin doesn't see the loan:
1. Admin must click "Manage Loans" tab
2. Make sure loan status is "PENDING"
3. Refresh admin page
4. Check if customer ID matches

