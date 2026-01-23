# 📋 Customer Flow - Step-by-Step Procedures

## 1️⃣ Customer Registration (Apna Account Banao)

### Procedure:
```
Step 1: Open Browser
├─ URL: http://localhost:8080/pages/register.html
└─ Page loads with registration form

Step 2: Fill Registration Form
├─ First Name: [Rajesh]
├─ Last Name: [Kumar]
├─ Email: [rajesh@gmail.com]
├─ Phone: [+919876543210]
├─ Password: [MySecure@Pass123]
│  └─ Password Strength: STRONG ✓
├─ Confirm Password: [MySecure@Pass123]
└─ All fields marked with * are required

Step 3: Validate Form
├─ System checks:
│  ├─ Email not already registered
│  ├─ Username unique
│  ├─ Password strong (min 6 chars)
│  ├─ Passwords match
│  └─ Phone number valid
├─ If error:
│  └─ Red message below field
├─ If valid:
│  └─ Proceed to next step

Step 4: Submit
├─ Click [Register] button
├─ Loading spinner shows
└─ Wait 2-3 seconds

Step 5: Success
├─ Green message: "✓ Account Created!"
├─ 2 seconds delay
├─ Auto-redirect to Login page
└─ Account saved in MongoDB

Step 6: Login
├─ Email: rajesh@gmail.com
├─ Password: MySecure@Pass123
├─ Click [Login]
└─ Redirect to Customer Dashboard
```

---

## 2️⃣ Customer Login (Account Kholao)

### Procedure:
```
Step 1: Open Login Page
├─ URL: http://localhost:8080/pages/login.html
└─ See login form

Step 2: Enter Credentials
├─ Email/Username: [rajesh@gmail.com]
└─ Password: [MySecure@Pass123]

Step 3: Click Login
├─ System verifies credentials
├─ Check MongoDB customers collection
├─ Validate password
└─ Create session

Step 4: Success
├─ Session token saved
├─ Redirect to Dashboard
└─ Welcome message: "Welcome, Rajesh Kumar!"

Step 5: Dashboard
├─ See profile info
├─ See active loans
├─ See quick stats
└─ Ready to apply loan
```

---

## 3️⃣ Apply for Loan (Loan Apply Karo)

### Procedure:
```
Step 1: Click [Apply Loan]
├─ On Dashboard
├─ Or in Loans section
└─ Loan form opens

Step 2: Select Loan Type
├─ Personal Loan
│  └─ Best for: Personal needs
├─ Home Loan
│  └─ Best for: Property purchase
├─ Business Loan
│  └─ Best for: Business expansion
└─ Education Loan
   └─ Best for: Education expenses

Step 3: Fill Personal Details
├─ First Name: Auto-filled
├─ Last Name: Auto-filled
├─ Email: Auto-filled
├─ Phone: Auto-filled
└─ Employment Type: [Select]

Step 4: Fill Loan Details
├─ Loan Amount: [₹1,00,000]
├─ Loan Purpose: [Car Purchase]
├─ Desired Loan Term: [24 months]
├─ Interest Rate: [10% p.a.]
│  └─ Can vary based on profile
└─ Monthly Payment (auto-calculated): ₹4,640

Step 5: Upload Documents
├─ ID Proof: [Choose File]
├─ Address Proof: [Choose File]
├─ Income Proof: [Choose File]
└─ Bank Statement: [Choose File]

Step 6: Review EMI
├─ Loan Amount: ₹1,00,000
├─ Interest Rate: 10%
├─ Loan Term: 24 months
├─ Monthly Payment: ₹4,640
├─ Total Interest: ₹11,360
└─ Total Payable: ₹1,11,360

Step 7: Submit
├─ Click [Apply Loan]
├─ Loading...
└─ Saving to MongoDB

Step 8: Confirmation
├─ Green message: "✓ Application Submitted!"
├─ Loan ID: LOAN123
├─ Status: PENDING
└─ SMS: "Application received. Review in 24 hours"

Step 9: Check Status
├─ Go to: My Loans
├─ See: LOAN123 - PENDING
└─ Admin reviewing...
```

