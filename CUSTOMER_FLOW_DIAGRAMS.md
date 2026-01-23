# 📊 Customer Flow - Visual Diagrams

## 🔄 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOAN MANAGEMENT SYSTEM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐              ┌──────────────┐                │
│  │  CUSTOMER    │              │   ADMIN      │                │
│  │   PORTAL     │              │  DASHBOARD   │                │
│  ├──────────────┤              ├──────────────┤                │
│  │ • Register   │              │ • Review App │                │
│  │ • Apply Loan │◄────────────►│ • Approve    │                │
│  │ • View Loans │              │ • Reject     │                │
│  │ • Pay EMI    │              │ • Track $    │                │
│  │ • Reports    │              │ • Analytics  │                │
│  └──────────────┘              └──────────────┘                │
│         │                              │                        │
│         │                              │                        │
│         └──────────┬───────────────────┘                        │
│                    │                                            │
│              ┌─────▼──────┐                                     │
│              │  MONGODB   │                                     │
│              │  DATABASE  │                                     │
│              ├────────────┤                                     │
│              │ • customers│                                     │
│              │ • loans    │                                     │
│              │ • repay    │                                     │
│              │ • admin    │                                     │
│              └────────────┘                                     │
│                    │                                            │
│              ┌─────▼──────────┐                                │
│              │    SMS SERVICE │                                │
│              │    (Twilio)    │                                │
│              ├────────────────┤                                │
│              │ Send to Phone  │                                │
│              └────────────────┘                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👤 Customer Registration to Loan Approval Flow

```
START: Customer Registration
│
├─ Open: http://localhost:8080/pages/register.html
│
├─ Enter Details:
│  ├─ Name: Rajesh Kumar
│  ├─ Email: rajesh@gmail.com
│  ├─ Phone: +919876543210
│  └─ Password: MySecure@123
│
├─ Submit
│
├─ Backend Validation:
│  ├─ Check duplicate email
│  ├─ Check duplicate username
│  ├─ Validate password strength
│  └─ Encrypt password
│
├─ Save to MongoDB:
│  └─ customers collection
│
├─ Response:
│  └─ "Account Created Successfully"
│
├─ Redirect: Login Page
│
├─ Login with Credentials:
│  ├─ Email: rajesh@gmail.com
│  └─ Password: MySecure@123
│
├─ Session Created:
│  └─ Store session token
│
├─ Redirect: Customer Dashboard
│
├─ Customer Dashboard Shows:
│  ├─ Welcome message
│  ├─ Profile info
│  ├─ My loans section
│  ├─ Quick stats
│  └─ [Apply Loan] button
│
├─ Customer Clicks: [Apply Loan]
│
├─ Loan Form Displayed:
│  ├─ Loan Amount: ₹____
│  ├─ Loan Type: [Personal/Home/Business]
│  ├─ Purpose: __________
│  ├─ Loan Term: ___ months
│  ├─ Employment: [Salaried/Business]
│  └─ Documents: [Upload Files]
│
├─ Customer Fills & Submits
│
├─ Backend Validation:
│  ├─ Amount check
│  ├─ EMI calculation
│  ├─ Income verification
│  └─ Document validation
│
├─ Save to MongoDB:
│  └─ loans collection with status: PENDING
│
├─ SMS Sent:
│  └─ "Application received. Will contact in 24 hours"
│
├─ Dashboard Shows:
│  └─ "Loan Application Submitted (ID: LOAN123)"
│
├─ Customer Waits (1-2 days)
│
├─ ADMIN REVIEWS:
│  ├─ Checks MongoDB
│  ├─ Views: LOAN123, Rajesh Kumar, ₹1,00,000
│  ├─ Verifies documents
│  ├─ Checks income
│  └─ Makes decision
│
├─ ADMIN DECIDES:
│  ├─ [Approve] Button clicked
│  │
│  ├─ Backend Updates:
│  │  ├─ Status: PENDING → APPROVED
│  │  ├─ Approval Date: 2026-01-12
│  │  ├─ EMI Calculated: ₹4,640
│  │  ├─ Loan Start Date: 2026-02-12
│  │  ├─ Loan End Date: 2028-02-11
│  │  └─ Save to MongoDB
│  │
│  ├─ SMS Sent:
│  │  └─ "Loan ₹1,00,000 APPROVED!
│  │      Monthly Payment: ₹4,640
│  │      First payment: 12-Feb-2026"
│  │
│  ├─ Customer Receives SMS ✓
│  │
│  └─ Dashboard Updated:
│     └─ Status: APPROVED ✓
│
└─ END: Loan Approved

CONTINUE TO: Disbursement & Repayment
```

