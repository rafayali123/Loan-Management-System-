# 📲 Notification System - Complete Explanation

## 🎯 Quick Answer

**کہاں سے جائیں گی (Where it goes):**
- ✓ **SMS** - Customer's phone (Primary)
- ✓ **Email** - Customer's email (Secondary)
- ✓ **Dashboard** - System dashboard (Real-time)

**کیسے جائیں گی (How it goes):**
- ✓ **Automatic** - Triggered by system events
- ✓ **Asynchronous** - Doesn't block system
- ✓ **Background Process** - Runs in thread pool

---

## 📱 Notification Channels

```
CUSTOMER
  │
  ├─► SMS (Phone Number)
  │   └─ Primary channel
  │   └─ Instant delivery
  │   └─ Message: "Dear Rajesh, Your loan..."
  │
  ├─► Email (Email Address)
  │   └─ Secondary channel
  │   └─ Detailed information
  │   └─ Subject: "Loan Application Status"
  │
  └─► Dashboard (In-app)
      └─ Real-time notifications
      └─ Shows on login
      └─ Bell icon notifications
```

---

## 🔔 How SMS Notifications Work

### Architecture

```
EVENT TRIGGERED
(Loan Approved, Payment Due, etc)
        │
        ▼
┌──────────────────────┐
│  Check Phone Number  │
│  From Database       │
└──────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│  SMSNotificationService      │
│  - Create message text       │
│  - Queue in thread pool      │
│  - Execute asynchronously    │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│  Format Phone Number         │
│  - Remove special chars      │
│  - Add country code (+91)    │
│  - Ensure valid format       │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│  Connect to SMS API          │
│  (Twilio, Nexmo, etc)        │
│  - Send HTTP request         │
│  - Pass API key              │
│  - Pass message & phone      │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│  SMS Provider Sends          │
│  Message to Phone            │
│  Via Network                 │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│  Customer Receives SMS       │
│  On Mobile Phone             │
│  Notification appears        │
└──────────────────────────────┘
        │
        ▼
    Log Success/Failure
    In System Logs
```

---

## 🔧 How It's Configured

### File: `.env` (Environment Variables)

```env
# SMS Configuration
SMS_API_URL=https://api.sms-provider.com/send
SMS_API_KEY=your_api_key_here_12345
SMS_SENDER_ID=LoanMgmt
```

### Where Are These Variables Used?

```
.env File
  │
  ├─► SMS_API_KEY
  │   └─ Authentication with SMS provider
  │   └─ Required to send SMS
  │   └─ Kept secret (not in code)
  │
  ├─► SMS_API_URL
  │   └─ Endpoint to send SMS
  │   └─ Provider's server address
  │   └─ HTTP POST request sent here
  │
  └─► SMS_SENDER_ID
      └─ "From" name in SMS
      └─ Shows as: "LoanMgmt: Your message..."
      └─ Recognizable to customer
```

---

## 📊 5 Types of Loan Notifications

### 1️⃣ **Loan Application Received**

```
WHEN: Customer submits loan application
WHO: Sent to customer phone
MESSAGE:
  "Dear Rajesh,
   Your loan application has been received.
   Application ID: LOAN123
   We will review and contact you within 24 hours.
   Thank you!"
```

### 2️⃣ **Loan Approval Notification**

```
WHEN: Admin approves loan
WHO: Sent to customer phone
MESSAGE:
  "Dear Rajesh,
   Congratulations! Your loan application has been APPROVED.
   Loan Amount: ₹1,00,000
   Monthly EMI: ₹4,640
   Loan Term: 24 months
   Your funds will be transferred within 24-48 hours.
   Loan ID: LOAN123"
```

### 3️⃣ **Loan Rejection Notification**

```
WHEN: Admin rejects loan
WHO: Sent to customer phone
MESSAGE:
  "Dear Rajesh,
   We regret to inform that your loan application has been REJECTED.
   Application ID: LOAN123
   Reason: Income verification pending
   You can reapply after submitting required documents.
   Contact us: 1800-LOANMGMT"
```

### 4️⃣ **Payment Reminder Notification**

```
WHEN: 3 days before payment due date
WHO: Sent to customer phone
MESSAGE:
  "Dear Rajesh,
   Reminder: Your loan payment of ₹4,640 is due on 12-Feb-2026.
   3 days remaining. Please ensure timely payment.
   Pay online: [Link]
   Thank you!"
```

### 5️⃣ **Payment Overdue Notification**

```
WHEN: After payment due date (if not paid)
WHO: Sent to customer phone
MESSAGE:
  "Dear Rajesh,
   ⚠️ URGENT: Your loan payment is OVERDUE!
   Original Amount: ₹4,640
   Penalty (5%): ₹232
   Total Due: ₹4,872
   Please pay immediately to avoid further action.
   Contact: 1800-LOANMGMT"
```

---

## 🔄 Notification Flow at Each Stage

### Stage 1: Registration
```
Customer Registers
    ↓
Email Sent: "Welcome to LMS"
    ├─ Subject: "Account Created"
    ├─ Verification link
    └─ Login credentials
```

