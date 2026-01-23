# Customer Workflow Guide - Loan Management System

## Overview
This guide explains the complete customer journey from login to loan application and status tracking.

---

## 1. **MY PROFILE** Section

### What It Shows:
Displays the customer's personal and financial information in **read-only format**:

#### Personal Information:
- **First Name** - Customer's first name
- **Last Name** - Customer's last name
- **Email** - Registered email address
- **Phone** - Contact phone number

#### Address Information:
- **City** - Customer's city
- **Address** - Full residential address
- **Annual Income** - Yearly income (used for loan eligibility)

#### Identification:
- **ID Proof Type** - Type of ID (CNIC, Passport, etc.)
- **ID Proof Number** - ID number

### Where This Data Comes From:
- Populated during customer **registration** (register.html)
- Fetched from MongoDB `customers` collection
- Displayed via `loadProfileData()` function in customer-dashboard.js

### Flow:
```
Registration → Customer Created in DB → Profile Loaded on Dashboard
```

---

## 2. **APPLY FOR LOAN** Section

### What It Does:
Allows customers to submit a new loan application with the following fields:

#### Required Fields (*):
1. **Requested Amount (Rs.)**
   - Minimum: Rs. 10,000
   - Maximum: Rs. 50,00,000
   - Step: Rs. 1,000

2. **Loan Term (Months)**
   - Options: 6, 12, 24, 36, 48, 60 months
   - Affects monthly payment calculation

3. **Loan Purpose**
   - Personal
   - Business
   - Education
   - Home Purchase
   - Vehicle Purchase
   - Debt Consolidation
   - Other

#### Optional Fields:
4. **Additional Details**
   - Textarea for applicant to explain their loan purpose
   - Max 500 characters recommended

#### Real-Time Calculation:
- **Estimated Monthly Payment**: Calculated using EMI formula
  ```
  EMI = (P × r × (1+r)^n) / ((1+r)^n - 1)
  Where:
  - P = Loan Amount
  - r = Monthly Interest Rate (10% annual ÷ 12)
  - n = Number of Months
  ```

### Submission Process:

**Step 1: Validation**
```
✓ Loan amount must be >= Rs. 10,000
✓ Loan term must be selected
✓ Loan purpose must be selected
```

**Step 2: Data Preparation**
```javascript
{
  customerId: "customer_id",
  loanAmount: 500000,
  loanTerm: 24,
  purpose: "Business",
  description: "Want to expand my business",
  status: "PENDING",
  applicationDate: "2026-01-15T...",
  interestRate: 10
}
```

**Step 3: Submission to Backend**
```
POST /api/loans
```

**Step 4: Backend Processing**
1. LoanService receives the request
2. Automatically fetches customer details (name, phone number)
3. Populates loan with:
   - customerName
   - customerPhoneNumber
   - monthlyInstallment (calculated)
   - remainingInstallments
4. Saves to MongoDB `loans` collection
5. Loan status = "PENDING"

**Step 5: Success Feedback**
- Success alert displayed
- Form cleared
- Customer redirected to "Loan Status" section after 1.5 seconds

---

## 3. **LOAN STATUS** Section

### What It Shows:
A table displaying all loan applications submitted by the customer

#### Columns:
| Column | Description |
|--------|-------------|
| **Loan Amount** | Amount requested (Rs.) |
| **Interest Rate (%)** | Annual interest rate |
| **Term (Months)** | Loan duration in months |
| **Status** | PENDING ⏳ / APPROVED ✓ / REJECTED ✗ |
| **Application Date** | Date when loan was applied |
| **Action** | View details button |

### Status Types:

#### 1. **PENDING** (⏳)
- Loan awaiting admin review
- Admin can approve or reject
- Status badge: **Yellow/Warning color**

#### 2. **APPROVED** (✓)
- Loan has been approved by admin
- Customer receives SMS notification
- Status badge: **Green/Success color**

#### 3. **REJECTED** (✗)
- Loan has been rejected by admin
- Customer receives SMS with rejection reason
- Status badge: **Red/Danger color**

### Action Button:
- **View Details** - Click to see complete loan information in a modal

### Data Fetching:
```
GET /api/loans/customer/{customerId}
```

Fetches all loans for the logged-in customer and displays them in real-time.

---

## Complete Customer Workflow

### Workflow Diagram:

