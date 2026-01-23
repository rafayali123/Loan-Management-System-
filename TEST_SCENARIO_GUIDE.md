# Test Scenario: Complete Customer Loan Application Workflow

## System Status ✓
- **Server**: Running on localhost:8080
- **Database**: MongoDB Atlas connected
- **Frontend**: Customer & Admin interfaces ready

---

## Test Scenario: Customer Applies for Loan → Admin Reviews

### Prerequisites
Before starting, ensure:
- ✓ Server is running (localhost:8080)
- ✓ MongoDB connection working
- ✓ At least one customer registered (faizan ali)
- ✓ At least one admin registered

---

## Step-by-Step Test

### **PART 1: CUSTOMER SIDE** 

#### Step 1: Customer Login
```
URL: http://localhost:8080/pages/login.html
Username: faizan ali (or your customer username)
Password: (use your password)
Expected Result:
  ✓ Redirects to /pages/customer-dashboard.html
  ✓ Shows "LMS Customer" sidebar
  ✓ Loads profile data
```

#### Step 2: View My Profile
```
Action: Click "My Profile" in sidebar
Expected Display:
  ✓ First Name: Faizan
  ✓ Last Name: Ali
  ✓ Email: faizan@example.com
  ✓ Phone: 03001234567
  ✓ City: Karachi
  ✓ Address: Showing correctly
  ✓ Annual Income: Shows amount (e.g., 500,000)
  ✓ ID Type: CNIC
  ✓ ID Number: Showing correctly
  
Data Flow:
  Customer Dashboard → Load Profile Section → Fetch from /api/customers/{id}
  → MongoDB customers collection → Display data
```

#### Step 3: Check Loan Status (Before Applying)
```
Action: Click "Loan Status" in sidebar
Expected Display:
  ✓ Table shown with columns:
    - Loan Amount | Interest Rate (%) | Term (Months) | Status | Application Date | Action
  ✓ Message: "No loan applications yet"
  
Data Flow:
  Request: GET /api/loans/customer/faizan_id
  Response: Empty array []
  Display: "No loan applications yet" message
```

#### Step 4: Apply for Loan
```
Action: Click "Apply for Loan" in sidebar
Expected Form Display:
  ✓ Requested Amount (Rs.) input field
    Constraints: Min 10,000, Max 5,000,000
  ✓ Loan Term dropdown with options: 6, 12, 24, 36, 48, 60 months
  ✓ Loan Purpose dropdown with: Personal, Business, Education, Home, Vehicle, etc.
  ✓ Additional Details textarea (optional)
  ✓ Estimated Monthly Payment display (initially shows Rs. 0)
  ✓ Submit Application button
  ✓ Clear Form button

Real-Time Test:
  1. Enter Amount: 500000
  2. Select Term: 24 months
  3. Watch "Estimated Monthly Payment" update to: Rs. 23,037
  
  If Term changes to 12 months:
  4. Monthly Payment should update to: Rs. 45,321 (instantly)
  
  This tests real-time EMI calculation!
```

#### Step 5: Fill Form and Submit
```
Form Input:
  Requested Amount (Rs.): 500000
  Loan Term (Months): 24
  Loan Purpose: Business
  Additional Details: "Want to expand my business operations"
  Estimated Monthly Payment: Rs. 23,037

Click: "Submit Application"

Expected Result:
  ✓ Green success alert appears:
    "✓ Your loan application has been submitted successfully! 
     Our team will review it shortly."
  ✓ Form clears (all fields empty)
  ✓ Monthly Payment resets to "0"
  ✓ Page auto-redirects to "Loan Status" tab after 1.5 seconds
```

#### Step 6: View Loan Status (After Applying)
```
Expected Display in Loan Status Table:
  ┌──────────────────────────────────────────────────────────┐
  │ Loan Amount │ Interest │ Term  │ Status     │ Date       │
  │             │ Rate (%) │ (M)   │            │            │
  ├──────────────┼──────────┼───────┼────────────┼────────────┤
  │ Rs.500,000   │ 10       │ 24    │ PENDING ⏳ │ 15-Jan-26  │
  └──────────────────────────────────────────────────────────┘

Data Verification:
  ✓ Loan Amount shows: Rs. 500,000
  ✓ Interest Rate shows: 10% (or your configured rate)
  ✓ Term shows: 24 months
  ✓ Status shows: PENDING (yellow badge)
  ✓ Date shows: Today's date formatted (15-Jan-26)
  ✓ Action column shows: "View" button (or similar)

Data Flow Behind the Scenes:
  1. POST /api/loans (customer data sent)
  2. LoanService.createLoan() processes:
     - Fetches customer: Faizan Ali, 03001234567
     - Calculates EMI: Rs. 23,037/month
     - Sets status: PENDING
     - Saves to loans collection
  3. Response returns: Loan object with ID
  4. GET /api/loans/customer/faizan_id fetches updated list
  5. Table refreshes showing new loan
```