---

## 4️⃣ Admin Approval Process (Admin Ka Kaam)

### Procedure:
```
Step 1: Admin Login
├─ Email: admin@lms.com
├─ Password: admin123
└─ See Admin Dashboard

Step 2: Find Pending Loans
├─ Go to: Loans Section
├─ Filter: [Pending]
├─ See: All pending applications
└─ Find: Rajesh Kumar - ₹1,00,000

Step 3: Review Application
├─ Click: View/Expand Loan
├─ See:
│  ├─ Customer Name
│  ├─ Loan Amount
│  ├─ Loan Type
│  ├─ Purpose
│  ├─ Income Details
│  ├─ Employment Status
│  └─ Uploaded Documents
├─ Check documents
├─ Verify income
└─ Verify employment

Step 4: Make Decision
├─ Option A: APPROVE
│  │
│  ├─ Click [Approve]
│  ├─ Confirmation dialog appears
│  ├─ Review loan details
│  ├─ Click OK
│  ├─ Status changes: PENDING → APPROVED
│  ├─ EMI Calculated: ₹4,640/month
│  ├─ Loan period set: 24 months
│  ├─ SMS sent to customer
│  └─ Email sent with loan details
│
└─ Option B: REJECT
   │
   ├─ Click [Reject]
   ├─ Enter reason:
   │  └─ "Income verification pending"
   ├─ Click OK
   ├─ Status changes: PENDING → REJECTED
   ├─ SMS sent with reason
   └─ Email sent explaining rejection

Step 5: Dashboard Update
├─ Admin sees:
│  ├─ Updated loan status
│  ├─ Analytics refresh
│  └─ New loan count
└─ Customer receives notification
```

---

## 5️⃣ Loan Disbursement (Paisa Dena)

### Procedure:
```
Step 1: Loan Approved
├─ Status: APPROVED ✓
├─ Next step: Disbursement
└─ Automatically triggered

Step 2: Bank Transfer
├─ Amount: ₹1,00,000
├─ To: Customer's Bank Account
├─ Method: NEFT/IMPS
├─ Time: 24-48 hours
└─ System automatically initiates

Step 3: SMS Sent
├─ SMS 1: "Loan amount ₹1,00,000 
│          will be transferred.
│          Expect credit in 24-48 hours"
└─ Sent immediately after approval

Step 4: Fund Transfer
├─ Bank processes transfer
├─ Takes 24-48 hours
└─ Money goes to customer's account

Step 5: Money Received
├─ Customer gets notification from bank
├─ SMS 2: "✓ ₹1,00,000 credited
│         to your account"
└─ Customer sees in bank app

Step 6: System Update
├─ Dashboard shows:
│  ├─ Disbursement Status: COMPLETED ✓
│  ├─ Amount: ₹1,00,000
│  ├─ Date: 2026-02-08
│  └─ Next: Repayment starts
└─ Email: "Loan disbursed successfully"
```

---

## 6️⃣ Monthly Repayment Cycle (Har Mahine Payment)

### Procedure:

#### Day 1-9: Waiting Period
```
Step 1: Payment Schedule Created
├─ Loan Amount: ₹1,00,000
├─ Monthly Payment: ₹4,640
├─ Total Months: 24
└─ Payment created for each month

Step 2: Payment Details
├─ Payment ID: REP0001
├─ Loan ID: LOAN123
├─ Due Date: 12-Feb-2026
├─ Amount: ₹4,640
└─ Status: DUE

Step 3: Customer Receives Schedule
├─ Email: "Repayment schedule attached"
├─ SMS: "Monthly payment ₹4,640 from 12-Feb"
└─ Dashboard: Shows payment calendar
```

#### Day 9 (3 Days Before Due Date): Reminder
```
Step 1: System Auto-Triggers Reminder
├─ Current Date: 9-Feb-2026
├─ Due Date: 12-Feb-2026
├─ Days Left: 3
└─ SMS sent to customer

Step 2: Reminder SMS
├─ Message: "Reminder: ₹4,640 due on 12-Feb-2026.
│           Pay on time to avoid penalties.
│           Pay here: [Link to payment]"
└─ Sent to: +919876543210

Step 3: Customer Sees
├─ SMS notification
├─ Dashboard notification
├─ Email (optional)
└─ Takes action: Pay online or prepare payment
```