### Stage 2: Loan Application
```
Customer Applies for Loan
    ↓
SMSNotificationService.sendApplicationReceivedNotification()
    ↓
Extract Phone: +919876543210
Format Phone: +919876543210 (if needed)
    ↓
Connect to SMS API
    ↓
Send Message:
  "Your loan application has been received.
   Application ID: LOAN123
   We will review and contact you within 24 hours."
    ↓
SMS Appears on Phone ✓
```

### Stage 3: Admin Approves/Rejects
```
Admin Clicks: [Approve] or [Reject]
    ↓
IF APPROVE:
  └─ LoanController.approveLoan()
     ├─ Save to database
     ├─ SMSNotificationService.sendLoanApprovalNotification()
     └─ SMS sent to customer
    
IF REJECT:
  └─ LoanController.rejectLoan()
     ├─ Save to database
     ├─ SMSNotificationService.sendLoanRejectionNotification()
     └─ SMS sent with reason
    ↓
Customer Receives SMS ✓
```

### Stage 4: Disbursement
```
Loan Approved
    ↓
Auto-trigger disbursement
    ↓
Email Sent: "Disbursement initiated"
    ↓
24-48 Hours Later
    ↓
Money Credited to Account
    ↓
SMS Sent: "✓ ₹1,00,000 credited successfully"
    ↓
Customer Sees in Bank App ✓
```

### Stage 5: Monthly Payment
```
3 Days Before Due Date:
    ├─ System checks: today + 3 days = due date?
    ├─ YES → SMSNotificationService.sendInstallmentReminderNotification()
    ├─ Extract: phone, name, amount, due date
    ├─ Create message: "Reminder: ₹4,640 due on 12-Feb"
    ├─ Send via SMS API
    └─ SMS Delivered ✓

On Due Date:
    ├─ SMS: "Payment due today! ₹4,640"
    └─ Customer pays

After Payment:
    ├─ Admin marks PAID
    ├─ SMSNotificationService.sendPaymentConfirmationNotification()
    ├─ SMS: "✓ Payment ₹4,640 received!"
    └─ SMS Delivered ✓

If Payment Overdue:
    ├─ System detects: payment not received by due date
    ├─ SMSNotificationService.sendOverdueNotification()
    ├─ SMS: "⚠️ Payment OVERDUE! Amount + Penalty"
    ├─ Repeat daily until paid
    └─ SMS Delivered ✓
```

---

## 🏗️ Technical Implementation

### Java Code Structure

```
SMSNotificationService.java
├─ sendLoanApprovalNotification()
│  └─ Called when admin approves
│  └─ Queue: executorService.execute()
│  └─ Async: Doesn't block
│
├─ sendLoanRejectionNotification()
│  └─ Called when admin rejects
│  └─ Includes: reason
│  └─ Async: Non-blocking
│
├─ sendInstallmentReminderNotification()
│  └─ Called 3 days before payment
│  └─ Scheduled: By system
│  └─ Async: Background execution
│
├─ sendOverdueNotification()
│  └─ Called when payment overdue
│  └─ Includes: amount + penalty
│  └─ Async: Repeats daily
│
├─ sendPaymentConfirmationNotification()
│  └─ Called when payment marked paid
│  └─ Confirms: amount & date
│  └─ Async: Immediate
│
└─ sendSMS() [Private]
   ├─ Format phone number
   ├─ Build API request
   ├─ Connect to SMS provider
   ├─ Send HTTP POST
   ├─ Handle response
   └─ Log success/failure
```

### Thread Pool (Background Processing)

```
ExecutorService Configuration:
├─ Core Threads: 10
│  └─ Always ready to process
│  └─ Min: 10 tasks in parallel
│
├─ Max Threads: (via queue)
├─ Queue Capacity: 100
│  └─ Can queue 100 pending SMS
│  └─ If full: Block until space
│
├─ Benefit:
│  ├─ SMS doesn't slow down app
│  ├─ Approval response instant
│  ├─ Email/SMS sent in background
│  └─ Customer experience smooth
│
└─ When App Stops:
   └─ executorService.shutdown()
   └─ Completes pending tasks
   └─ Graceful shutdown
```

---

## 🚀 SMS Provider Integration

### Supported Providers

```
TWILIO (Recommended)
├─ URL: https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json
├─ Authentication: Account SID + Auth Token
├─ Pricing: 0.5 - 1 INR per SMS
└─ Features: Global, reliable, tracking

NEXMO/VONAGE
├─ URL: https://rest-api.nexmo.com/sms/json
├─ Authentication: API Key + Secret
├─ Pricing: 0.3 - 0.8 INR per SMS
└─ Features: Fast, good in Asia

MSG91
├─ URL: https://api.msg91.com/api/sendhttp.php
├─ Authentication: Auth Key
├─ Pricing: 0.2 - 0.5 INR per SMS
└─ Features: India-focused, cheap

AWS SNS
├─ URL: AWS API endpoint
├─ Authentication: AWS credentials
├─ Pricing: 0.4 - 1.2 INR per SMS
└─ Features: Scalable, integrated
```

### How to Configure