---

### **PART 2: ADMIN SIDE**

#### Step 7: Admin Login
```
URL: http://localhost:8080/pages/login.html
Username: admin (or your admin username)
Password: (use your password)
Expected Result:
  ✓ Redirects to /pages/dashboard.html
  ✓ Shows "Loan Management System" admin interface
  ✓ Sidebar shows: Dashboard, Customers, Manage Loans, SMS Notifications
```

#### Step 8: Check Customers Section
```
Action: Click "Customers" in admin sidebar
Expected Display:
  ✓ Table of all registered customers
  ✓ Shows: Name, Email, Phone, City, Annual Income, Status
  ✓ Faizan Ali appears in list
  ✓ Can search customers by name
  ✓ Shows "Create Loan" button for each customer

Data Flow:
  GET /api/customers
  → MongoDB customers collection
  → Display in admin table
```

#### Step 9: View Manage Loans Section
```
Action: Click "Manage Loans" in admin sidebar
Expected Display:
  ✓ Table of all loan applications
  ✓ Shows: Customer Name, Phone, Amount, Term, Purpose, Status, Date, Action
  ✓ Faizan's loan appears with:
    - Name: Faizan Ali
    - Phone: 03001234567
    - Amount: Rs. 500,000
    - Term: 24 months
    - Purpose: Business
    - Status: PENDING ⏳
    - Date: 15-Jan-26
    - Action: "Review" button

Data Verification:
  ✓ All loan details display correctly
  ✓ Status badge shows yellow (PENDING)
  ✓ Customer name/phone auto-populated from customer record
  ✓ Amount and term match what customer entered

Data Flow:
  1. GET /api/loans (fetches all loans)
  2. LoanService.getAllLoans()
  3. MongoDB loans collection returns array with:
     - customerId: "faizan_id"
     - customerName: "Faizan Ali" (auto-added by backend)
     - customerPhoneNumber: "03001234567" (auto-added by backend)
     - loanAmount: 500000
     - loanTerm: 24
     - purpose: "Business"
     - status: "PENDING"
     - applicationDate: timestamp
     - monthlyInstallment: 23037
  4. Admin table displays this data
```

#### Step 10: Review Loan Application
```
Action: Click "Review" button next to Faizan's loan
Expected Result:
  ✓ Modal opens (centered on screen)
  ✓ Modal title: "Loan Application Details"
  ✓ Modal displays:

  ┌─────────────────────────────────────────┐
  │ Loan Application Details                │
  ├─────────────────────────────────────────┤
  │ Customer Name: Faizan Ali               │
  │ Phone Number: 03001234567               │
  │ Loan Amount: Rs. 500,000                │
  │ Loan Term: 24 months                    │
  │ Interest Rate: 10% per annum             │
  │ Monthly Installment: Rs. 23,037         │
  │ Loan Purpose: Business                  │
  │ Application Date: 15-Jan-26             │
  │ Annual Income: Rs. 500,000              │
  │ Applicant Notes:                        │
  │ "Want to expand my business operations" │
  │                                         │
  │ [Approve Loan] [Reject Loan] [Close]   │
  └─────────────────────────────────────────┘

Data Verification:
  ✓ All customer details showing correctly
  ✓ All loan details displaying accurately
  ✓ Annual income shown (used for eligibility assessment)
  ✓ Applicant notes/description visible
```