---

## 💰 Disbursement to Repayment Flow

```
STAGE: Loan Approved - DISBURSEMENT
│
├─ Auto-Triggered:
│  ├─ Amount: ₹1,00,000
│  ├─ Customer Bank Account
│  ├─ Transfer Type: NEFT/IMPS
│  └─ Processing Time: 24-48 hours
│
├─ SMS Sent:
│  └─ "Loan amount ₹1,00,000 disbursed. 
│      Will credit in 24-48 hours"
│
├─ Customer Bank:
│  └─ ₹1,00,000 Received ✓
│
├─ SMS Confirmation:
│  └─ "✓ ₹1,00,000 credited to your account"
│
├─ Dashboard Updated:
│  └─ Loan Status: ACTIVE
│
│
STAGE: Monthly Repayment Cycle (24 months)
│
├─ MONTH 1 (Feb 2026):
│  │
│  ├─ Day 9 (3 days before):
│  │  └─ SMS: "Reminder: ₹4,640 due on 12-Feb"
│  │
│  ├─ Day 12 (Due date):
│  │  ├─ SMS: "Payment due today! ₹4,640"
│  │  └─ Dashboard shows: AMOUNT DUE
│  │
│  ├─ Customer Pays:
│  │  ├─ Online banking
│  │  ├─ Phone app
│  │  └─ Bank transfer: ₹4,640
│  │
│  ├─ Admin Marks Paid:
│  │  ├─ Dashboard → Repayments section
│  │  ├─ Finds repayment ID
│  │  ├─ Clicks [Mark as Paid]
│  │  └─ Status: PENDING → PAID
│  │
│  ├─ SMS Sent:
│  │  └─ "✓ Payment ₹4,640 received!
│  │      Next due: 12-Mar-2026"
│  │
│  └─ Dashboard Updated:
│     └─ Month 1: PAID ✓
│
├─ MONTH 2 (Mar 2026):
│  └─ Same cycle repeats
│
├─ ... (MONTHS 3-23)
│  └─ Same cycle repeats monthly
│
├─ MONTH 24 (Jan 2028):
│  │
│  ├─ Final Payment: ₹4,640
│  │
│  ├─ Customer Pays
│  │
│  ├─ Admin Marks PAID
│  │
│  └─ SMS: "✓ Final payment received!"
│
├─ System Updates:
│  ├─ Loan Status: ACTIVE → CLOSED
│  ├─ All repayments: PAID
│  └─ Save to MongoDB
│
├─ SMS Sent:
│  └─ "🎉 Congratulations! 
│      Loan completed successfully!
│      Loan certificate attached"
│
└─ END: Loan Fully Repaid

NEXT: Customer can apply for new loan
```

---

## 📲 Notification Timeline