#### Day 12 (Due Date): Payment Due
```
Step 1: Due Date Arrives
├─ Current Date: 12-Feb-2026
├─ Status: DUE
└─ Amount: ₹4,640

Step 2: SMS Sent
├─ Message: "Payment due today! ₹4,640.
│           Please pay to avoid late fees.
│           Account: [Bank details]"
└─ Early morning (e.g., 6 AM)

Step 3: Customer Pays
├─ Option A: Online Banking
│  ├─ Open bank app
│  ├─ Transfer ₹4,640
│  └─ Confirmation received
├─ Option B: UPI
│  ├─ Open UPI app
│  ├─ Pay ₹4,640
│  └─ Confirmation received
└─ Option C: Bank Transfer
   ├─ Visit bank
   ├─ Provide account details
   └─ Payment made

Step 4: Payment Received
├─ Bank processes payment
├─ Reaches LMS bank account
├─ Takes 2-24 hours (depending on method)
└─ Amount: ₹4,640
```

#### Day 13 (Day After Payment): Payment Confirmation
```
Step 1: Payment Verification
├─ Admin checks bank account
├─ Sees: ₹4,640 received from customer
└─ Matches: Payment ID and Loan ID

Step 2: Mark as Paid
├─ Admin Dashboard
├─ Go to: Repayments Section
├─ Find: REP0001 (Feb payment)
├─ Click: [Mark as Paid]
├─ Confirmation dialog
└─ Click: OK

Step 3: Update Database
├─ Status changes: PENDING → PAID
├─ Paid Date: 12-Feb-2026
├─ Amount Paid: ₹4,640
├─ Principal Portion: ₹3,567
├─ Interest Portion: ₹1,073
└─ Remaining Balance: ₹96,433

Step 4: SMS Sent
├─ Message: "✓ Payment ₹4,640 received!
│           Principal: ₹3,567
│           Interest: ₹1,073
│           Remaining: ₹96,433
│           Next payment due: 12-Mar-2026"
└─ Sent immediately

Step 5: Dashboard Updated
├─ Customer sees:
│  ├─ Feb payment: PAID ✓
│  ├─ Receipt available
│  ├─ Updated balance
│  └─ Next due date: 12-Mar-2026
└─ Admin sees:
   ├─ Payment collected: ₹4,640
   ├─ Analytics updated
   └─ Next payment pending
```

#### Days 14-43: Repeat for Next Month
```
The same cycle repeats for all 24 months:

Month 1: Feb ✓ Paid
Month 2: Mar ✓ Paid
...
Month 24: Jan 2028 → Final Payment

Each month:
├─ Day 9: Reminder SMS
├─ Day 12: Due date SMS
├─ Day 13: Confirmation SMS (after payment)
└─ Status updated in system
```

---

## 7️⃣ If Payment is Late (Geeri)

### Procedure:
```
Normal Scenario:
├─ Due: 12-Feb
├─ Paid: 12-Feb
└─ Status: ON TIME ✓

Late Scenario:
├─ Due: 12-Feb
├─ Paid: 15-Feb (3 days late)
└─ Status: LATE ⚠️

Step 1: Payment Due Date Passes
├─ Current Date: 13-Feb (1 day after due)
├─ Status: OVERDUE
└─ Penalty applies: 5%

Step 2: SMS Sent (Day 1 Late)
├─ Message: "⚠️ Payment OVERDUE!
│           Amount: ₹4,640
│           Penalty: ₹232 (5%)
│           Total: ₹4,872
│           Please pay immediately"
└─ Sent daily until paid

Step 3: SMS Sent (Day 4 Late)
├─ Message: "⚠️ URGENT: Payment severely overdue!
│           Amount due: ₹4,872
│           Contact us immediately"
└─ Sent daily

Step 4: SMS Sent (Day 7 Late)
├─ Message: "Your account is at risk.
│           Please contact bank immediately.
│           Phone: 1800-LOANMGMT"
└─ Warning SMS

Step 5: SMS Sent (Day 15 Late)
├─ Message: "Final notice: Payment overdue by 15 days.
│           Legal action may be initiated.
│           Call: 1800-LOANMGMT"
└─ Serious warning

Step 6: Customer Pays Late
├─ Pays: ₹4,872 (including penalty)
├─ Admin marks: PAID
├─ Status: LATE PAID
└─ Next payment: 12-Mar

Step 7: SMS Confirmation
├─ Message: "✓ Late payment received: ₹4,872
│           Penalty charged: ₹232
│           Remaining balance: ₹95,000
│           Improve payment on-time rate!"
└─ Sent immediately
```

