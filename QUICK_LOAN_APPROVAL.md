# 🚀 Quick Reference - Loan Approval & Analytics

## ⚡ Quick Start

```bash
# 1. Build the project
mvn clean install -DskipTests

# 2. Start the application
mvn spring-boot:run

# 3. Open in browser
http://localhost:8080/pages/dashboard.html
```

---

## 📊 Dashboard Features

### Top Section (Stats Cards)
- Total Customers registered
- Active Loans (APPROVED status)
- Pending Approvals (awaiting your action)
- Total Disbursed (approved loans amount)

### Analytics Section (NEW!)
4 color-coded cards showing:
```
┌──────────────────────────────────────────────────┐
│  ✓ Approved Loans  │  ⏳ Pending Loans           │
│  Count: 5          │  Count: 3                   │
│  Total: ₹150,000   │  Total: ₹100,000            │
└──────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────┐
│  ✕ Rejected Loans  │  💰 Total Portfolio         │
│  Count: 2          │  ₹500,000 Total             │
│  Total: ₹50,000    │  75% Approved               │
└──────────────────────────────────────────────────┘
```

---

## 💼 Loan Management

### Pending Loans Section
```
┌─────────────────────────────────────────────┐
│ Loan ID    Customer    Amount    Status     │
├─────────────────────────────────────────────┤
│ LOAN001    Rajesh K.   ₹50,000   PENDING    │
│  Buttons:  [Approve]   [Reject]             │
└─────────────────────────────────────────────┘
```

### Actions

#### ✅ Approve Loan
1. Click **[Approve]** button
2. Dialog appears:
   ```
   Approve Loan:
   Loan Amount: ₹50,000
   Customer: Rajesh Kumar
   Interest Rate: 10%
   Loan Term: 24 months
   [OK] [Cancel]
   ```
3. Click OK
4. SMS sent to customer automatically
5. Loan status changes to APPROVED
6. Analytics update instantly

#### ❌ Reject Loan
1. Click **[Reject]** button
2. Prompt appears:
   ```
   Enter rejection reason:
   [______________________________]
   [OK] [Cancel]
   ```
3. Type reason (e.g., "Income verification pending")
4. Click OK
5. SMS sent with reason
6. Loan status changes to REJECTED
7. Analytics update instantly

---

## 📈 Analytics Real-Time Updates

When you approve/reject loans, analytics update instantly:

**Example:**
- Start: 2 approved, 5 pending, 1 rejected
- Approve 1 loan → 3 approved, 4 pending, 1 rejected ✓
- Reject 1 loan → 3 approved, 3 pending, 2 rejected ✓

---

## 🔔 SMS Notifications

### Approval SMS
```
Hi Rajesh Kumar,

Your loan application has been APPROVED!

Loan Amount: ₹50,000
Monthly Installment: ₹2,500
Loan Term: 24 months

Your funds will be disbursed within 24 hours.

LMS Admin
```

### Rejection SMS
```
Hi Rajesh Kumar,

Your loan application has been REJECTED.

Reason: Income verification pending

Please contact us for more information.

LMS Admin
```

---

## 📋 Loan Status Flow

```
PENDING
  ↓
  ├─→ [Approve] → APPROVED → Start Repayment
  └─→ [Reject]  → REJECTED → Application Closed
```

---

## 🎨 Color Coding

| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| APPROVED | 🟢 Green | ✓ | Loan approved, active |
| PENDING | 🟡 Orange | ⏳ | Awaiting approval decision |
| REJECTED | 🔴 Red | ✕ | Application rejected |
| Portfolio | 🔵 Blue | 💰 | Total value of all loans |

---

## 📱 Mobile Usage

Analytics and approval/rejection work on mobile:
- Cards stack vertically on small screens
- Approval/rejection buttons easy to tap
- SMS notifications work same way
- Real-time updates work on all devices

---

## 🔍 Viewing Details

### Approved Loans
View details by clicking loan ID or "View" button

### Customer Details
In Customers section, you can:
- View customer information
- Edit customer details
- Delete customer (if no active loans)

---

## 📊 Reports

### Analytics Show:
- **Approval Rate** - % of loans approved
- **Loan Distribution** - How many in each status
- **Amount Distribution** - How much in each status
- **Portfolio Overview** - Total value at a glance

---

## 🛠️ Troubleshooting

### Approval button not working?
- ✓ Check if MongoDB is connected
- ✓ Check if browser console shows errors (F12)
- ✓ Make sure loan status is "PENDING"

### SMS not sending?
- ✓ Check SMS service configuration in .env
- ✓ Check customer phone number is valid
- ✓ Check server logs for errors

### Analytics not updating?
- ✓ Try refreshing the page
- ✓ Check browser network tab (F12)
- ✓ Ensure /api/loans endpoint returns data

---

## 💡 Tips

1. **Bulk Actions** - Approve multiple loans by doing them one after another
2. **Analytics** - Check approval % to monitor business health
3. **Customer Data** - Ensure phone numbers are correct for SMS
4. **Loan Terms** - Set appropriate interest rates before approval
5. **Reasons** - Use clear rejection reasons for customer records

---

## 🔗 Related Features

- **Customer Management** - Add/edit customers with phone numbers
- **Loan Creation** - Create loan applications
- **Repayment Tracking** - Track customer repayments
- **Dashboard** - All operations from one place

---

## 📞 Support

For issues with:
- **Approval/Rejection**: Check loan status and MongoDB connection
- **SMS Notifications**: Verify .env SMS configuration
- **Analytics**: Clear cache and refresh page
- **Other**: Check server logs with `mvn spring-boot:run`

---

Last Updated: January 12, 2026
Version: 1.0.1 (With Analytics & Fixed Approval)