```
CUSTOMER JOURNEY WITH NOTIFICATIONS:

Day 1: Registration
  └─ Email: "Welcome to LMS. Confirm your email"

Day 2: Login & Apply Loan
  └─ SMS: "Loan application received. Review in 24 hours"

Day 3: Admin Reviews & Approves
  └─ SMS: "✓ Loan ₹1,00,000 APPROVED!
           Monthly: ₹4,640
           First due: 12-Feb-2026"

Day 5-10: Fund Disbursement
  └─ SMS: "Loan amount ₹1,00,000 transferred.
           Will credit in 24-48 hours"

Day 11: Fund Received
  └─ SMS: "✓ ₹1,00,000 credited to your account"

Day 40 (3 days before Month 1):
  └─ SMS: "Reminder: ₹4,640 due on 12-Feb"

Day 43 (Due date):
  └─ SMS: "Payment due today! ₹4,640"

Day 44 (Day after payment):
  └─ SMS: "✓ ₹4,640 payment received!
           Next due: 12-Mar-2026"

Day 71 (Month 2, 3 days before):
  └─ SMS: "Reminder: ₹4,640 due on 12-Mar"

...
(Pattern repeats monthly for 24 months)
...

Month 24 (Jan 2028):
  ├─ SMS: "Final reminder: ₹4,640 due 12-Jan"
  ├─ SMS: "Final payment due today!"
  └─ SMS: "🎉 Loan COMPLETED! Certificate sent"
```

---

## 📊 Report Generation Timeline

```
REPORTS AVAILABLE TO CUSTOMER:

IMMEDIATELY (On Demand):
├─ My Loans Summary
├─ Active Loan Details
├─ Current Balance
└─ Next Payment Due

MONTHLY:
├─ Payment History Report
├─ EMI Breakdown
├─ Interest vs Principal
└─ Payment Status Update

QUARTERLY:
├─ Loan Progress Report
├─ Payment Behavior Analysis
├─ Credit Impact Summary
└─ Next 3 months schedule

AT LOAN COMPLETION:
├─ Final Loan Statement
├─ Complete Payment History
├─ Total Interest Paid
├─ Credit Score Impact
└─ Loan Completion Certificate

ON DEMAND:
├─ Print any statement
├─ Download PDF reports
├─ Email statement
└─ Export to Excel
```

---

## 🚨 Payment Default Scenario

```
NORMAL PAYMENT FLOW:
┌─────────────────────────────────────┐
│ Payment Due: 12-Feb | Amount: ₹4,640│
├─────────────────────────────────────┤
│ Day 9:  Reminder SMS                │
│ Day 12: Due date SMS                │
│ Day 12: Customer Pays ✓             │
│ Day 13: Confirmation SMS            │
│ Status: PAID ✓                      │
└─────────────────────────────────────┘

LATE PAYMENT FLOW:
┌─────────────────────────────────────┐
│ Payment Due: 12-Feb | Amount: ₹4,640│
├─────────────────────────────────────┤
│ Day 9:  Reminder SMS                │
│ Day 12: Due date SMS                │
│ Day 13: No payment                  │
│ Day 14: Overdue SMS (1 day late)    │
│         "₹4,640 overdue"            │
│ Day 17: Overdue SMS (4 days late)   │
│         "₹4,640 overdue             │
│          Penalty: ₹232 (5%)         │
│          Total: ₹4,872"             │
│ Day 20: Overdue SMS (7 days late)   │
│         "Payment severely overdue"  │
│ Day 30: Warning call from bank      │
│ Day 45: Final notice sent           │
│ Status: OVERDUE ⚠️                  │
└─────────────────────────────────────┘

AFTER PAYMENT:
├─ Admin marks: PAID
├─ Penalty included in next payment
├─ Customer receives confirmation
└─ Status updated
```

---

## 📈 Analytics Dashboard (Admin vs Customer)

```
ADMIN DASHBOARD:
┌─────────────────────────────────┐
│  System Analytics               │
├─────────────────────────────────┤
│ Total Customers: 150            │
│ Total Loans Disbursed: ₹1.5 Cr  │
│ Active Loans: 45                │
│ Approved: 48                    │
│ Rejected: 12                    │
│ Default Rate: 2%                │
│ On-Time Payment Rate: 98%       │
│ Total Interest Collected: ₹25L  │
│ Average EMI: ₹5,200            │
│ Expected Monthly Revenue: ₹2.34L│
│                                 │
│ Pie Chart: Loan Types           │
│ Bar Chart: Monthly Applications │
│ Trend: Approval Rate            │
└─────────────────────────────────┘

CUSTOMER DASHBOARD:
┌─────────────────────────────────┐
│  My Loan Analytics              │
├─────────────────────────────────┤
│ Active Loans: 1                 │
│ Completed Loans: 0              │
│ Total Borrowed: ₹1,00,000       │
│ Amount Paid: ₹23,200 (23%)      │
│ Amount Remaining: ₹76,800 (77%)│
│ Next Payment: ₹4,640            │
│ Due Date: 12-Jul-2026           │
│ Days Remaining: 23              │
│ Payment Status: ON-TIME ✓       │
│ Credit Score Impact: +12 pts    │
│                                 │
│ Progress Bar: 33% Complete      │
│ Payment Trend: All On-Time      │
│ Savings Tips: ...               │
└─────────────────────────────────┘
```