#### Step 11: Approve Loan
```
Action: Click "Approve Loan" button in modal
Expected Result:
  ✓ Loan status updated to: APPROVED ✓
  ✓ Modal closes
  ✓ Table refreshes
  ✓ Faizan's loan now shows:
    - Status: APPROVED ✓ (green badge)
    - Action: "Completed" button (disabled)

Backend Process:
  1. PUT /api/loans/{loanId}
  2. LoanService.approveLoan() processes:
     - Sets status: APPROVED
     - Records approval time
     - Sends SMS to customer

SMS Notification:
  Customer receives SMS:
  "Congratulations! Your loan of Rs. 500,000 has been approved. 
   You will receive the amount within 2-3 business days."

Data Update:
  MongoDB loans collection updates:
  - status: "APPROVED"
  - approvalDate: current timestamp
  - approvedBy: admin name
```

#### Step 12: Verify Loan Status in Table
```
Admin Table Now Shows:
  ┌──────────────────────────────────────────────────────────────┐
  │ Name       │ Phone      │ Amount    │ Term  │ Status  │Action│
  ├─────────────┼────────────┼───────────┼───────┼─────────┼──────┤
  │ Faizan Ali  │ 0300123... │ Rs.500K   │ 24 M  │ APPROVED✓│Compl │
  └──────────────────────────────────────────────────────────────┘

Status Badge: Green (APPROVED ✓)
Action Button: Disabled/Grayed out "Completed"
```

---

### **PART 3: VERIFY CUSTOMER SEES UPDATE**

#### Step 13: Customer Refreshes Loan Status
```
Customer Action: Go back to customer dashboard
URL: http://localhost:8080/pages/customer-dashboard.html

Expected Result:
  ✓ Loan Status section updated
  ✓ Same loan now shows:
    - Amount: Rs. 500,000
    - Rate: 10%
    - Term: 24 months
    - Status: APPROVED ✓ (green badge)
    - Date: 15-Jan-26

Customer Received SMS:
  "Congratulations! Your loan of Rs. 500,000 has been approved. 
   You will receive the amount within 2-3 business days."
```

---

## Test Scenario 2: Rejection

### Alternative: If Admin Clicks "Reject Loan"

```
Step 1: Click "Reject" button in loan review modal

Step 2: Rejection reason might be prompted (if implemented)

Step 3: Expected Results:
  ✓ Loan status changes to: REJECTED ✗
  ✓ Status badge turns red
  ✓ Action button shows "Completed" (disabled)

Step 4: Customer Notification:
  SMS sent to customer:
  "Unfortunately, your loan application could not be approved 
   at this time. Please contact us for more details."

Step 5: Customer sees in their Loan Status:
  - Status: REJECTED ✗ (red badge)
```

---

## Test Scenario 3: Multiple Loans

### Customer Applies for Multiple Loans

```
Scenario: Faizan applies for 3 loans

Loan 1: Business - Rs. 500,000 - 24 months - PENDING
Loan 2: Home - Rs. 2,000,000 - 60 months - PENDING
Loan 3: Personal - Rs. 100,000 - 12 months - APPROVED

Expected Display in Customer's Loan Status:
  ┌─────────────────────────────────────────────────────┐
  │ Amount      │ Rate │ Term │ Status        │ Date    │
  ├─────────────┼──────┼──────┼───────────────┼─────────┤
  │ Rs. 500,000 │ 10   │ 24   │ PENDING ⏳    │ 15-Jan  │
  │ Rs. 2,000K  │ 10   │ 60   │ PENDING ⏳    │ 15-Jan  │
  │ Rs. 100,000 │ 10   │ 12   │ APPROVED ✓    │ 15-Jan  │
  └─────────────────────────────────────────────────────┘

Expected Display in Admin's Manage Loans:
  Same loans visible with all customers' loans mixed in
  Can search/filter by customer name to see Faizan's loans
```

---

## Data Validation Checklist

### Verify Loan Data in MongoDB