---

## 8️⃣ Loan Completion (Loan Complete Ho Gaya)

### Procedure:
```
Step 1: After 24 Months
├─ Current Date: Jan 2028
├─ All 24 payments done
├─ Final payment received
└─ Loan balance: ₹0

Step 2: System Updates
├─ Loan Status: ACTIVE → CLOSED
├─ All repayments: PAID ✓
├─ Balance: ₹0
└─ Completed Date: Jan 2028

Step 3: SMS Sent
├─ Message: "🎉 Congratulations!
│           Your loan is PAID OFF!
│           Loan ID: LOAN123
│           Total paid: ₹1,11,360
│           You can apply for new loan now!"
└─ Sent immediately

Step 4: Certificate Generated
├─ Loan completion certificate created
├─ PDF generated with:
│  ├─ Customer name
│  ├─ Loan amount
│  ├─ Period
│  ├─ Total amount paid
│  └─ Completion date
└─ Sent via email

Step 5: Dashboard Updated
├─ Customer Dashboard shows:
│  ├─ Loan: CLOSED ✓
│  ├─ Status: PAID IN FULL
│  ├─ Certificate: Download
│  └─ [Apply New Loan] button enabled
└─ Admin Dashboard shows:
   ├─ Loan completed
   ├─ Revenue collected
   └─ Analytics updated

Step 6: Can Apply Again
├─ Customer is now eligible
├─ Can apply for new loan
├─ Better interest rates (good payment history)
└─ Credit score improved
```

---

## 📊 Reports Available at Each Step

```
STEP 1: After Registration
├─ Account confirmation
└─ Profile verification

STEP 2: After Loan Application
├─ Application receipt
└─ Loan ID

STEP 3: After Approval
├─ Approval letter
├─ Loan agreement
├─ Repayment schedule
└─ EMI calculator

STEP 4: After Disbursement
├─ Disbursement receipt
├─ Fund transfer confirmation
└─ Account statement

STEP 5: Monthly During Repayment
├─ Monthly payment receipt
├─ Statement of account
├─ EMI breakdown
├─ Remaining balance
└─ Payment history

STEP 6: Quarterly
├─ 3-month statement
├─ Payment history (3 months)
├─ Remaining term
└─ Savings analysis

STEP 7: On Loan Completion
├─ Final statement
├─ Complete payment history
├─ Completion certificate
├─ Total interest paid
└─ Credit impact report
```

---

## 🎯 Summary Table

| Step | Action | Time | Notification | Status |
|------|--------|------|--------------|--------|
| 1 | Register | Instant | Email | ACTIVE |
| 2 | Login | Instant | - | LOGGED IN |
| 3 | Apply Loan | 5 mins | SMS | PENDING |
| 4 | Admin Review | 1-2 days | - | REVIEWING |
| 5 | Approval/Reject | Instant | SMS | APPROVED/REJECTED |
| 6 | Disbursement | 24-48 hrs | SMS | DISBURSED |
| 7 | Repayment (x24) | Monthly | SMS | PAID/LATE |
| 8 | Completion | 24 months | SMS | CLOSED |

---

**Simple Flow:**
1. Register → 2. Login → 3. Apply Loan
4. Wait for Approval → 5. Receive Money → 6. Pay Monthly → 7. Loan Done!

**Notifications at Every Step via SMS!** 📱