```
┌─────────────────────────────────────────────────────────┐
│  CUSTOMER LOGIN                                         │
│  - Username & Password                                  │
│  - Redirects to customer-dashboard.html                │
│  - Loads profile data                                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  VIEW PROFILE (My Profile Tab)                           │
│  - See personal information (read-only)                  │
│  - Annual income displayed                               │
│  - Address and ID information                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  APPLY FOR LOAN (Apply for Loan Tab)                     │
│  - Fill loan amount                                      │
│  - Select loan term                                      │
│  - Select loan purpose                                   │
│  - Add optional description                              │
│  - See estimated monthly payment (real-time)             │
│  - Click "Submit Application"                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  DATA SENT TO BACKEND                                    │
│  - API: POST /api/loans                                  │
│  - Contains all form data                                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  BACKEND PROCESSING (LoanService.createLoan)             │
│  - Validate loan data                                    │
│  - Fetch customer details (name, phone)                  │
│  - Calculate monthly installment                         │
│  - Save to MongoDB loans collection                      │
│  - Status set to "PENDING"                               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  CUSTOMER NOTIFICATION                                   │
│  - Success alert displayed                               │
│  - Form cleared                                          │
│  - Auto-redirect to Loan Status tab                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  VIEW LOAN STATUS (Loan Status Tab)                      │
│  - New application appears in table                      │
│  - Status shows "PENDING ⏳"                              │
│  - Can click "View Details" to see full info             │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
    ┌──────────────┐        ┌─────────────────┐
    │ ADMIN REVIEW │        │ WAITING FOR     │
    │              │        │ ADMIN ACTION    │
    │ Admin sees   │        │                 │
    │ application  │        │ Status remains  │
    │ in "Manage   │        │ "PENDING"       │
    │ Loans" tab   │        │                 │
    └──────────────┘        └─────────────────┘
          │
   ┌──────┴──────┐
   │             │
   ▼             ▼
┌──────┐    ┌──────────┐
│APPROVE│   │ REJECT   │
└───┬──┘    └────┬─────┘
    │            │
    ▼            ▼
┌──────────┐  ┌──────────┐
│ SMS Sent │  │ SMS Sent │
│"Approved"│  │"Rejected"│
└────┬─────┘  └────┬─────┘
     │            │
     ▼            ▼
┌─────────────────────────┐
│  Loan Status Updated    │
│  - Status changes to    │
│    APPROVED/REJECTED    │
│  - Customer can view    │
│    in Loan Status tab   │
└─────────────────────────┘
```

---

## Data Storage & Retrieval

### MongoDB Collections Used:

#### 1. **customers** collection
```javascript
{
  "_id": ObjectId,
  "firstName": "Faizan",
  "lastName": "Ali",
  "email": "faizan@example.com",
  "phoneNumber": "03001234567",
  "password": "hashed_password",
  "city": "Karachi",
  "address": "123 Main Street",
  "annualIncome": 500000,
  "idProofType": "CNIC",
  "idProofNumber": "12345-1234567-1",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

#### 2. **loans** collection
```javascript
{
  "_id": ObjectId,
  "customerId": "customer_id",
  "customerName": "Faizan Ali",        // Auto-populated from customer
  "customerPhoneNumber": "03001234567", // Auto-populated from customer
  "loanAmount": 500000,
  "interestRate": 10,
  "loanTerm": 24,
  "loanType": null,
  "purpose": "Business",
  "status": "PENDING",
  "monthlyInstallment": 23037,          // Auto-calculated
  "remainingInstallments": 24,
  "applicationDate": timestamp,
  "approvalDate": null,
  "loanStartDate": null,
  "loanEndDate": null,
  "description": "Want to expand my business",
  "rejectionReason": null,
  "approvedBy": null,
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

---

## API Endpoints Used

### Customer-Related:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/customers/{id}` | Get customer profile |
| GET | `/api/loans/customer/{customerId}` | Get all loans for customer |

### Loan-Related:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/loans` | Create new loan application |
| GET | `/api/loans` | Get all loans (admin) |
| GET | `/api/loans/{id}` | Get specific loan details |
| PUT | `/api/loans/{id}` | Update loan status |

---

## Key Features

### ✅ Real-Time Calculations
- Monthly payment calculated as customer changes amount/term
- EMI formula used for accurate calculations

### ✅ Form Validation
- Minimum/maximum amount checks
- Required field validation
- Prevents duplicate submissions

### ✅ Auto-Population
- Customer name/phone auto-added to loan (from customer record)
- Monthly installment auto-calculated
- Application date auto-set

### ✅ Status Tracking
- Customer can see all loan applications
- Status updates in real-time
- SMS notifications on approval/rejection

### ✅ Data Persistence
- All data stored in MongoDB Atlas
- Timestamps for audit trail
- Relationship between customer and loans via customerId

---

## Troubleshooting

### Problem: "No loan applications yet" shows even after applying
**Solution:** 
- Check browser console for errors (F12 → Console)
- Verify internet connection
- Try refreshing the page (F5)

### Problem: Monthly payment not updating
**Solution:**
- JavaScript may not be loaded properly
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)

### Problem: Loan doesn't appear in admin interface
**Solution:**
- Make sure admin is viewing "Manage Loans" tab
- Refresh admin page
- Check if loan status is "PENDING"

### Problem: Application submitted but shows error
**Solution:**
- Loan amount must be >= Rs. 10,000
- All required fields must be filled
- Check MongoDB connection in backend logs

---

## Summary

| Section | Purpose | Read-Only | Data Source |
|---------|---------|-----------|-------------|
| **My Profile** | View personal information | Yes | MongoDB customers |
| **Apply for Loan** | Submit new loan application | No | Customer form input |
| **Loan Status** | Track all applications | Yes | MongoDB loans |

**Complete Flow:** Profile View → Loan Application → Submit → Track Status in Table → Admin Review → SMS Notification