```
.env File:
SMS_API_URL=https://api.msg91.com/api/sendhttp.php
SMS_API_KEY=your_auth_key_here
SMS_SENDER_ID=LoanMgmt

Code Flow:
1. Read from .env:
   Dotenv dotenv = Dotenv.load()
   String apiKey = dotenv.get("SMS_API_KEY")

2. Build request:
   URL = SMS_API_URL + "?apikey=" + apiKey + "&mobile=" + phone + "&message=" + msg

3. Send:
   HttpURLConnection → POST → Response
```

---

## 📊 Complete Notification Map

```
EVENT TRIGGERED                  NOTIFICATION SENT
────────────────────────────────────────────────────────
Registration                  → Email: Welcome
Loan Application Submitted    → SMS: App Received
Loan Approved                 → SMS: Approved
Loan Rejected                 → SMS: Rejected + Reason
Disbursement Initiated        → Email: Money transferring
Money Credited                → SMS: ✓ Money received
3 Days Before Payment         → SMS: Payment reminder
Payment Due Date              → SMS: Payment due today
Payment Received              → SMS: ✓ Payment confirmed
Payment Overdue (1st day)     → SMS: ⚠️ Overdue alert
Payment Overdue (Daily)       → SMS: Still overdue
Loan Completed                → SMS: 🎉 Loan paid off
                              → Email: Certificate attached
```

---

## 🔐 Security & Privacy

### Phone Number Storage

```
Registration:
├─ Customer enters phone: +919876543210
├─ Validated: Format check
├─ Stored in MongoDB: Encrypted field
└─ Used only for: SMS notifications

SMS Content:
├─ No passwords sent
├─ No credit card info
├─ No private details
├─ Only: Loan status, amounts, dates
└─ Professional message tone

Data Protection:
├─ Phone number: Encrypted in DB
├─ API keys: In .env (not in code)
├─ Logs: SMS shown as asterisks (masked)
└─ Retention: Per SMS provider policy
```

---

## ⚙️ How It Works Step-by-Step

### Example: Payment Due in 3 Days

```
DAY 1 (Customer takes loan)
├─ Repayment created
├─ Due Date Set: 12-Feb-2026
└─ Status: DUE

DAY 9 (3 days before)
├─ System checks: Is today day 9?
├─ Is due date 3 days away?
├─ YES!
├─ Call: SMSNotificationService.sendInstallmentReminderNotification()
├─ Params:
│  ├─ phoneNumber: +919876543210
│  ├─ customerName: Rajesh Kumar
│  ├─ installmentAmount: 4640
│  └─ dueDate: 12-Feb-2026
├─ Queue in thread pool
├─ Execute asynchronously:
│  ├─ Format phone
│  ├─ Build message
│  ├─ Connect to SMS API
│  ├─ Send POST request
│  └─ Log result
└─ SMS sent to phone ✓

CUSTOMER'S PHONE
├─ Notification: "Reminder: ₹4,640 due on 12-Feb"
├─ From: LoanMgmt
├─ Received at: 6:00 AM (example)
└─ Customer sees notification ✓
```

---

## 📱 Example SMS Messages

### Approval

```
Received on: +919876543210

LoanMgmt: Dear Rajesh, Your loan application 
(ID: LOAN123) for amount ₹1,00,000 has been 
APPROVED. Please visit our office to complete 
the formalities. Thank you!
```

### Rejection

```
Received on: +919876543210

LoanMgmt: Dear Rajesh, We regret to inform that 
your loan application (ID: LOAN123) has been 
REJECTED. Reason: Income verification pending. 
For more details, please contact our office. 
Thank you!
```

### Payment Reminder

```
Received on: +919876543210

LoanMgmt: Dear Rajesh, This is a reminder that 
your loan installment of ₹4,640 is due on 
12-Feb-2026. Please ensure timely payment to 
avoid penalties. Thank you!
```

### Payment Overdue

```
Received on: +919876543210

LoanMgmt: Dear Rajesh, Your loan installment is 
OVERDUE. Pending amount: ₹4,640, Penalty: ₹232. 
Please pay immediately to avoid further action. 
Thank you!
```

### Payment Confirmed

```
Received on: +919876543210

LoanMgmt: Dear Rajesh, Your loan installment 
payment of ₹4,640 has been successfully received 
on 12-Feb-2026. Thank you for your timely payment!
```

---

## 🎯 Summary

| Aspect | Details |
|--------|---------|
| **Where** | Phone (SMS), Email, Dashboard |
| **How** | SMS API (Twilio/Nexmo/MSG91) |
| **When** | Triggered by events (approval, payment, etc) |
| **Speed** | Asynchronous (doesn't block system) |
| **Threads** | 10 core threads in thread pool |
| **Types** | 5+ notification types |
| **Security** | Encrypted phone, API key in .env |
| **Customizable** | Message templates, timing |
| **Logging** | All sent/failed SMS logged |

---

## ✅ Ready to Use

✓ SMS service implemented
✓ 5 notification types created
✓ Thread pool configured
✓ Error handling included
✓ Logging implemented
✓ Security considered
✓ Customizable messages
✓ Async processing

**Just configure .env with SMS provider credentials and it works!** 📱