---

## 🔐 Data Flow Security

```
CUSTOMER DATA FLOW:
┌──────────────────┐
│  Customer Input  │ (Registration form)
└────────┬─────────┘
         │
    ┌────▼─────────────────┐
    │  Validation Layer    │ (Password strength, email format, etc)
    └────┬─────────────────┘
         │
    ┌────▼─────────────────┐
    │  Encryption Layer    │ (Password hashed with bcrypt)
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │  MongoDB Save         │ (Secure database)
    └────┬──────────────────┘
         │
         └─── Data Stored Safely ✓

NOTIFICATION FLOW:
┌──────────────────────┐
│  Event Triggered     │ (Loan approved, payment due, etc)
└────┬─────────────────┘
     │
┌────▼──────────────────────┐
│  Create Notification      │ (Prepare message)
└────┬──────────────────────┘
     │
┌────▼──────────────────────┐
│  Sanitize Data            │ (Remove sensitive info)
└────┬──────────────────────┘
     │
┌────▼──────────────────────┐
│  Queue Task               │ (ThreadPool)
└────┬──────────────────────┘
     │
┌────▼──────────────────────┐
│  Send via SMS Service     │ (Async - non-blocking)
└────┬──────────────────────┘
     │
     └─── SMS Delivered ✓
```

---

## 🎯 Key Touchpoints Summary

```
Registration
    ↓
Login
    ↓
Dashboard [View Profile]
    ↓
Apply Loan
    ├─ SMS: App Received
    ├─ Wait 1-2 days
    ├─ Admin Review
    │
    └─→ APPROVED
        ├─ SMS: Approved
        ├─ SMS: Disbursed
        ├─ Fund Transfer (24-48h)
        │
        └─→ Repayment Starts
            ├─ Month 1-24: Monthly Reminders
            │  ├─ SMS: 3 days before
            │  ├─ SMS: On due date
            │  └─ SMS: After payment
            │
            └─→ Loan Completed
                ├─ SMS: Final payment received
                ├─ SMS: Loan closed
                └─ Certificate issued
```

---

## 🌐 Integration Points

```
┌─────────────────────────────────────────┐
│  LOAN MANAGEMENT SYSTEM                 │
├─────────────────────────────────────────┤
│                                         │
│  Integrates with:                       │
│  ├─ MongoDB (Database)                  │
│  ├─ Twilio/SMS API (Notifications)      │
│  ├─ Email Service (Gmail/SendGrid)      │
│  ├─ Bank Gateway (Fund Transfer)        │
│  ├─ Payment Gateway (Online Payment)    │
│  └─ Authentication (JWT Tokens)         │
│                                         │
│  Sends Data To:                         │
│  ├─ Customer Phone (SMS)                │
│  ├─ Customer Email (Statements)         │
│  ├─ Bank Account (Fund Transfer)        │
│  └─ Admin Dashboard (Reports)           │
│                                         │
│  Receives Data From:                    │
│  ├─ Customer Forms (Registration)       │
│  ├─ Loan Applications                   │
│  ├─ Payment Confirmations               │
│  └─ Admin Actions (Approval)            │
│                                         │
└─────────────────────────────────────────┘
```

---

**Complete Customer Journey:**
Registration → Login → Apply Loan → Admin Review → Approval → Disbursement → Monthly Repayment → Loan Completion

**All with SMS Notifications at Every Step!**