```javascript
// Open MongoDB Compass or Atlas Dashboard
// Connect to: cluster0.4vvrwmj.mongodb.net
// Database: loan_management_db
// Collection: loans

// Expected document for Faizan's loan:
{
  "_id": ObjectId("..."),
  "customerId": "5f4d...xyz",
  "customerName": "Faizan Ali",           ← Auto-populated by backend
  "customerPhoneNumber": "03001234567",   ← Auto-populated by backend
  "loanAmount": 500000,
  "interestRate": 10,
  "loanTerm": 24,
  "purpose": "Business",
  "status": "PENDING" or "APPROVED",      ← Changes based on admin action
  "monthlyInstallment": 23037,             ← Auto-calculated by backend
  "remainingInstallments": 24,
  "description": "Want to expand my business operations",
  "applicationDate": ISODate("2026-01-15T01:20:00.000Z"),
  "approvalDate": null or ISODate("2026-01-15T01:25:00.000Z"),
  "approvedBy": null or "admin_name",
  "createdAt": ISODate("2026-01-15T01:20:00.000Z"),
  "updatedAt": ISODate("2026-01-15T01:20:00.000Z")
}

// Verify in customers collection:
{
  "_id": ObjectId("5f4d...xyz"),
  "firstName": "Faizan",
  "lastName": "Ali",
  "email": "faizan@example.com",
  "phoneNumber": "03001234567",
  "annualIncome": 500000,
  "city": "Karachi",
  "address": "123 Main Street",
  "idProofType": "CNIC",
  "idProofNumber": "12345-1234567-1"
}
```

---

## API Calls During Test

### Network Tab (F12 → Network) Should Show:

**Customer Side:**
```
1. POST /api/auth/login (customer login)
   ✓ Returns: { userId, userName, userType: "CUSTOMER" }

2. GET /api/customers/{id} (load profile)
   ✓ Returns: Customer document with all personal details

3. GET /api/loans/customer/{id} (load loan status initially)
   ✓ Returns: [] (empty array - no loans yet)

4. POST /api/loans (submit application)
   ✓ Request body: { customerId, loanAmount, loanTerm, purpose, description, ...}
   ✓ Returns: { id, customerName, monthlyInstallment, status: "PENDING", ... }

5. GET /api/loans/customer/{id} (refresh after submission)
   ✓ Returns: [{ loan1 with PENDING status }]
```

**Admin Side:**
```
1. POST /api/auth/login (admin login)
   ✓ Returns: { userId, userName, userType: "ADMIN" }

2. GET /api/customers (load customers list)
   ✓ Returns: [ { customer1 }, { customer2 }, ... ]

3. GET /api/loans (load all loans)
   ✓ Returns: [ { loan1 with PENDING }, { loan2 }, ... ]

4. PUT /api/loans/{id} (approve/reject loan)
   ✓ Request body: { status: "APPROVED" or "REJECTED", approvedBy, ... }
   ✓ Returns: Updated loan document

5. SMS notification API call (async)
   ✓ POST to SMS provider (SMS notification sent)
```

---

## Success Indicators ✓

### Customer Interface:
- ✓ Profile section shows all information correctly
- ✓ Loan application form accepts all inputs
- ✓ Monthly payment calculates in real-time
- ✓ Submission succeeds with green success message
- ✓ Loan appears in Loan Status table immediately after
- ✓ Status shows "PENDING" (yellow badge)
- ✓ Status updates to "APPROVED" or "REJECTED" after admin action
- ✓ Customer receives SMS notification

### Admin Interface:
- ✓ Customers section shows all registered customers
- ✓ Manage Loans section shows all pending loans
- ✓ Customer details auto-populated (name, phone from loan record)
- ✓ Clicking "Review" shows complete loan details in modal
- ✓ Modal displays centered properly
- ✓ Approve/Reject buttons work
- ✓ Status updates in table after action
- ✓ SMS sent to customer upon approval/rejection

### Database:
- ✓ Customer record exists in MongoDB
- ✓ Loan record created with all fields populated
- ✓ customerName and customerPhoneNumber auto-added
- ✓ monthlyInstallment calculated correctly
- ✓ Status changes when admin approves/rejects
- ✓ Timestamps recorded correctly

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Loan doesn't appear in admin table | Loan not saved to DB | Check backend console for errors |
| Customer name shows "Unknown" in admin | CustomerName field empty | Refresh page, check if customer exists |
| Monthly payment shows 0 | Calculation not triggered | Select different term, should update |
| Status doesn't update | Page not refreshed | F5 to refresh, or wait a moment |
| Modal doesn't open | JavaScript error | F12 → Console check for errors |
| SMS not sent | SMS service not configured | Check SMS API credentials in .env |

---

## Complete Test Time Estimate
- Setup: 5 minutes
- Customer registration (if needed): 5 minutes
- Customer apply for loan: 3 minutes
- Admin review & approval: 2 minutes
- Verification: 5 minutes
- **Total: ~20 minutes**

